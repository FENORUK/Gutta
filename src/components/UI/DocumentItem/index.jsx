import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid"
import moment from "moment/moment"
import React, { useContext } from "react"
import { generatePath, useNavigate } from "react-router-dom"
import { IconButton } from "../IconButton"
import { DocumentContext } from "../../../pages/Workspace"
import { PATH } from "../../../utils/constants"

export const DocumentItem = (props) => {
    const navigate = useNavigate()
    const {
        document: { id, name, created_at },
    } = props

    const { onDocumentMenuClicked } = useContext(DocumentContext)

    return (
        <div
            className="h-72 w-full hover:cursor-pointer group"
            onClick={() => {
                navigate(generatePath(PATH.DOCUMENT.DEFAULT, { docId: id }))
            }}
        >
            <div className="h-56 bg-gray-50 rounded-2xl pt-4 px-4 border border-gray-100">
                <div className="w-full h-full bg-white rounded-t-xl bg-[url('assets/document-cover.png')] bg-cover"></div>
            </div>
            <div className="flex justify-between items-center mt-4">
                <div>
                    <div
                        className="text-base font-bold max-w-[200px] truncate"
                        title={name}
                    >
                        {name}
                    </div>
                    <div className="text-xs text-gray-400">
                        {moment(created_at).fromNow()}
                    </div>
                </div>
                <div>
                    <IconButton
                        id={id}
                        onClick={(event) => {
                            event.stopPropagation()
                            onDocumentMenuClicked(id)
                        }}
                        className="h-8 px-2 m-0 bg-gray-200 opacity-0 group-hover:opacity-100"
                    >
                        <EllipsisHorizontalIcon className="w-4 h-4" />
                    </IconButton>
                </div>
            </div>
        </div>
    )
}
