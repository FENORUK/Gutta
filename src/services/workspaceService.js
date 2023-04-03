import axios from "axios"
import { COOKIES, cookies } from "../utils/cookies"

const workspaceService = () => {
    const getHeaders = () => {
        const accessToken = cookies.get(COOKIES.accessToken)
        return accessToken
            ? {
                  Authorization: `Bearer ${accessToken}`,
              }
            : undefined
    }
    return {
        getAllWorkspace: async () => {
            try {
                const apiResponse = await axios.get("workspace", {
                    headers: getHeaders(),
                })
                return apiResponse
            } catch (error) {
                return { error }
            }
        },
        createNewWorkspace: async (data) => {
            try {
                const apiResponse = await axios.post("workspace", data, {
                    headers: getHeaders(),
                })
                return apiResponse
            } catch (error) {
                return { error }
            }
        },
        updateWorkspace: async ({ workspaceId, data }) => {
            try {
                const apiResponse = await axios.put(
                    `workspace/${workspaceId}`,
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
        deleteWorkspace: async (workspaceId) => {
            try {
                const apiResponse = await axios.delete(
                    `workspace/${workspaceId}`,
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

const WorkspaceService = workspaceService()

export default WorkspaceService
