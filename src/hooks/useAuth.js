import { useState, useEffect } from "react"
import UserService from "../services/userService"
import { COOKIES, cookies } from "../utils/cookies"
import { PATH } from "../utils/constants"

export const useAuth = () => {
    const [user, setUser] = useState()

    const logout = () => {
        cookies.remove(COOKIES.accessToken, { path: PATH.DEFAULT })
        setUser(undefined)
    }

    useEffect(() => {
        fetchUserInfo()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchUserInfo = async () => {
        const result = await UserService.getUserInfo()
        if (!result) {
            logout()
            return
        }
        setUser(result.results)
    }

    return {
        user,
        fetchUserInfo,
        logout,
    }
}
