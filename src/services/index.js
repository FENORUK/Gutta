import axios, { HttpStatusCode } from "axios"
import _ from "lodash"
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
            if (status === HttpStatusCode.Forbidden) {
                window.location.replace("/login")
            }
            return Promise.reject({
                message: _.get(
                    error,
                    "response.data.errors.message",
                    MESSAGE.DEFAULT_ERROR
                ),
            })
        }
        return Promise.reject({
            message: _.get(error, "message", MESSAGE.DEFAULT_ERROR),
        })
    }
)
