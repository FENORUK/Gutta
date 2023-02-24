import React, { useState } from "react"
import LoginForm from "../components/Forms/Login/LoginForm"
import RegisterForm from "../components/Forms/SignUp/RegisterForm"

const ROUTE = {
    login: {
        title: "Login",
        form: LoginForm,
    },
    register: {
        title: "Sign Up",
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
        <div className="h-screen bg-[url('assets/theme.jpg')] bg-cover bg-right-bottom">
            <div className="h-full w-1/2 bg-white shadow-[0_4px_44px_0px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center">
                <div className="h-12 w-12 bg-[url('assets/logo512.png')] bg-cover hover:cursor-pointer"></div>
                <page.form onchange={handleStateChange} />
            </div>
        </div>
    )
}
