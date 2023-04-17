import React, { useContext } from "react"
import { BlockContext } from "../../../contexts/BlockContext"
import { COLOR } from "../../../utils/constants"

export function Tile() {
    const { updateColor, blockId } = useContext(BlockContext)

    return (
        <div className="w-40 h-40 absolute right-0 hidden group-hover:block">
            <div className="h-full w-full shadow-lg bg-white rounded-lg border">
                <div className="my-2 px-3 text-neutral-500">
                    <div className="text-xs font-bold uppercase py-2">
                        COLOR
                    </div>
                    {COLOR.map(({ body }) => (
                        <div
                            key={body}
                            className={`${body} w-4 h-4 px-2 inline-block border border-gray-300 mx-2 rounded-lg`}
                            onClick={() => updateColor(body, blockId)}
                            style={{ cursor: "grab" }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    )
}
