import React, { useContext, useState } from "react"
import Button from "../../UI/Button"
import InputTag from "../../UI/InputTag"
import { authService } from "../../../services/authService"
import {
    EMAIL_VALIDATION,
    MESSAGE,
    PASSWORD_VALIDATION,
    PATH,
} from "../../../utils/constants"
import { useNavigate } from "react-router-dom"
import { COOKIES, cookies } from "../../../utils/cookies"
import { loader } from "../../UI/Loader"
import { AuthContext } from "../../../contexts/AuthContext"
import ReCAPTCHA from "react-google-recaptcha";
import axios from 'axios';


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

    //recapcha
    const [recaptchaToken, setREcaptchaValue] = useState(null);

    const handleRecaptchaChange = (token) => {
        setREcaptchaValue(token)
    };

    const { onChange } = props
    const [loginData, setLoginData] = useState(DEFAULT_ERROR_FORMAT)
    const [errors, setErrors] = useState(DEFAULT_ERROR_FORMAT)
    const navigate = useNavigate()
    const { fetchUserInfo } = useContext(AuthContext)

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

        //recaptcha
        try {
            const response = await axios.post('/api/login', {
                recaptchaToken: recaptchaToken,
            });

        } catch (error) {
            if (error.response.status === 401) {

                alert('Tên đăng nhập hoặc mật khẩu không chính xác');
            } else {

                console.error(error);
                alert('Đã có lỗi xảy ra, vui lòng thử lại sau');
            }
        }

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
            path: PATH.DEFAULT,
            expires: new Date(Date.now() + expires_in * 1000),
        })

        fetchUserInfo()
        navigate(PATH.WORKSPACE.PERSONAL)
    }

    return (
        <form
            className="w-96 px-2.5 flex flex-col items-center"
            onSubmit={handleLogin}
        >
            <p className="mt-4 mb-2 text-4xl font-bold">Welcome to Gutta</p>
            <p className="mb-4 text-sm">
                Don't have an account?{" "}
                <span
                    className="hover:cursor-pointer text-blue-600 font-bold"
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
            <div className="mb-7">

                {<ReCAPTCHA
                    sitekey="6LdIeh0mAAAAAMbDJi-aBLuu79VWWITYwYPRh-q7"
                    onChange={handleRecaptchaChange}
                />}
            </div>
            <Button type="submit">Login</Button>
        </form>
    )
}
