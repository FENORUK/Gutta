import React, { useState } from "react"
import BlockService from "../services/blockService"
import { loader } from "../components/UI/Loader"
import { handlerError } from "../helper/helper"
import { extractBlockId } from "../helper/helper"
import RealtimeService from "../services/realtimeService"

export const BlockContext = React.createContext()

export const BlockProvider = ({
    docId,
    blockId,
    children,
    channel,
    title,
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

    const updateColor = async (color, blockId, title, showTitle) => {
        loader.emit("start")
        const response = await BlockService.updateBlock(
            docId,
            extractBlockId(blockId),
            {
                color: color,
            }
        )
        loader.emit("stop")
        handlerError(response)
        setColor(color)
        await RealtimeService.sendData("updateColorBlock", docId, {
            socketId: socketId,
            blockId: extractBlockId(blockId),
            color: color,
            title: title,
            isTitleHidden: showTitle,
        })
    }

    return (
        <BlockContext.Provider
            value={{
                color,
                docId,
                height,
                block,
                title,
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
