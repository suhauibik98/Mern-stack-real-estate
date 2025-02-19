import "../styles/spinner.css";
const Spinner = () => {
  return (
    // <div className="parentSpin">
    //   <div className="custom-loader"></div>
    // </div>
    <div className="loader">
      <div className="ball"></div>
      <div className="ball"></div>
      <div className="ball"></div>
    </div>
  );
};

export default Spinner;
