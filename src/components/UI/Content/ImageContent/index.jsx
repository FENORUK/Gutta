import React, { useEffect } from "react"
import { PhotoIcon } from "@heroicons/react/24/outline"
import { useContext } from "react"
import { BlockContext } from "../../../../contexts/BlockContext"
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline"
import "../ContentItem/index.css"

export function ImageContent({ url, contentId, handleUpdateContent }) {
    const {
        docId,
        blockId,
        setShowUpImage,
        selectedContent,
        setPreviewImage,
        setSelectedContent,
        setShowPreviewImage,
    } = useContext(BlockContext)

    const selectedUrl =
        selectedContent.contentId === contentId ? selectedContent.url : url

    useEffect(() => {
        handleUpdateContent({
            contentId: selectedContent.contentId,
            newUrl: selectedContent.url,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedContent.contentId, selectedContent.url])

    const showUpLoadImage = () => {
        setShowUpImage(true)
        setSelectedContent({
            documentId: docId,
            blockId: blockId,
            contentId: contentId,
        })
    }

    const previewImage = () => {
        setPreviewImage({ url: selectedUrl })
        setShowPreviewImage(true)
    }
    const hasUrl = !url && !selectedUrl

    return (
        <div
            className={`w-full h-24 bg-gray-200 flex text-zinc-500 bg-cover bg-center flex-col items-center justify-center relative`}
            style={{
                cursor: hasUrl ? "pointer" : "default",
                backgroundImage: `url('${selectedUrl}')`,
            }}
            onClick={() => {
                if (hasUrl) {
                    showUpLoadImage()
                }
            }}
        >
            {hasUrl ? (
                <div>
                    <div className="flex flex-col items-center">
                        <PhotoIcon className="w-6 h-6" />
                    </div>
                    <span className="text-sm mt-2">Add an image</span>
                </div>
            ) : (
                <div
                    title="Full screen"
                    className="right-1 icon top-1 cursor-pointer w-6 h-6 rounded-md opacity-0 bg-gray-100 hover:bg-white hover:opacity-100 absolute flex items-center justify-center"
                    onClick={() => previewImage()}
                >
                    <ArrowsPointingOutIcon onClick={() => previewImage()} className="w-4 h-4 text-gray-300 hover:text-black" />
                </div>
            )}
        </div>
    )
}
