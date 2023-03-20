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
                const apiRessponse = await axios.get("auth/user-profile", {
                    headers,
                })
                return apiRessponse
            } catch (error) {
                return error
            }
        },
    }
}

const UserService = userService()

export default UserService
