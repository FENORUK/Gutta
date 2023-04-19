import React from "react"
import { DocumentIcon } from "@heroicons/react/24/solid"

export function MiniWorkSpace({ workspace }) {
    return (
        <div className="py-3 pl-2 rounded-lg cursor-pointer hover:bg-gray-100">
            <a
                href={workspace.url}
                className="flex items-center text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
            >
                <DocumentIcon
                    aria-hidden="true"
                    className="w-4 h-4 text-slate-500 transition duration-75 group-hover:text-black"
                ></DocumentIcon>
                <span className="ml-3 text-slate-500 text-sm">
                    {workspace.name}
                </span>
            </a>
        </div>
    )
}
