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
                "text-white bg-rose-500 hover:bg-rose-600 font-bold rounded-lg text-base px-5 py-2.5 w-full focus:outline-none",
                className
            )}
            onClick={onClick}
        >
            {children}
        </button>
    )
}
