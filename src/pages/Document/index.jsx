import React from "react"
import { Board } from "../../components/UI/Board"

export function Document(props) {
    return (
        <div className="relative bg-gray-100 flex justify-center">
            <div className="bg-white w-[1298px]  rounded-t-3xl border border-solid border-gray-200">
                <div className="w-full px-12">
                    <div className="h-12 w-full"></div>
                    <div className="h-24 w-full border border-t-2 border-x-0 border-gray-200"></div>
                </div>
                <div className=" px-12 pt-4">
                    <div className="w-full">
                        <Board />
                    </div>
                </div>
            </div>
        </div>
    )
}
