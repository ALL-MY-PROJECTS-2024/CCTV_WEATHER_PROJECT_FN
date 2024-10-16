//전역 상태 받기
import { useEffect, useState, useContext } from "react";
import { GlobalContext } from "../../../contexts/GlobalContextProvider"; //contextAPI
//페이지이동
import { useNavigate } from "react-router-dom";
//COOKIE
import Cookies from 'js-cookie';

const Logout = () => {
  const {value,setValue} = useContext(GlobalContext); // 로그인 상태정보
  const navigate = useNavigate();


  useEffect(()=>{
    localStorage.removeItem("JWTAUTHENTICATION")
    navigate("/login")
  },[])
  
  
  
  
  //window.location.reload();


  return null; //랜더링 안함
};
export default Logout;
