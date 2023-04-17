import axios from "axios"
import { COOKIES, cookies } from "../utils/cookies"

const notifyService = () => {
    const getHeaders = () => {
        const accessToken = cookies.get(COOKIES.accessToken)
        return accessToken
            ? {
                  Authorization: `Bearer ${accessToken}`,
              }
            : undefined
    }
    return {
        getNotification: async () => {
            try {
                const apiResponse = await axios.get(`notification`, {
                    headers: getHeaders(),
                })
                return apiResponse
            } catch (error) {
                return { error }
            }
        },
        checkNotification: async () => {
            try {
                const apiResponse = await axios.get(`notification/check`, {
                    headers: getHeaders(),
                })
                return apiResponse
            } catch (error) {
                return { error }
            }
        },
    }
}

const NotifyService = notifyService()

export default NotifyService
