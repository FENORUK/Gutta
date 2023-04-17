import axios from "axios"
import { COOKIES, cookies } from "../utils/cookies"

const realtimeService = () => {
    const getHeaders = () => {
        const accessToken = cookies.get(COOKIES.accessToken)
        return accessToken
            ? {
                  Authorization: `Bearer ${accessToken}`,
              }
            : undefined
    }

    return {
        sendData: async (eventName, channelId, data) => {
            try {
                const apiResponse = await axios.post(
                    `send`,
                    {
                        event: eventName,
                        id: channelId,
                        data: data,
                    },
                    {
                        headers: getHeaders(),
                    }
                )
                return apiResponse
            } catch (error) {
                return { error }
            }
        },
    }
}

const RealtimeService = realtimeService()
export default RealtimeService
