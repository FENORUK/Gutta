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
        createNewPage: async ({ documentId, pageName }) => {
            try {
                const apiResponse = await axios.post(
                    `document/${documentId}/page`,
                    { name: pageName },
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
                    `document/${documentId}/page/${pageId}`,
                    { name: name },
                    {
                        headers: getHeaders(),
                    }
                )
                return apiResponse
            } catch (error) {
                return { error }
            }
        },
        deletePage: async ({ documentId, pageId }) => {
            try {
                const apiResponse = await axios.delete(
                    `document/${documentId}/page/${pageId}`,
                    {
                        headers: getHeaders(),
                    }
                )
                return apiResponse
            } catch (error) {
                return { error }
            }
        },
        getPageByDocumentId: async ({ documentId }) => {
            try {
                const apiResponse = await axios.get(
                    `document/${documentId}/page`,

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
