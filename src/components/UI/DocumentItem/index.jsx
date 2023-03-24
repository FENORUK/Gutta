import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid"
import moment from "moment/moment"
import React from "react"
import { useNavigate } from "react-router-dom"
import { IconButton } from "../IconButton"
export const DocumentItem = (props) => {
    const navigate = useNavigate()
    const {
        document: { id, name, created_at },
    } = props

    return (
        <div
            className="h-80 w-full hover:cursor-pointer group"
            onClick={() => {
                navigate(`/document/${id}`)
            }}
        >
            <div className="h-56 bg-gray-50 rounded-2xl pt-4 px-4 border">
                <div className="w-full h-full bg-white rounded-t-xl bg-[url('assets/document-cover.png')] bg-cover"></div>
            </div>
            <div className="flex justify-between items-center mt-4">
                <div>
                    <div className="text-base font-bold">{name}</div>
                    <div className="text-xs text-gray-400">
                        {moment(created_at).fromNow()}
                    </div>
                </div>
                <div>
                    <IconButton
                        onClick={(event) => {
                            event.stopPropagation()
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
