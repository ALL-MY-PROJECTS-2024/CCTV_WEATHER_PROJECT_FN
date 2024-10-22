import logo from "./logo.svg";
import "./App.css";

import "bootstrap/dist/css/bootstrap.css";


import Home from "./components/page/Home";
import Test from "./components/page/Test";


// STYLING
import "./styles/App.scss";

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
          <Route path="/Test" element={<Test />} />
        </Routes>
      </Router>
    </GlobalContextProvider>
  );
}

export default App;
