import clsx from "clsx"
import React from "react"

export const DropdownMenu = ({ id, className, children }) => {
    return (
        <div
            className={clsx(
                "z-10 hidden bg-white p-1.5 border border-gray-100 shadow-lg rounded-lg flex flex-col",
                className
            )}
            id={id}
            role="tooltip"
        >
            {children}
        </div>
    )
}
