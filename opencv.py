import cv2
from flask import Flask, Response, request, jsonify
from flask_cors import CORS
import time
from threading import Thread, Event
import queue

app = Flask(__name__)
CORS(app)

stream_threads = {}
stream_events = {}
frame_queues = {}  # 프레임 큐


def connect_to_stream(source, retry_interval=3):
    """스트림 연결 시도 및 재시도"""
    cap = None
    attempts = 0
    while attempts < 5:  # 최대 5회 시도
        if cap:
            cap.release()  # 이전 객체가 있으면 강제 해제
        cap = cv2.VideoCapture(source)
        if cap.isOpened():
            print(f"Stream connected successfully: {source}")
            cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)  # 최신 프레임만 읽도록 설정
            return cap
        else:
            print(f"Failed to connect to stream {source}. Attempt {attempts + 1}/5")
        attempts += 1
        time.sleep(retry_interval)

    print(f"Failed to connect to stream {source} after 5 attempts.")
    raise RuntimeError(f"Unable to connect to stream: {source}")


def read_frames(source, stop_event):
    """스트림에서 프레임 읽기"""
    cap = connect_to_stream(source)
    frame_queue = frame_queues[source]

    # FPS 추출
    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps <= 0:  # FPS가 0 또는 알 수 없는 경우 기본값 사용
        fps = 30  # 기본값: 30 FPS
    frame_interval = 1.0 / fps  # FPS에 맞게 간격 설정

    last_frame_time = time.time()

    try:
        while not stop_event.is_set():
            ret, frame = cap.read()
            if not ret:
                print(f"Frame read failed for {source}. Reconnecting...")
                cap.release()
                cap = connect_to_stream(source)
                continue

            current_time = time.time()
            if current_time - last_frame_time >= frame_interval:  # FPS 제한
                if frame_queue.qsize() < 50:  # 큐 크기 제한
                    frame_queue.put(frame)
                last_frame_time = current_time
            else:
                time.sleep(max(0, frame_interval - (current_time - last_frame_time)))  # FPS 유지
    except Exception as e:
        print(f"Error in read_frames for {source}: {e}")
    finally:
        cap.release()
        print(f"Stopped reading frames for {source}.")


def generate_stream(source, stop_event):
    """스트림 생성"""
    frame_queue = frame_queues[source]

    # FPS 추출
    cap = cv2.VideoCapture(source)
    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps <= 0:  # 기본 FPS 설정
        fps = 30
    cap.release()

    frame_interval = 1.0 / fps  # 프레임 간 시간 간격
    last_frame_time = time.time()

    try:
        while not stop_event.is_set():
            if not frame_queue.empty():
                frame = frame_queue.get()
                _, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
                frame_bytes = buffer.tobytes()

                current_time = time.time()
                time_to_wait = max(0, frame_interval - (current_time - last_frame_time))
                if time_to_wait > 0:
                    time.sleep(time_to_wait)

                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
                last_frame_time = time.time()
            else:
                time.sleep(0.01)  # 큐가 비어있으면 대기
    except Exception as e:
        print(f"Error in generate_stream for {source}: {e}")
    finally:
        print(f"Stopped generating stream for {source}.")


@app.route('/stream', methods=['GET'])
def stream_video():
    """스트림 요청"""
    source = request.args.get('hlsAddr')
    if not source:
        return jsonify({"error": "Missing 'hlsAddr' query parameter"}), 400

    # 기존 스트림 종료 처리
    if source in stream_threads:
        stop_existing_stream(source)

    # 프레임 큐 초기화
    frame_queues[source] = queue.Queue()

    # 새 스트림 시작
    stop_event = Event()
    stream_events[source] = stop_event

    # 스레드 생성
    read_thread = Thread(target=read_frames, args=(source, stop_event))
    stream_threads[source] = [read_thread]

    # 스레드 시작
    read_thread.start()
    print(f"Stream from {source} started.")

    return Response(
        generate_stream(source, stop_event),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )


def stop_existing_stream(source):
    """기존 스트림 안전 종료"""
    print(f"Stopping existing stream for {source}...")
    if source in stream_events:
        stop_event = stream_events[source]
        stop_event.set()  # 스트림 종료 신호 전달
        for thread in stream_threads[source]:
            thread.join()  # 모든 스레드 종료 대기
        del stream_threads[source]
        del stream_events[source]
        del frame_queues[source]
        print(f"Existing stream for {source} successfully stopped.")
    else:
        print(f"No active stream found for {source}.")


@app.route('/stop-stream', methods=['POST'])
def stop_stream():
    """스트림 종료"""
    data = request.get_json()
    source = data.get('hlsAddr')
    if not source:
        return jsonify({"error": "Missing 'hlsAddr' parameter"}), 400

    stop_existing_stream(source)
    return jsonify({"message": f"Stream from {source} stopped."}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
