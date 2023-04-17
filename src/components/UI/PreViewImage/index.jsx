import React, { useRef } from "react"
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid"
import "../Content/ContentItem/index.css"
import { useOnClickOutside } from "use-hooks"
import { saveAs } from "file-saver"

export function PreViewImage({ previewImage, setShowPreviewImage }) {
    const imageUrl = previewImage.url
    const ref = useRef()

    useOnClickOutside(ref, () => setShowPreviewImage(false))

    const downloadImage = () => {
        saveAs(`${imageUrl}`, "GuttaImage.jpg")
    }
    return (
        <div
            className="w-screen h-screen fixed z-50 top-0 cursor-default flex items-center left-0"
            style={{ background: "rgb(0,0,0,0.2)" }}
        >
            <div
                ref={ref}
                className="w-4/6 h-5/6 p-4 m-auto cursor-pointer relative rounded-lg"
                style={{
                    backgroundImage: `url('${imageUrl}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div
                    className="absolute w-9 h-9 bg-red-200 rounded-md flex items-center justify-center top-2 right-2 icon text-gray-100 hover:text-gray-200"
                    style={{ background: "rgb(0,0,0,0.5)" }}
                    onClick={downloadImage}
                >
                    <ArrowDownTrayIcon className="w-6 h-6" />
                </div>
            </div>
        </div>
    )
}
