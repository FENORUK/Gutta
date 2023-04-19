import clsx from "clsx"
import React from "react"

export default function InputTag(props) {
    const { name, type, placeholder, onChange, errorMessage = "" } = props

    return (
        <div className="relative w-full pb-8">
            <input
                name={name}
                onChange={onChange}
                type={type}
                className={clsx(
                    "bg-gray-50 border text-gray-900 text-base rounded-lg block w-full py-2.5 pl-4 pr-10",
                    errorMessage
                        ? "border-red-600 focus:border-red-600 focus:ring-red-700"
                        : "border-gray-400 focus:border-rose-300 focus:ring-rose-400"
                )}
                placeholder={placeholder}
                required
            />
            <p className="absolute bottom-2 left-0 text-sm text-red-600">
                {errorMessage}
            </p>
        </div>
    )
}
