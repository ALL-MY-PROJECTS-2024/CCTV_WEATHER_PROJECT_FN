import Layout from "../../../layout/Layout";
import "../../../../styles/myinfo/lecture/Post.scss";
import { useEffect, useState, useRef } from "react";


const Post = () => {

  const [curSlide, setCurSlide] = useState({})
  const [slideIndex,setSlideIndex] = useState(-1)
  const [slides,setSlides] = useState([])

  //슬라이드 추가
  const addSlideHandler=()=>{
    const rightEl = document.querySelector('.right');
    const newDiv = document.createElement("div");
    newDiv.classList.add("slide");

    //컨트롤바
    const controlEl = document.createElement('div')
    controlEl.classList.add('controlbar')

    //그리기
    const canvas = document.createElement('canvas');
    canvas.setAttribute('style','width:100%;height:100%;')

    newDiv.appendChild(controlEl);
    newDiv.appendChild(canvas);
    rightEl.appendChild(newDiv);

    //
    // setCurSlide(newDiv);
    // slideIndex++;
    // slides.post(newDiv);


  }

  return (
      <Layout>
          <section className="myinfo-lecture-list">
              <div className="left">
                  <div className="one tag">
                          <ul>
                              <li classList=""><a href="" >강의 목록</a></li>
                              <li><a href="/myinfo/lecture/post">강의 추가</a></li>
                              <li><a href="">강의 수정</a></li>
                              <li><a href="">강의 삭제</a></li>
                          </ul>
                  </div>
                  <hr />
                  <div className="two tag">
                          <ul className="main-menu">
                              <li>
                                <a href="javascript:void(0)" >슬라이드</a>
                                  <ul className="sub-menu">
                                    <li><a href="javascript:void(0)" onClick={addSlideHandler}>슬라이드 추가</a></li>
                                    <li><a href="javascript:void(0)">슬라이드 삭제</a></li>
                                  </ul>
                                </li>
                              <li>
                                  <a href="javascript:void(0)">요소 추가</a>
                                  <ul className="sub-menu">
                                    <li><a href="javascript:void(0)">텍스트 추가</a></li>
                                    <li><a href="javascript:void(0)">도형 추가</a></li>
                                  </ul>
                              </li>
                          </ul>
                  </div>
              </div>
              <div className="right">

              </div>
          </section>
      </Layout>
  )

}

export default Post;
