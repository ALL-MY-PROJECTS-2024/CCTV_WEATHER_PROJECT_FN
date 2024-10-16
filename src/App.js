import logo from "./logo.svg";
import "./App.css";

import "bootstrap/dist/css/bootstrap.css";

import Home from "./components/page/Home";

// STYLING
import "./styles/App.scss";

//ROUTE
import {HashRouter  as Router, Routes, Route } from "react-router-dom";

import Join from "./components/page/auth/Join";
import Login from "./components/page/auth/Login";
import Logout from "./components/page/auth/Logout";
import MyinfoRead from "./components/page/myinfo/common/Read";
import MyinfoLectureList from "./components/page/myinfo/lecture/List";
import MyinfoLecturePost from "./components/page/myinfo/lecture/Post";

// 전역 설정
import { GlobalContextProvider } from "./contexts/GlobalContextProvider";

function App() {
  return (
    <GlobalContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/myinfo/read" element={<MyinfoRead />} />
          <Route path="/myinfo/lecture/list" element={<MyinfoLectureList />} />
          <Route path="/myinfo/lecture/post" element={<MyinfoLecturePost />} />
        </Routes>
      </Router>
    </GlobalContextProvider>
  );
}

export default App;
