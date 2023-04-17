import React from "react"
import { TextContent } from "../TextContent"
import { TaskContent } from "../TaskContent"
import { ImageContent } from "../ImageContent"
import { XMarkIcon } from "@heroicons/react/24/outline"
import ContentService from "../../../../services/contentService"
import { loader } from "../../Loader"
import "./index.css"
import { useContext } from "react"
import { BlockContext } from "../../../../contexts/BlockContext"
import { handlerError } from "../../../../helper/helper"

export const ContentItem = ({
    content,
    blockId,
    imagesCount,
    deleteContent,
    handleUpdateContent,
}) => {
    const { docId } = useContext(BlockContext)
    const { id, name, type, store_url: url, checked } = content

    const handleDeleteContent = async () => {
        loader.emit("start")
        deleteContent(id)
        const response = await ContentService.deleteContentById(docId, id)
        loader.emit("stop")
        handlerError(response)
    }

    const iconProps = {
        className:
            "w-5 h-5 text-gray-400 cursor-pointer opacity-0 icon hover:text-black pl-1",
        onClick: handleDeleteContent,
    }

    return (
        <div
            className={`flex ${
                type === "image" ? "" : "items-center"
            } icon-container relative`}
        >
            {type !== "image" && <XMarkIcon {...iconProps} />}
            {type === "text" && (
                <TextContent
                    name={name}
                    contentId={id}
                    imagesCount={imagesCount}
                    handleUpdateContent={handleUpdateContent}
                />
            )}
            {type === "task" && (
                <TaskContent
                    name={name}
                    checked={checked}
                    contentId={id}
                    imagesCount={imagesCount}
                    handleUpdateContent={handleUpdateContent}
                />
            )}
            {type === "image" && (
                <>
                    <ImageContent
                        url={url}
                        blockId={blockId}
                        contentId={id}
                        handleUpdateContent={handleUpdateContent}
                    />
                    <XMarkIcon
                        {...iconProps}
                        className="w-5 h-5 text-gray-400 opacity-0 top-1 absolute icon cursor-pointer hover:text-black"
                    />
                </>
            )}
        </div>
    )
}
