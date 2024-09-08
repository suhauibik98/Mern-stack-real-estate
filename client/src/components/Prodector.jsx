/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'


const Prodector = ({children}) => {
const {currentUser} = useSelector((state) => state.user)

if(currentUser !== null) {
    return children
}
  return <Navigate to="/login" replace />
}
export default Prodector
