import React, { useState } from "react"
import { loader } from "../../Loader"
import { ListBulletIcon, PhotoIcon } from "@heroicons/react/24/outline"
import ContentService from "../../../../services/contentService"
import { IMAGE_EXPAND, TEXT_EXPAND } from "../../../../utils/constants"
import { useContext } from "react"
import { BlockContext } from "../../../../contexts/BlockContext"
import { getCurrentMaxHeightBlock } from "../helper"
import { handlerError } from "../../../../helper/helper"

export const TextContent = ({
    name,
    contentId,
    imagesCount,
    contentsCount,
    onExpandBlock,
    handleAddContent,
    setSelectedOption,
    handleUpdateContent,
}) => {
    const [inputContext, setInputContext] = useState(name || "")
    const {
        docId,
        color,
        setSelectedContent,
        height,
        blockId,
    } = useContext(BlockContext)

    const currentMaxHeightBlock = getCurrentMaxHeightBlock({
        contentsCount,
        imagesCount,
    })

    const createTextContent = async (event) => {
        if (event.key !== "Enter") return
        event.preventDefault()
        const inputValue = event.target.value.trim()
        if (!inputValue) return

        loader.emit("start")
        const response = await ContentService.createNewContent(docId, {
            name: inputValue,
            position: contentsCount + 1,
            type: "text",
            block_id: blockId,
        })

        loader.emit("stop")
        handlerError(response)
        const { id, name, position, type, store_url } = response.results
        handleAddContent({
            id,
            name,
            position,
            type,
            store_url,
            block_id: blockId,
        })
        setInputContext("")

        if (height < TEXT_EXPAND + currentMaxHeightBlock) {
            onExpandBlock(TEXT_EXPAND)
        }
    }

    const updateTextContent = async (event) => {
        if (event.key !== "Enter") return
        event.preventDefault()
        const inputValue = event.target.value.trim()
        if (!inputValue) return

        loader.emit("start")
        const response = await ContentService.updateContent(docId, contentId, {
            name: inputValue,
        })
        loader.emit("stop")
        handlerError(response)
        const { id, name } = response.results
        handleUpdateContent({ id, newName: name })
    }

    const addImageContent = async () => {
        loader.emit("start")
        const response = await ContentService.createNewContent(docId, {
            name: null,
            type: "image",
            position: contentsCount + 1,
            block_id: blockId,
        })
        loader.emit("stop")
        handlerError(response)
        const { id, name, position, type, store_url, checked } =
            response.results

        handleAddContent({
            id,
            name,
            position,
            type,
            store_url,
            checked,
            block_id: blockId,
        })

        setSelectedOption("text")
        setSelectedContent({
            documentId: docId,
            blockId: blockId,
            contentId: id,
        })
        if (height < IMAGE_EXPAND + currentMaxHeightBlock) {
            onExpandBlock(IMAGE_EXPAND + currentMaxHeightBlock - height)
        }
    }

    const checkInput = (event) => {
        const value = event.target.value
        setInputContext(value)
    }

    return (
        <div
            className={`w-full px-1 pr-4 h-6 ${color} flex items-center relative`}
        >
            <input
                type="text"
                onKeyDown={name ? updateTextContent : createTextContent}
                onChange={checkInput}
                value={inputContext}
                placeholder="Write here"
                className={`${color} text-xs w-full p-0 border-none focus:ring-0 rounded-lg focus:outline-0 h-full overflow-hidden`}
            />
            {inputContext === "" ? (
                <div className="absolute text-slate-500 cursor-pointer right-0 flex items-center">
                    <ListBulletIcon
                        className="w-5 h-5 hover:text-black"
                        onClick={() => setSelectedOption("task")}
                    />
                    <PhotoIcon
                        className="w-5 h-5 hover:text-black"
                        onClick={() => addImageContent()}
                    />
                </div>
            ) : null}
        </div>
    )
}
