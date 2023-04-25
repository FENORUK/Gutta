import { CheckIcon, EllipsisVerticalIcon } from "@heroicons/react/24/solid"
import clsx from "clsx"
import React from "react"
import { IconButton } from "../IconButton"
import "./index.css"

export const PageTab = (props) => {
    const {
        id,
        name,
        isActive = false,
        onClick,
        isOnlyViewPages,
        onMenuClick,
    } = props
    return (
        <div
            id={id + "_p"}
            className={clsx(
                "relative flex items-center bg-white justify-center group cursor-pointer rounded-t-md font-bold",
                isActive
                    ? "border-b-white border-gray-100 border-2 text-black active-page"
                    : "border-b-gray-100 text-slate-500"
            )}
            title={name}
            onClick={() => {
                onClick(id)
            }}
        >
            <CheckIcon
                className={clsx(
                    "w-8 h-8 p-2.5 opacity-0 text-slate-500",
                    isActive && "opacity-100"
                )}
            />
            <div className="text-xs max-w-[120px] truncate ">{name}</div>
            <IconButton
                id={id}
                className="text-slate-500 relative w-7 h-7 bg-white justify-center rounded-md"
                onClick={(event) => {
                    if (isOnlyViewPages) return
                    event.stopPropagation()
                    onMenuClick(id)
                }}
            >
                <EllipsisVerticalIcon
                    className={clsx(
                        "w-4 h-4 opacity-0",
                        !isOnlyViewPages && "group-hover:opacity-100"
                    )}
                />
            </IconButton>
        </div>
    )
}
