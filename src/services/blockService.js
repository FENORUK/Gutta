import axios from "axios"
import { COOKIES, cookies } from "../utils/cookies"

const blockService = () => {
    const getHeaders = () => {
        const accessToken = cookies.get(COOKIES.accessToken)
        return accessToken
            ? {
                  Authorization: `Bearer ${accessToken}`,
              }
            : undefined
    }

    return {
        createNewBlock: async (data) => {
            try {
                const apiResponse = await axios.post("block", data, {
                    headers: getHeaders(),
                })
                return apiResponse
            } catch (error) {
                return { error }
            }
        },

        getBlockByPageId: async (pageId) => {
            try {
                const apiResponse = await axios.get(
                    `/page/8a5f03ff-1875-4bf3-a3f4-aef1264e3bcc/block`,
                    {
                        headers: getHeaders(),
                    }
                )
                return apiResponse
            } catch (error) {
                return { error }
            }
        },

        updateBlock: async (blockId, data) => {
            try {
                const apiResponse = await axios.put(`block/${blockId}`, data, {
                    headers: getHeaders(),
                })
                return apiResponse
            } catch (error) {
                return { error }
            }
        },

        deleteBlockById: async (blockId) => {
            try {
                const apiResponse = await axios.delete(`block/${blockId}`, {
                    headers: getHeaders(),
                })
                return apiResponse
            } catch (error) {
                return { error }
            }
        },
    }
}

const BlockService = blockService()
export default BlockService
