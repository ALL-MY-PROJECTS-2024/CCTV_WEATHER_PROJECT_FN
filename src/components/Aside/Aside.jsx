import "./Aside.scss"

const Aside = () => {
  return (
    <div className="aside">
      <div className="top">
        <div className="one">
            <div className="logo">
              <img src={`${process.env.PUBLIC_URL}/logo.jpg`} alt="Logo" />
            </div>
            <div className="title_01">
               
            </div>
        </div>
        
        <div className="title_02">
        
        </div>
      </div>

      <div className="main"></div>
      <div className="bottom"></div>
    </div>
  );
};

export default Aside;
