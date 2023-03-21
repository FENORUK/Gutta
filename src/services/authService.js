import axios from "axios"
export const authService = {
    login: async (data) => {
        const apiRessponse = await axios.post("auth/login", data)
        return apiRessponse
    },
    register: async (data) => {
        const apiResponse = await axios.post("auth/register", data)
        return apiResponse
    },
}
