import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import Spinner from "./Spinner";

const AdminProdector = ({ children }) => {
  const { currentUser, loading } = useSelector((state) => state.user);

  if (currentUser !== null && !currentUser?.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  if (loading) return <Spinner />;

  return children;
};
AdminProdector.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminProdector;
