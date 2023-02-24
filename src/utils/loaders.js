import { COOKIES, cookies } from "./cookies"

export const authLoader = async () => {
    const accessToken = cookies.get(COOKIES.accessToken)
    if (!accessToken) return { isLoggedIn: false }
    return { isLoggedIn: true }
}
