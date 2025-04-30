import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Authenticate = () => {
    const { auth } = useAuth();
    // console.log(auth);
    const location = useLocation();

    return auth?.accessToken ? <Outlet></Outlet>
        : <Navigate to="/login" state={{ from: location }} replace></Navigate>
}

export default Authenticate;