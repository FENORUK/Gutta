import React, { useState } from "react"
import InputTag from "../../UI/InputTag"
import Button from "../../UI/Button"
import { authService } from "../../../services/authService"
import { EMAIL_VALIDATION, PASSWORD_VALIDATION } from "../../../utils/constants"
import { useNavigate } from "react-router-dom"

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
    const { onchange } = props
    const [registerData, setRegisterData] = useState(DEFAULT_ERROR_FORMAT)
    const [errors, setErrors] = useState(DEFAULT_ERROR_FORMAT)
    const navigate = useNavigate()

    const validateRegisterInput = (registerData) => {
        const { email, password, confirmPassword } = registerData
        let errorDetail = {
            ...DEFAULT_ERROR_FORMAT,
        }
        if (!EMAIL_VALIDATION.test(email)) {
            errorDetail.email = "Invalid email"
        }
        if (!PASSWORD_VALIDATION.test(password)) {
            errorDetail.password = "The password must be at least 6 characters"
        }
        if (!(password === confirmPassword)) {
            errorDetail.confirmPassword =
                "Password and Confirm password must be the same"
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

        try {
            await authService.register({
                name: "",
                email: registerData.email,
                password: registerData.password,
            })
            alert("Registered successfully, please login again!")
            navigate("/login")
        } catch (error) {
            setErrors({
                ...DEFAULT_ERROR_FORMAT,
                email: error.response.data.errors.message,
            })
        }
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
                    onClick={() => onchange("login")}
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
