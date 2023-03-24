import React, { useState } from "react"
import InputTag from "../../UI/InputTag"
import Button from "../../UI/Button"
import { authService } from "../../../services/authService"
import {
    EMAIL_VALIDATION,
    MESSAGE,
    PASSWORD_VALIDATION,
} from "../../../utils/constants"
import customToast from "../../../utils/toast"
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
    {
        name: "confirmPassword",
        placeholder: "Confirm Password",
        type: "password",
    },
]
const DEFAULT_ERROR_FORMAT = { email: "", password: "", confirmPassword: "" }

export default function RegisterForm(props) {
    const { onChange } = props
    const [registerData, setRegisterData] = useState(DEFAULT_ERROR_FORMAT)
    const [errors, setErrors] = useState(DEFAULT_ERROR_FORMAT)

    const validateRegisterInput = (registerData) => {
        const { email, password, confirmPassword } = registerData
        let errorDetail = {
            ...DEFAULT_ERROR_FORMAT,
        }
        if (!EMAIL_VALIDATION.test(email)) {
            errorDetail.email = MESSAGE.INVALID_EMAIL
        }
        if (!PASSWORD_VALIDATION.test(password)) {
            errorDetail.password = MESSAGE.INVALID_PASSWORD_LENGTH
        }
        if (!(password === confirmPassword)) {
            errorDetail.confirmPassword = MESSAGE.PASSWORDS_NOT_THE_SAME
        }
        return errorDetail
    }

    const handleChange = (event) => {
        const {
            target: { name, value },
        } = event
        setRegisterData({ ...registerData, [name]: value })
    }

    const handleRegister = async (event) => {
        event.preventDefault()

        const validateMessages = validateRegisterInput(registerData)
        if (Object.values(validateMessages).some((message) => message !== "")) {
            setErrors(validateMessages)
            return
        }

        loader.emit("start")
        const response = await authService.register({
            name: "",
            email: registerData.email,
            password: registerData.password,
        })
        loader.emit("stop")

        if (response.error) {
            const {
                error: { message },
            } = response
            setErrors({
                ...DEFAULT_ERROR_FORMAT,
                email: message,
            })
            return
        }

        customToast.success(MESSAGE.REGISTER_SUCCEEDED)
        onChange("login")
    }

    return (
        <form
            className="w-96 px-2.5 flex flex-col items-center"
            onSubmit={handleRegister}
        >
            <p className="mt-4 mb-2 text-4xl font-bold">Create Account</p>
            <p className="mb-4">
                Already have an account?{" "}
                <span
                    className="hover:cursor-pointer text-[#175cff]"
                    onClick={() => onChange("login")}
                >
                    Sign In
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
            <Button type="submit">Create Account</Button>
        </form>
    )
}
