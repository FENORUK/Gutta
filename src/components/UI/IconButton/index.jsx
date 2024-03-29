import clsx from "clsx"
import React from "react"

export const IconButton = (props) => {
    const {
        className = "h-8 px-2 mx-1 text-slate-500 hover:text-black bg-gray-100 justify-center",
        disabled,
        children,
        title,
        onClick,
        id,
    } = props

    return (
        <button
            className={clsx(
                "transition rounded-2xl flex flex-row items-center text-sm",
                className
            )}
            id={id}
            disabled={disabled}
            title={title}
            onClick={onClick}
        >
            {children}
        </button>
    )
}
