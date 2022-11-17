import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function PublicRoute() {
    const user = useSelector((state) => state.auth.user)
    return !user ? <Outlet/> : <Navigate to={'/'} />
}

export default PublicRoute;