import React, { useState } from "react"
import BlockService from "../services/blockService"
import { loader } from "../components/UI/Loader"
import { handlerError } from "../helper/helper"

export const BlockContext = React.createContext()

export const BlockProvider = ({
    docId,
    blockId,
    children,
    channel,
    socketId,
    block,
    listPages,
    height,
    deleteBlock,
    color: ogColor,
    selectedContent,
    setPreviewImage,
    setShowPreviewImage,
    setShowUpImage,
    setSelectedContent,
}) => {
    const [color, setColor] = useState(ogColor || "bg-white")

    const updateColor = async (color, blockId) => {
        loader.emit("start")
        const response = await BlockService.updateBlock(docId, blockId, {
            color: color,
        })
        loader.emit("stop")
        handlerError(response)
        setColor(color)
    }

    return (
        <BlockContext.Provider
            value={{
                color,
                docId,
                height,
                block,
                blockId,
                channel,
                socketId,
                listPages,
                updateColor,
                deleteBlock,
                selectedContent,
                setPreviewImage,
                setShowPreviewImage,
                setShowUpImage,
                setSelectedContent,
            }}
        >
            {children}
        </BlockContext.Provider>
    )
}
