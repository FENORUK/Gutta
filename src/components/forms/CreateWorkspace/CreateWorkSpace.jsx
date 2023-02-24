import React from "react"

export default function AddWorkSpace() {
    return (
        <div className="w-[390px] h-[190px] fixed top-1/2 left-1/2 transform-translate-1/2-1/2 z-10 bg-white border-2 border-gray-300 rounded-lg shadow-lg">
            <form action="" className="w-390 h-190 border-2 bg-white flex">
                <span className="block items-center justify-center">
                    Create Workspace
                </span>
                <input
                    type="text"
                    id="workspace_name"
                    placeholder="Workspace Name"
                    className="my-4"
                />
            </form>
        </div>
    )
}
