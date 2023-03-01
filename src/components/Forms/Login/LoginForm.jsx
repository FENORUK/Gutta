import React, { useState } from "react"
import Button from "../../UI/Button"
import InputTag from "../../UI/InputTag"
import { authService } from "../../../services/authService"
import { EMAIL_VALIDATION, PASSWORD_VALIDATION } from "../../../utils/constants"
import { useNavigate } from "react-router"
import { COOKIES, cookies } from "../../../utils/cookies"

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
    const { onchange } = props
    const [loginData, setLoginData] = useState(DEFAULT_ERROR_FORMAT)
    const [errors, setErrors] = useState(DEFAULT_ERROR_FORMAT)
    const navigate = useNavigate()

    const validateLoginInput = (loginData) => {
        const { email, password } = loginData
        let errorDetail = {
            ...DEFAULT_ERROR_FORMAT,
        }
        if (!EMAIL_VALIDATION.test(email)) {
            errorDetail.email = "Invalid email"
        }
        if (!PASSWORD_VALIDATION.test(password)) {
            errorDetail.password = "The password must be at least 6 characters"
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

        try {
            const response = await authService.login({
                email: loginData.email,
                password: loginData.password,
            })
            cookies.set(
                COOKIES.accessToken,
                response.data.results.access_token,
                {
                    path: "/",
                    expires: new Date(
                        Date.now() + response.data.results.expires_in * 1000
                    ),
                }
            )
            navigate("/")
        } catch (error) {
            setErrors({
                ...DEFAULT_ERROR_FORMAT,
                email: "No active account found with the given credentials",
            })
        }
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
                    onClick={() => onchange("register")}
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
