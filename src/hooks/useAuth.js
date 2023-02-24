import { useEffect, useState } from "react"
import UserService from "../services/UserService"
import { COOKIES, cookies } from "../utils/cookies"

export const useAuth = () => {
    const [user, setUser] = useState()

    const logout = () => {
        console.log("logout")
        cookies.remove(COOKIES.accessToken)
        setUser(undefined)
    }

    useEffect(() => {
        if (user) return
        console.log("useAuth")
        const fetchUserInfo = async () => {
            const result = await UserService.getUserInfo()
            if (!result) {
                logout()
                return
            }
            setUser(result.data.results)
        }
        fetchUserInfo()
    }, [])

    return {
        user,
        logout,
    }
}
