import React, { useRef } from "react"
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline"
import "flowbite"
import { useOnClickOutside } from "use-hooks"
import { loader } from "../Loader"
import ContentService from "../../../services/contentService"
import { handlerError } from "../../../helper/helper"

export const UpLoadImage = ({
    setShowUpImage,
    selectedContent,
    setSelectedContent,
}) => {
    const ref = useRef()
    useOnClickOutside(ref, () => setShowUpImage(false))

    const handleUpLoadImage = async (event) => {
        setShowUpImage(false)
        loader.emit("start")
        const response = await ContentService.updateImageContent(
            selectedContent.documentId,
            selectedContent.contentId,
            event.target.files[0]
        )
        loader.emit("stop")
        handlerError(response)
        const url = response.results.store_url
        setSelectedContent({
            ...selectedContent,
            url: url,
        })
    }

    return (
        <div
            className={
                "closeUpLoad w-screen h-screen p-4 z-50 m-auto fixed top-0 left-0"
            }
            tabIndex={0}
            style={{ background: "rgb(0,0,0,0.05)", cursor: "default" }}
        >
            <div
                ref={ref}
                className="image w-2/5 h-4/6 mx-auto rounded-lg mt-32 bg-white"
            >
                <div className="w-full h-10">
                    <div className="w-full h-full px-3 pt-3">
                        <div className="h-10 flex items-center relative align-middle">
                            <span className="text-sm font-bold ml-2">
                                Upload Image
                            </span>
                            <div
                                onClick={() => setShowUpImage(false)}
                                style={{ cursor: "pointer" }}
                                className="closeUpLoad bg-gray-100 w-4 h-4 p-3 hover:bg-red-300 flex right-2 absolute items-center justify-center rounded-full"
                            >
                                <XMarkIcon className="closeUpLoad w-4 h-4 m-auto absolute" />
                            </div>
                        </div>
                        <div className="mx-auto rounded-lg border text-gray-300 border-gray-200 my-14 py-14 px-12 w-8/12 h-72 bg-gray-100 hover:bg-gray-50 flex align-middle justify-center items-center">
                            <div className="w-full">
                                <div class="flex items-center justify-center w-full">
                                    <label
                                        for="dropzone-file"
                                        class="flex flex-col items-center justify-center w-80 rounded-lg cursor-pointer"
                                    >
                                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                            <PhotoIcon className="w-10 h-10 mx-auto mb-4" />
                                            <p class="mb-2 w-full flex justify-center text-sm text-gray-500">
                                                <span class="font-semibold">
                                                    Click to upload
                                                </span>
                                            </p>
                                            <p class="text-xs text-gray-500">
                                                JPEG, PNG, JPG or GIF
                                            </p>
                                        </div>
                                        <input
                                            id="dropzone-file"
                                            type="file"
                                            class="hidden"
                                            onChange={handleUpLoadImage}
                                            accept="image/gif, image/jpeg, image/png, image/jpg"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
