import axios from "axios"
import { COOKIES, cookies } from "../utils/cookies"

const contentService = () => {
    const getHeaders = () => {
        const accessToken = cookies.get(COOKIES.accessToken)
        return accessToken
            ? {
                  Authorization: `Bearer ${accessToken}`,
              }
            : undefined
    }

    return {
        createNewContent: async (documentId, data) => {
            try {
                const apiResponse = await axios.post(
                    `document/${documentId}/content`,
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

        getContentByBlock: async (documentId, blockId) => {
            try {
                const apiResponse = await axios.get(
                    `document/${documentId}/block/${blockId}/content`,
                    {
                        headers: getHeaders(),
                    }
                )
                return apiResponse
            } catch (error) {
                return { error }
            }
        },

        getContentByID: async (documentId, contentId) => {
            try {
                const apiResponse = await axios.get(
                    `document/${documentId}/content/${contentId}`,
                    {
                        headers: getHeaders(),
                    }
                )
                return apiResponse
            } catch (error) {
                return { error }
            }
        },

        updateContent: async (documentId, contentId, data) => {
            try {
                const apiResponse = await axios.put(
                    `document/${documentId}/content/${contentId}`,
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

        uploadToContent: async (documentId, blockId, imageFile) => {
            try {
                const formData = new FormData()
                formData.append("image", imageFile)
                formData.append("block_id", blockId)
                const apiResponse = await axios.post(
                    `document/${documentId}/content/upload`,
                    formData,
                    {
                        headers: {
                            ...getHeaders(),
                            "Content-Type":
                                "multipart/form-data",
                        },
                    }
                )
                return apiResponse
            } catch (error) {
                return { error }
            }
        },

        updateImageContent: async (documentId, contentId, file) => {
            try {
                const formData = new FormData()
                formData.append("image", file)
                const apiResponse = await axios.post(
                    `document/${documentId}/content/${contentId}/upload`,
                    formData,
                    {
                        headers: {
                            ...getHeaders(),
                            "Content-Type": "multipart/form-data",
                        },
                    }
                )
                return apiResponse
            } catch (error) {
                return { error }
            }
        },

        deleteContentById: async (documentId, contentId) => {
            try {
                const apiResponse = await axios.delete(
                    `document/${documentId}/content/${contentId}`,
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

const ContentService = contentService()
export default ContentService
