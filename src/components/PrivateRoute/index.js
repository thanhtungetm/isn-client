import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

function PrivateRoute() {
    const user = useSelector((state) => state.auth.user)
    return user ? (
        user.isCompleteInfo ? (
            <Outlet />
        ) : (
            <Navigate to={'/account'} />
        )
    ) : (
        <Navigate to={'/login'} />
    )
}

export default PrivateRoute
