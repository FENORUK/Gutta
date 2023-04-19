import React from "react"
import { ModalBox } from "."
import { useState } from "react"
import { useEffect } from "react"

export const EditNameModal = (props) => {
    const {
        id,
        title,
        initialName = "",
        placeholder = "",
        onCancel,
        onSubmit,
        titleSubmitButton = "",
    } = props
    const [tempName, setTempName] = useState("")
    const [allowSubmit, setAllowSubmit] = useState(false)
    useEffect(() => {
        setTempName(initialName)
    }, [initialName])

    const submit = () => {
        setTempName("")
        setAllowSubmit(false)
        onSubmit(tempName)
    }

    const checkValidNameInput = (newName) => {
        setAllowSubmit(newName !== "" && newName !== initialName)
    }

    return (
        <ModalBox id={id}>
            <div className="pb-5 space-y-3 text-center">
                <div className="font-bold text-xl">{title}</div>
                <input
                    autoFocus
                    type="text"
                    placeholder={placeholder}
                    className="w-full border-2 border-gray-100 focus:border-gray-100 text-base p-1 px-4 py-1.5 placeholder-gray-300 text-slate-600 rounded-md focus:ring-0"
                    value={tempName}
                    onChange={(event) => {
                        checkValidNameInput(event.target.value)
                        setTempName(event.target.value)
                    }}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" && allowSubmit) {
                            submit()
                        }
                    }}
                />
            </div>
            <div className="flex items-center space-x-3 rounded-b">
                <button
                    type="button"
                    className="w-full transition text-slate-500 bg-gray-100 hover:bg-gray-200 focus:outline-none rounded-lg text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
                    onClick={() => {
                        onCancel()
                        setTempName(initialName)
                        setAllowSubmit(false)
                    }}
                >
                    Close
                </button>
                <button
                    className="w-full transition text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-100 disabled:text-slate-500 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    onClick={submit}
                    disabled={!allowSubmit}
                >
                    {titleSubmitButton}
                </button>
            </div>
        </ModalBox>
    )
}
