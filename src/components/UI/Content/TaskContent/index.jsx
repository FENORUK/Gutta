import React, { useState } from "react"
import clsx from "clsx"
import { loader } from "../../Loader"
import ContentService from "../../../../services/contentService"
import { DocumentIcon, PhotoIcon } from "@heroicons/react/24/outline"
import { IMAGE_EXPAND, TASK_EXPAND } from "../../../../utils/constants"
import { useContext } from "react"
import { BlockContext } from "../../../../contexts/BlockContext"
import { getCurrentMaxHeightBlock } from "../helper"
import { handlerError } from "../../../../helper/helper"

export function TaskContent({
    name,
    checked,
    imagesCount,
    contentId,
    onExpandBlock,
    contentsCount,
    handleAddContent,
    setSelectedOption,
    handleUpdateContent,
}) {
    const { docId, color, setSelectedContent, height, blockId } =
        useContext(BlockContext)

    const [isChecked, setIsChecked] = useState(Boolean(+checked))

    const [inputTask, setInputTask] = useState(name || "")

    const currentMaxHeightBlock = getCurrentMaxHeightBlock({
        contentsCount,
        imagesCount,
    })

    const createTaskContent = async (event) => {
        if (event.key !== "Enter") return
        event.preventDefault()

        const inputValue = event.target.value.trim()
        if (!inputValue) return

        loader.emit("start")
        const response = await ContentService.createNewContent(docId, {
            name: inputValue,
            position: contentsCount + 1,
            type: "task",
            block_id: blockId,
            checked: isChecked,
        })
        loader.emit("stop")
        handlerError(response)
        const { id, name, position, type, store_url } = response.results
        const checked = response.results.checked || false

        handleAddContent({
            id,
            name,
            position,
            type,
            store_url,
            checked,
            block_id: blockId,
        })

        setInputTask("")
        setIsChecked(false)

        if (height < TASK_EXPAND + currentMaxHeightBlock) {
            onExpandBlock(TASK_EXPAND)
        }
    }

    const updateAPi = async ({ newName, newChecked }) => {
        loader.emit("start")
        const response = await ContentService.updateContent(docId, contentId, {
            name: newName,
            checked: newChecked,
        })
        loader.emit("stop")
        handlerError(response)
        const { id, name, checked } = response.results
        return { id, name, checked }
    }

    const updateCheckBox = async (event) => {
        setIsChecked(event.target.checked)

        if (!name) return

        const newContent = await updateAPi({
            newName: inputTask,
            newChecked: event.target.checked,
        })
        if (!newContent) return

        const valueNewChecked = newContent.checked !== "0"
        handleUpdateContent({
            id: newContent.id,
            newName: newContent.name,
            newChecked: valueNewChecked,
        })
    }

    const updateNameTask = async (event) => {
        if (event.key !== "Enter") return
        event.preventDefault()

        const inputValue = event.target.value.trim()
        if (!inputValue) return

        const newContent = await updateAPi({ newName: inputValue })
        if (!newContent) return

        handleUpdateContent({
            id: newContent.id,
            newName: newContent.name,
            newChecked: newContent.checked,
        })
    }

    const checkInput = (event) => {
        const value = event.target.value
        setInputTask(value)
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

        if (height < currentMaxHeightBlock + IMAGE_EXPAND) {
            onExpandBlock(currentMaxHeightBlock + IMAGE_EXPAND - height)
        }
    }

    return (
        <div className="w-full pl-1 pr-4 cursor-pointer flex items-center relative overflow-hidden">
            <input
                id="myCheckBox"
                type="checkbox"
                checked={isChecked}
                onChange={updateCheckBox}
                className="rounded-lg focus:ring-0 cursor-pointer"
            />
            <input
                type="text"
                value={inputTask}
                onChange={checkInput}
                placeholder="Add item"
                onKeyDown={name ? updateNameTask : createTaskContent}
                className={clsx(
                    `w-full ${color} text-xs px-1 py-0 border-none focus:ring-0 rounded-lg focus:outline-0 h-6 overflow-hidden`,
                    isChecked ? "text-neutral-500 line-through" : ""
                )}
            />
            {inputTask === "" ? (
                <div className="absolute text-slate-500 cursor-pointer right-0 flex items-center">
                    <DocumentIcon
                        className="w-5 h-5 hover:text-black"
                        onClick={() => setSelectedOption("text")}
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
