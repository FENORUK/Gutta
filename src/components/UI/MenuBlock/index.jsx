import React, { useContext } from "react"
import {
    EyeIcon,
    EyeSlashIcon,
    ArrowRightCircleIcon,
    PaintBrushIcon,
    TrashIcon,
    ChevronDownIcon,
} from "@heroicons/react/24/outline"
import { BlockContext } from "../../../contexts/BlockContext"
import { Tile } from "../Tile"
import { MoveBlock } from "../MoveBlocks"
import BlockService from "../../../services/blockService"
import { loader } from "../Loader"
import { handlerError } from "../../../helper/helper"
import RealtimeService from "../../../services/realtimeService"
import { extractBlockId } from "../../../helper/helper"

export function MenuBlock({
    showTitle,
    setShowTitle,
    showMenu,
    setShowMenu,
    title,
}) {
    const { deleteBlock, docId, blockId, socketId, color } =
        useContext(BlockContext)

    const handleShowTitle = async () => {
        loader.emit("start")
        const response = await BlockService.updateBlock(
            docId,
            extractBlockId(blockId),
            {
                is_title_hidden: Number(showTitle),
            }
        )
        loader.emit("stop")
        handlerError(response)
        setShowTitle(!showTitle)
        setShowMenu(!showMenu)
        await RealtimeService.sendData("updateStateTitleBlock", docId, {
            socketId: socketId,
            blockId: extractBlockId(blockId),
            is_title_hidden: Number(showTitle),
            title: title,
            color: color,
        })
    }

    const handleDelete = async () => {
        deleteBlock(extractBlockId(blockId))
        loader.emit("start")
        const response = await BlockService.deleteBlockById(
            docId,
            extractBlockId(blockId)
        )
        loader.emit("stop")
        handlerError(response)
        await RealtimeService.sendData("deleteBlock", docId, {
            socketId: socketId,
            blockId: extractBlockId(blockId),
        })
    }

    return (
        <div
            className="w-52 h-48 absolute right-0 top-0"
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
                        <MoveBlock />
                    </div>

                    <div className="py-2 my-1 group hover:bg-gray-200 rounded-lg hover:text-neutral-800">
                        <PaintBrushIcon className="w-4 h-4 inline mx-2" />
                        <span>Block style</span>
                        <ChevronDownIcon className="w-4 h-4 inline mx-2 float-right mt-1" />
                        <Tile title={title} showTitle={showTitle} />
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
