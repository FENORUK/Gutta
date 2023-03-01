import axios from "axios"
export const authService = {
    login: async (data) => {
        const apiRessponse = await axios.post("auth/login", data)
        return apiRessponse
    },
    register: async (data) => {
        const apiRessponse = await axios.post("auth/register", data)
        return apiRessponse
    },
}
