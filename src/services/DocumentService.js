import axios from "axios"
import { COOKIES, cookies } from "../utils/cookies"

const documentService = () => {
    const getHeaders = () => {
        const accessToken = cookies.get(COOKIES.accessToken)
        return accessToken
            ? {
                  Authorization: `Bearer ${accessToken}`,
              }
            : undefined
    }

    return {
        createNewDocument: async (data) => {
            const headers = getHeaders()
            if (!headers) return
            try {
                const apiResponse = await axios.post("document", data, {
                    headers,
                })
                return apiResponse
            } catch (error) {
                throw error
            }
        },
        getDocumentByID: async (documentId) => {
            const headers = getHeaders()
            if (!headers) return
            try {
                const apiResponse = await axios.get(`document/${documentId}`, {
                    headers,
                })
                return apiResponse
            } catch (error) {
                throw error
            }
        },
        updateDocument: async (documentId, data) => {
            const headers = getHeaders()
            if (!headers) return
            try {
                const apiResponse = await axios.put(
                    `document/${documentId}`,
                    data,
                    {
                        headers,
                    }
                )
                return apiResponse
            } catch (error) {
                throw error
            }
        },
    }
}

const DocumentService = documentService()

export default DocumentService
