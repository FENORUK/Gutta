import axios from "axios"
import { COOKIES, cookies } from "../utils/cookies"

const pageService = () => {
    const getHeaders = () => {
        const accessToken = cookies.get(COOKIES.accessToken)
        return accessToken
            ? {
                  Authorization: `Bearer ${accessToken}`,
              }
            : undefined
    }
    return {
        createNewPage: async (documentId, pageName) => {
            try {
                const apiResponse = await axios.post(
                    "page",
                    { name: pageName, document_id: documentId },
                    {
                        headers: getHeaders(),
                    }
                )
                return apiResponse
            } catch (error) {
                return { error }
            }
        },
        updatePage: async ({ documentId, pageId, name }) => {
            try {
                const apiResponse = await axios.put(
                    `page/${pageId}`,
                    { name: name, document_id: documentId },
                    {
                        headers: getHeaders(),
                    }
                )
                return apiResponse
            } catch (error) {
                return { error }
            }
        },
        deletePage: async (pageId) => {
            try {
                const apiResponse = await axios.delete(`page/${pageId}`, {
                    headers: getHeaders(),
                })
                return apiResponse
            } catch (error) {
                return { error }
            }
        },
        getDocumentPages: async (documentId) => {
            try {
                const apiResponse = await axios.get(
                    `page?document_id=${documentId}`,
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

const PageService = pageService()

export default PageService
