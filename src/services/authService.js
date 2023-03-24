import axios from "axios"
import "./index"
export const authService = {
    login: async (data) => {
        try {
            const apiResponse = await axios.post("auth/login", data)
            return apiResponse
        } catch (error) {
            return { error }
        }
    },
    register: async (data) => {
        try {
            const apiResponse = await axios.post("auth/register", data)
            return apiResponse
        } catch (error) {
            return { error }
        }
    },
}
