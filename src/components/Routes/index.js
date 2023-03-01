import { Navigate, useLoaderData } from "react-router-dom"

export const AuthGuard = ({ children }) => {
    const { isLoggedIn } = useLoaderData()

    return isLoggedIn ? children : <Navigate to="/login" />
}

export const PublicGuard = ({ children }) => {
    const { isLoggedIn } = useLoaderData()

    return isLoggedIn ? <Navigate to="/" /> : children
}
