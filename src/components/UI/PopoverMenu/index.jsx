import clsx from "clsx"
import React from "react"

export const PopoverMenu = (props) => {
    const { id, className, children } = props
    return (
        <div
            className={clsx(
                "absolute z-10 invisible transition-opacity border border-gray-200 p-2 bg-white shadow-lg rounded-lg",
                className
            )}
            id={id}
            role="tooltip"
        >
            {children}
        </div>
    )
}
