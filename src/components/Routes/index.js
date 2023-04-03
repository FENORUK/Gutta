import { Navigate, useLoaderData } from "react-router-dom"
import { PATH } from "../../utils/constants"

export const AuthGuard = ({ children }) => {
    const { isLoggedIn } = useLoaderData()

    return isLoggedIn ? children : <Navigate to={PATH.DEFAULT} />
}

export const PublicGuard = ({ children }) => {
    const { isLoggedIn } = useLoaderData()

    return isLoggedIn ? <Navigate to={PATH.WORKSPACE.PERSONAL} /> : children
}
