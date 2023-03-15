import React from "react"
import customToast from "../../../utils/toast"
import BlockService from "../../../services/blockService"
import { loader } from "../Loader"

export function MoveBlock({ i: id, pages, deleteBlock }) {
    const handleChangePage = async (pageId) => {
        loader.emit("start")
        const response = await BlockService.updateBlock(id, {
            page_id: pageId,
        })
        loader.emit("stop")

        if (response.error) {
            const {
                error: { message },
            } = response
            customToast.error(message)
            return
        }
        deleteBlock(id)
    }

    return (
        <div className="w-40 absolute right-0 hidden group-hover:block scrollbar-track-gray-100 scrollbar-thumb-black scrollbar-w-1">
            <div className="h-full w-full shadow-lg bg-white rounded-lg border">
                <div className="my-2 px-3 text-neutral-500 max-h-[200px] overflow-auto">
                    <div className="text-xs font-bold uppercase py-2">
                        PAGES:
                    </div>
                    {pages.map((page) => (
                        <div
                            key={page.id}
                            className="text-neutral-500"
                            onClick={() => handleChangePage(page.id)}
                        >
                            <div className="w-full h-8 flex font-normal items-center hover:bg-gray-200 rounded-lg hover:text-neutral-800">
                                <div className="px-2">{page.name}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
