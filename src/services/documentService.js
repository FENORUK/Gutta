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
            try {
                const apiResponse = await axios.post("document", data, {
                    headers: getHeaders(),
                })
                return apiResponse
            } catch (error) {
                return { error }
            }
        },
        getDocuments: async (path) => {
            try {
                const apiResponse = await axios.get(`document${path}`, {
                    headers: getHeaders(),
                })
                return apiResponse
            } catch (error) {
                return { error }
            }
        },
        getDocumentByID: async (documentId) => {
            try {
                const apiResponse = await axios.get(
                    `document/${documentId}/all`,
                    {
                        headers: getHeaders(),
                    }
                )
                return apiResponse
            } catch (error) {
                return { error }
            }
        },
        queryDocument: async (data) => {
            try {
                const apiResponse = await axios.get(`document?${data}`, data, {
                    headers: getHeaders(),
                })
                return apiResponse
            } catch (error) {
                return { error }
            }
        },
        updateDocument: async (documentId, data) => {
            try {
                const apiResponse = await axios.put(
                    `document/${documentId}`,
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
        deleteDocument: async (documentId) => {
            try {
                const apiResponse = await axios.delete(
                    `document/${documentId}`,
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

const DocumentService = documentService()

export default DocumentService
