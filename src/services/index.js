import axios, { HttpStatusCode } from "axios"
import get from "lodash/get"
import { MESSAGE } from "../utils/constants"

axios.interceptors.request.use(
    function (config) {
        return config
    },
    function (error) {
        return Promise.reject(error)
    }
)

axios.interceptors.response.use(
    function (response) {
        return response.data
    },
    function (error) {
        if (error.response) {
            const { status } = error.response
            if (status === HttpStatusCode.Unauthorized) {
                window.location.replace("/")
            }
            return Promise.reject({
                message: get(
                    error,
                    "response.data.errors.message",
                    MESSAGE.DEFAULT_ERROR
                ),
            })
        }
        return Promise.reject({
            message: get(error, "message", MESSAGE.DEFAULT_ERROR),
        })
    }
)
