import { Navigate } from "react-router-dom";
import { useUser } from '../components/UserContext'
import NotFound from "../components/NotFound";

const ProtectedSiswa = ({ children }) => {
  const { user } = useUser();
  const token = localStorage.getItem("token");
  if(token){
    if(user?.role === "siswa"){
        return children;
    }else{
        return <NotFound />;
    }
  }else{
    return <Navigate to="/" />;
  }
};

export default ProtectedSiswa;
