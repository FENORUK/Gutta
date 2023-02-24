import clsx from "clsx"
import React from "react"

export default function Button({
    type = "button",
    onClick = () => {},
    children,
    className = "",
}) {
    return (
        <button
            type={type}
            className={clsx(
                "text-white bg-red-300 hover:bg-red-100 font-medium rounded-lg text-base px-5 py-2.5 w-full mr-2 mb-2 focus:outline-none",
                className
            )}
            onClick={onClick}
        >
            {children}
        </button>
    )
}
