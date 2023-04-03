import { createContext } from "react"
import { useAuth } from "../hooks/useAuth"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const { user, fetchUserInfo, logout } = useAuth()

    return (
        <AuthContext.Provider value={{ user, fetchUserInfo, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
