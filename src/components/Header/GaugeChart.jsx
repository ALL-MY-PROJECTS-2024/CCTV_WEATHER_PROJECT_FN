import React, { useRef, useEffect } from 'react';

const GaugeChart = ({ level }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const centerX = canvas.width / 2;
    const centerY = canvas.height - 30;
    const radius = 100;
    const innerRadius = 60;
    const fontFamily = 'Pretendard, Arial, sans-serif';

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const sections = [
      { color: 'rgba(255, 99, 71, 0.9)', text: '위험', startAngle: -Math.PI, endAngle: -0.75 * Math.PI },
      { color: 'rgba(255, 193, 7, 0.9)', text: '경계', startAngle: -0.75 * Math.PI, endAngle: -0.5 * Math.PI },
      { color: 'rgba(75, 0, 130, 0.8)', text: '주의', startAngle: -0.5 * Math.PI, endAngle: -0.25 * Math.PI },
      { color: 'rgba(76, 175, 80, 0.8)', text: '안전', startAngle: -0.25 * Math.PI, endAngle: 0 },
    ];

    sections.forEach(({ color, text, startAngle, endAngle }) => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      const angle = (startAngle + endAngle) / 2;
      const textX = centerX + (radius + innerRadius) / 2 * Math.cos(angle);
      const textY = centerY + (radius + innerRadius) / 2 * Math.sin(angle);

      ctx.fillStyle = 'white';
      ctx.font = `12px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, textX, textY);
    });

    const levelMap = {
      '위험': -0.875 * Math.PI,
      '경계': -0.625 * Math.PI,
      '주의': -0.375 * Math.PI,
      '안전': -0.125 * Math.PI,
    };
    const targetAngle = levelMap[level] || levelMap['경계'];

    // 애니메이션을 위한 변수 설정
    let currentAngle = -Math.PI; // 시작 각도
    const step = (targetAngle - currentAngle) / 20; // 애니메이션의 각도 변화

    const animateNeedle = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 게이지 섹션 다시 그리기
      sections.forEach(({ color, text, startAngle, endAngle }) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();

        const angle = (startAngle + endAngle) / 2;
        const textX = centerX + (radius + innerRadius) / 2 * Math.cos(angle);
        const textY = centerY + (radius + innerRadius) / 2 * Math.sin(angle);

        ctx.fillStyle = 'white';
        ctx.font = `12px ${fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, textX, textY);
      });

      const needleLength = innerRadius + 3;
      const needleWidth = 10;

      ctx.beginPath();
      ctx.moveTo(
        centerX + needleWidth * Math.cos(currentAngle + Math.PI / 2),
        centerY + needleWidth * Math.sin(currentAngle + Math.PI / 2)
      );
      ctx.lineTo(
        centerX + needleLength * Math.cos(currentAngle),
        centerY + needleLength * Math.sin(currentAngle)
      );
      ctx.lineTo(
        centerX + needleWidth * Math.cos(currentAngle - Math.PI / 2),
        centerY + needleWidth * Math.sin(currentAngle - Math.PI / 2)
      );
      ctx.closePath();
      ctx.fillStyle = 'rgb(76, 175, 80)';
      ctx.fill();

      // 바늘 중심 원
      ctx.beginPath();
      ctx.arc(centerX, centerY, 10, 0, Math.PI * 3);
      ctx.fillStyle = 'rgb(76, 175, 80)';
      ctx.fill();

      if (currentAngle < targetAngle) {
        currentAngle += step;
        requestAnimationFrame(animateNeedle);
      }
    };

    animateNeedle();

  }, [level]);

  return (
    <div style={{ textAlign: 'center', backgroundColor: "white", borderRadius: "5px" }}>
      <div className="title" style={{ padding: "10px", textAlign: "left", display: "flex", justifyContent: "left", alignItems: "center", height: "35px" }}>
        <img src="https://safecity.busan.go.kr/vue/img/ico-falv.47714d6f.svg" alt="icon" />
        &nbsp;도시 침수 위험 상태
      </div>
      <div style={{ padding: "0 5px", height: "1px", borderBottom: "1px solid gray", width: "100%", backgroundColor: "gray" }}></div>
      <canvas ref={canvasRef} width="250" height="140" />
      <p style={{ color: 'gray', fontSize: '12px', fontWeight: "100", fontFamily: 'Pretendard-Regular', position: "relative", top: "-20px" }}>
        {level}: 침수 위험이 없습니다.
      </p>
    </div>
  );
};

export default GaugeChart;
