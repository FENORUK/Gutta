import axios from "axios"
export const authService = {
    login: async (data) => {
        const apiResponse = await axios.post("auth/login", data)
        return apiResponse
    },
    register: async (data) => {
        const apiResponse = await axios.post("auth/register", data)
        return apiResponse
    },
}
