import React, { useContext, useState } from "react"
import { TextContent } from "./TextContent"
import { ImageContent } from "./ImageContent"
import { TaskContent } from "./TaskContent"
import { ContentItem } from "./ContentItem"
import { ChevronDownIcon } from "@heroicons/react/24/outline"
import { getCurrentMaxHeightBlock, addContent, updateContent } from "./helper"
import { BlockContext } from "../../../contexts/BlockContext"

export const Content = ({ contents, setContents, onExpandBlock }) => {
    const { height } = useContext(BlockContext)
    const [selectedOption, setSelectedOption] = useState("text")
    const contentsCount = contents?.length
    const imagesCount = contents?.filter((item) => item.type === "image").length

    const deleteContent = (id) => {
        setContents(contents?.filter((content) => content.id !== id))
    }

    const handlerAddContent = ({ id, name, type, store_url, checked }) => {
        setContents((prevContents) =>
            addContent(prevContents, {
                id,
                name,
                type,
                store_url,
                checked,
            })
        )
    }

    const handlerUpdateContent = ({
        contentId,
        newName,
        newChecked,
        newUrl,
    }) => {
        setContents((prevContents) =>
            updateContent(prevContents, {
                contentId,
                newName,
                newChecked,
                newUrl,
            })
        )
    }

    const showContents = () => {
        return contents?.map((content) => {
            return (
                <div key={content.id}>
                    <ContentItem
                        content={content}
                        imagesCount={imagesCount}
                        deleteContent={deleteContent}
                        handleUpdateContent={handlerUpdateContent}
                    />
                </div>
            )
        }, [])
    }

    const maxHeightBlock = getCurrentMaxHeightBlock({
        contentsCount,
        imagesCount,
    })

    const handleShowMoreContent = () => {
        const valueHeight = maxHeightBlock - height
        onExpandBlock(valueHeight)
    }

    const isOverflown = height < maxHeightBlock

    return (
        <div
            className="content w-auto cursor-text overflow-hidden"
            style={{
                height: "calc(100% - 52px)",
            }}
        >
            <div className="h-full">
                {showContents()}
                <div className="px-5">
                    {selectedOption === "text" && (
                        <TextContent
                            imagesCount={imagesCount}
                            contentsCount={contentsCount}
                            onExpandBlock={onExpandBlock}
                            handleAddContent={handlerAddContent}
                            setSelectedOption={setSelectedOption}
                        />
                    )}
                    {selectedOption === "image" && (
                        <ImageContent
                            contentsCount={contentsCount}
                            onExpandBlock={onExpandBlock}
                        />
                    )}
                    {selectedOption === "task" && (
                        <TaskContent
                            imagesCount={imagesCount}
                            contentsCount={contentsCount}
                            onExpandBlock={onExpandBlock}
                            handleAddContent={handlerAddContent}
                            setSelectedOption={setSelectedOption}
                        />
                    )}
                </div>
            </div>
            {isOverflown ? (
                <div
                    className="w-full h-6 text-xs cursor-pointer absolute text-gray-400 "
                    onClick={handleShowMoreContent}
                >
                    <div className="absolute flex right-6 w-14">
                        <span className="hover:text-gray-500 mr-2">more</span>
                        <ChevronDownIcon className="w-4 h-4 hover:text-gray-500" />
                    </div>
                </div>
            ) : null}
        </div>
    )
}
