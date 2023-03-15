import React from "react"
import BlockService from "../services/blockService"
import customToast from "../utils/toast"
import { loader } from "../components/UI/Loader"

export const BlockContext = React.createContext()

export const BlockProvider = ({ children }) => {
    const handleInput = async (event, id) => {
        if (event.key === "Enter") {
            loader.emit("start")
            event.preventDefault()
            const inputValue = event.target.value
            const response = await BlockService.updateBlock(id, {
                title: inputValue,
            })
            loader.emit("stop")
            if (response.error) {
                const {
                    error: { message },
                } = response
                customToast.error(message)
                return
            }
        }
    }

    const updateColor = async (color, id) => {
        loader.emit("start")
        const response = await BlockService.updateBlock(id, {
            color: color,
        })
        loader.emit("stop")
        if (response.error) {
            const {
                error: { message },
            } = response
            customToast.error(message)
            return
        }
    }

    return (
        <BlockContext.Provider
            value={{
                updateColor,
                handleInput,
            }}
        >
            {children}
        </BlockContext.Provider>
    )
}
