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
        createNewBlock: async (documentId, data) => {
            try {
                const apiResponse = await axios.post(
                    `document/${documentId}/block`,
                    data,
                    {
                        headers: getHeaders(),
                    }
                )
                return apiResponse
            } catch (error) {
                return { error }
            }
        },

        getBlockByPageId: async (documentId, pageId) => {
            try {
                const apiResponse = await axios.get(
                    `document/${documentId}/page/${pageId}?all_data=true`,
                    {
                        headers: getHeaders(),
                    }
                )
                return apiResponse
            } catch (error) {
                return { error }
            }
        },

        updateBlock: async (documentId, blockId, data) => {
            try {
                const apiResponse = await axios.put(
                    `document/${documentId}/block/${blockId}`,
                    data,
                    {
                        headers: getHeaders(),
                    }
                )
                return apiResponse
            } catch (error) {
                return { error }
            }
        },

        editListBLock: async(documentId, data) => {
            try {
                const apiResponse = await axios.put(
                    `document/${documentId}/block`,
                    data,
                    {
                        headers: getHeaders(),
                    }
                )
                return apiResponse
            } catch (error) {
                return { error }
            }
        },

        deleteBlockById: async (documentId, blockId) => {
            try {
                const apiResponse = await axios.delete(
                    `document/${documentId}/block/${blockId}`,
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

const BlockService = blockService()
export default BlockService
