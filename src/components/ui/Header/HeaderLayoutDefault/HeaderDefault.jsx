import React from "react"

export default function HeaderLayoutDefault() {
    return (
        <div
            className={
                "header flex justify-end h-14 mx-14 border-b-2 border-solid border-gray-100"
            }
        >
            <div className={"flex items-center rounded-lg w-30 h-14 px-4"}>
                <p>Email_nef</p>
            </div>
        </div>
    )
}
