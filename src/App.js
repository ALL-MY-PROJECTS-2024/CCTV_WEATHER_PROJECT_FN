import logo from "./logo.svg";

import "bootstrap/dist/css/bootstrap.css";


import Home from "./components/Home";
import Test from "./components/Test";
import Test2 from "./components/Test2";
import TEST3 from "./components/TEST3"
import "./App.scss"


//ROUTE
// import {BrowserRouter   as Router, Routes, Route } from "react-router-dom";

import {HashRouter   as Router, Routes, Route } from "react-router-dom";

// 전역 설정
import { GlobalContextProvider } from "./contexts/GlobalContextProvider";

function App() {
  return (
    <GlobalContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Test1" element={<Test />} />
          <Route path="/Test2" element={<Test2 />} />
          <Route path="/TEST3" element={<TEST3 />} />
        </Routes>
      </Router>
    </GlobalContextProvider>
  );
}

export default App;
