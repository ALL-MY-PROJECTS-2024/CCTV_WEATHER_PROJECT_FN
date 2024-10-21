import React, { useState, useRef, useEffect } from 'react';



import Layout from "../layout/Layout";
import "../../styles/Test.scss";




const Test = () => {
  const iframeRef = useRef(null);

  useEffect(() => {
    console.log(iframeRef)
  }, []);


  return (
    <Layout>
      <iframe id="iframe_01"
        ref={iframeRef}
        src="https://safecity.busan.go.kr/#/"  // iframe의 URL
        style={{ width: '100vw', height: '100vh' }}
        
        title="Iframe Example"
      ></iframe>
    </Layout>
  );
};

export default Test;


