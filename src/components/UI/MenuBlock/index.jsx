import React from "react"
import {
    EyeIcon,
    EyeSlashIcon,
    ArrowRightCircleIcon,
    PaintBrushIcon,
    TrashIcon,
    ChevronDownIcon,
} from "@heroicons/react/24/outline"
import { Tile } from "../Tile"
import { MoveBlock } from "../MoveBlocks"
import BlockService from "../../../services/blockService"
import customToast from "../../../utils/toast"
import { loader } from "../Loader"

export function MenuBlock({
    i: id,
    showTitle,
    setShowTitle,
    showMenu,
    setShowMenu,
    setColor,
    pages,
    deleteBlock,
}) {
    const handleShowTitle = async () => {
        loader.emit("start")
        const response = await BlockService.updateBlock(id, {
            is_title_hidden: Number(showTitle),
        })
        loader.emit("stop")

        if (response.error) {
            const {
                error: { message },
            } = response
            customToast.error(message)
            return
        }
        setShowTitle(!showTitle)
        setShowMenu(!showMenu)
    }

    const handleDelete = async () => {
        loader.emit("start")
        const response = await BlockService.deleteBlockById(id)
        deleteBlock(id)
        loader.emit("stop")

        if (response.error) {
            const {
                error: { message },
            } = response
            customToast.error(message)
            return
        }
    }

    return (
        <div
            className="w-52 h-48 absolute right-0 top-5"
            style={{ cursor: "pointer" }}
        >
            <div className="menuBlock h-full shadow-lg bg-white rounded-lg border">
                <div className="my-2 px-2 text-neutral-500">
                    <button
                        className="py-2 flex w-full left-0 my-1 hover:bg-gray-200 rounded-lg hover:text-neutral-800"
                        onClick={handleShowTitle}
                    >
                        <div>
                            {showTitle ? (
                                <div>
                                    <EyeIcon className="w-4 h-4 inline mx-2" />
                                    <span>Hide title</span>
                                </div>
                            ) : (
                                <div>
                                    <EyeSlashIcon className="w-4 h-4 inline mx-2" />
                                    <span>Show title</span>
                                </div>
                            )}
                        </div>
                    </button>

                    <div className="py-2 my-1 group hover:bg-gray-200 rounded-lg hover:text-neutral-800">
                        <ArrowRightCircleIcon className="w-4 h-4 inline mx-2" />
                        <span>Move to</span>
                        <ChevronDownIcon className="w-4 h-4 inline mx-2 float-right mt-1" />
                        <MoveBlock
                            i={id}
                            pages={pages}
                            deleteBlock={deleteBlock}
                        />
                    </div>

                    <div className="py-2 my-1 group hover:bg-gray-200 rounded-lg hover:text-neutral-800">
                        <PaintBrushIcon className="w-4 h-4 inline mx-2" />
                        <span>Tile style</span>
                        <ChevronDownIcon className="w-4 h-4 inline mx-2 float-right mt-1" />
                        <Tile i={id} setColor={setColor} />
                    </div>

                    <button
                        className="py-2 flex my-1 w-full hover:bg-gray-200 rounded-lg hover:text-neutral-800"
                        onClick={handleDelete}
                    >
                        <div>
                            <TrashIcon className="w-4 h-4 inline mx-2" />
                            <span>Delete</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}
