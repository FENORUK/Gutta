import { useEffect, useState } from "react"
import UserService from "../services/UserService"
import { COOKIES, cookies } from "../utils/cookies"

export const useAuth = () => {
    const [user, setUser] = useState()

    const logout = () => {
        cookies.remove(COOKIES.accessToken)
        setUser(undefined)
    }

    useEffect(() => {
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
