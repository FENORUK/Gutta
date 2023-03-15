import React from "react"
import { COLOR } from "../../../utils/constants"
import { loader } from "../Loader"
import customToast from "../../../utils/toast"
import BlockService from "../../../services/blockService"

export function Tile({ i: id, setColor }) {

    const updateColor = async (color, id) => {
        loader.emit("start")
        const response = await BlockService.updateBlock(id, {
            color: color,
        })
        loader.emit("stop")
        if (response.error) {
            const {
                error: { message },
            } = response
            customToast.error(message)
            return
        }
        setColor(color)
    }
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
                            onClick={() => updateColor(body, id)}
                            style={{ cursor: "grab" }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    )
}
