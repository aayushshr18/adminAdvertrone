import "./styles.css";

const Loader = () => {
  return (
    <div className="dasboard-container">
      <div className="dasboard-one">
        <div className="dasboard-small1">
            <h4>TOTAL NUMBER OF USER</h4>
            <span>445214</span>

        </div>
        <div className="dasboard-small2">
            <h4>WITHDRAUAL REQUEST</h4>
            <span>1235</span>

        </div>
      </div>

      <div className="dasboard-two" style={{marginTop:"30px"}}>
        <div className="dasboard-small1">
            <h3>NEW REGISTRATION REQUEST </h3>
            <span>895642</span>

            </div>
          <div className="dasboard-small2">
            <h3> TOTAL NUMBER OF LEADS FOR UPDATE </h3>
            <span>7852</span>

            </div>

      </div>
    </div>
  );
};

export default Loader;
