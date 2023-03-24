import React, { useState } from "react"
import Button from "../../UI/Button"
import InputTag from "../../UI/InputTag"
import { authService } from "../../../services/authService"
import {
    DEFAULT_PATH,
    EMAIL_VALIDATION,
    MESSAGE,
    PASSWORD_VALIDATION,
} from "../../../utils/constants"
import { useNavigate } from "react-router-dom"
import { COOKIES, cookies } from "../../../utils/cookies"
import { loader } from "../../UI/Loader"

const INPUTS = [
    {
        name: "email",
        placeholder: "Email",
        type: "email",
    },
    {
        name: "password",
        placeholder: "Password",
        type: "password",
    },
]
const DEFAULT_ERROR_FORMAT = { email: "", password: "" }

export default function LoginForm(props) {
    const { onChange } = props
    const [loginData, setLoginData] = useState(DEFAULT_ERROR_FORMAT)
    const [errors, setErrors] = useState(DEFAULT_ERROR_FORMAT)
    const navigate = useNavigate()

    const validateLoginInput = (loginData) => {
        const { email, password } = loginData
        let errorDetail = {
            ...DEFAULT_ERROR_FORMAT,
        }
        if (!EMAIL_VALIDATION.test(email)) {
            errorDetail.email = MESSAGE.INVALID_EMAIL
        }
        if (!PASSWORD_VALIDATION.test(password)) {
            errorDetail.password = MESSAGE.INVALID_PASSWORD_LENGTH
        }
        return errorDetail
    }

    const handleChange = (event) => {
        const {
            target: { name, value },
        } = event
        setLoginData({ ...loginData, [name]: value })
    }

    const handleLogin = async (event) => {
        event.preventDefault()
        event.stopPropagation()
        const validateMessages = validateLoginInput(loginData)
        if (Object.values(validateMessages).some((message) => message !== "")) {
            setErrors(validateMessages)
            return
        }
        loader.emit("start")
        const response = await authService.login({
            email: loginData.email,
            password: loginData.password,
        })
        loader.emit("stop")

        if (response.error) {
            setErrors({
                ...DEFAULT_ERROR_FORMAT,
                email: MESSAGE.ACCOUNT_NOT_FOUND,
            })
            return
        }

        const {
            results: { access_token, expires_in },
        } = response
        cookies.set(COOKIES.accessToken, access_token, {
            path: DEFAULT_PATH,
            expires: new Date(Date.now() + expires_in * 1000),
        })
        navigate(DEFAULT_PATH)
    }

    return (
        <form
            className="w-96 px-2.5 flex flex-col items-center"
            onSubmit={handleLogin}
        >
            <p className="mt-4 mb-2 text-4xl font-bold">Welcome to xtiles</p>
            <p className="mb-4">
                Don't have an account?{" "}
                <span
                    className="hover:cursor-pointer text-[#175cff]"
                    onClick={() => onChange("register")}
                >
                    Sign up for free
                </span>
            </p>
            {INPUTS.map(({ name, type, placeholder }) => (
                <InputTag
                    key={name}
                    onChange={handleChange}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    errorMessage={errors[name]}
                />
            ))}
            <Button type="submit">Login</Button>
        </form>
    )
}
