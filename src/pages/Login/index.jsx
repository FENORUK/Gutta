import React, { useState } from "react"
import LoginForm from "../../components/Forms/Login/LoginForm"
import RegisterForm from "../../components/Forms/SignUp/RegisterForm"
import { PAGE_TITLES } from "../../utils/constants"

const ROUTE = {
    login: {
        title: PAGE_TITLES.LOGIN,
        form: LoginForm,
    },
    register: {
        title: PAGE_TITLES.REGISTER,
        form: RegisterForm,
    },
}

export default function LoginPage() {
    const [page, setPage] = useState(ROUTE.login)

    document.title = page.title

    const handleStateChange = (newform) => {
        setPage(ROUTE[newform])
    }

    return (
        <div className="flex h-screen">
            <div className="h-full w-1/2 bg-white shadow-[0_4px_44px_0px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center">
                <div className="h-12 w-12 bg-[url('assets/logo512.png')] bg-cover hover:cursor-pointer"></div>
                <page.form onChange={handleStateChange} />
            </div>
            <div className="h-full w-1/2 flex justify-start items-center bg-gradient-to-tl from-red-300 to-blue-300">
                <div className="w-[733px] h-[681px] bg-[url('assets/theme.png')] bg-no-repeat bg-right"></div>
            </div>
        </div>
    )
}
