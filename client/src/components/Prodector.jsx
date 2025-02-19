import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import Spinner from "./Spinner";

const Prodector = ({ children }) => {
  const { token } = useSelector((state) => state.user);
  
  if (token) {
    return children;
  }

  return <Navigate to="/login" replace />;
};

Prodector.propTypes = {
  children: PropTypes.node.isRequired,
};
export default Prodector;
