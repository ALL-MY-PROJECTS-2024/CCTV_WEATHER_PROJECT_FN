import "../../styles/layout/Header.scss";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import "bootstrap/dist/css/bootstrap.css";


import { Link } from "react-router-dom";

//전역 상태 받기
import {useEffect, useState , useContext} from "react";
import {GlobalContext} from "../../contexts/GlobalContextProvider"; //contextAPI

const Header = () => {
  const {value,setValue} = useContext(GlobalContext);// 로그인 상태정보
  
  return (
    <header className="">
      <div className="top-header layout">
        <ul>

        </ul>
      </div>
      <nav>
        
      </nav>
    </header>
  );
};

export default Header;
