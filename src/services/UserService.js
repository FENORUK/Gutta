import axios from "axios"
import { COOKIES, cookies } from "../utils/cookies"

const userService = () => {
    const getHeaders = () => {
        const accessToken = cookies.get(COOKIES.accessToken)
        return accessToken
            ? {
                  Authorization: `Bearer ${accessToken}`,
              }
            : undefined
    }

    return {
        getUserInfo: async () => {
            const headers = getHeaders()
            if (!headers) return
            try {
                const apiResponse = await axios.get("auth/user-profile", {
                    headers,
                })
                return apiResponse
            } catch (error) {
                return error
            }
        },
    }
}

const UserService = userService()

export default UserService
