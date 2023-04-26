import React, {
    useState,
    useRef,
    useCallback,
    useContext,
    useEffect,
} from "react"
import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid"
import { MenuBlock } from "../MenuBlock"
import { BlockContext } from "../../../contexts/BlockContext"
import clsx from "clsx"
import { useOnClickOutside } from "use-hooks"
import BlockService from "../../../services/blockService"
import { DEFAULT_TITLE } from "../../../utils/constants"
import { loader } from "../Loader"
import { Content } from "../Content"
import { handlerError } from "../../../helper/helper"
import RealtimeService from "../../../services/realtimeService"
import { extractBlockId } from "../../../helper/helper"

export const Block = ({
    title,
    children,
    listContents,
    isTitleHidden,
    onExpandBlock,
}) => {
    const { color, docId, blockId, channel, socketId, pageId, deleteBlock } =
        useContext(BlockContext)
    const [contents, setContents] = useState(listContents)
    const [inputTitle, setInputTitle] = useState(title || "")
    const [showMenu, setShowMenu] = useState(false)
    const isTempBlock = blockId === "temp"
    const [showTitle, setShowTitle] = useState(!isTitleHidden)

    const ref = useRef()
    useOnClickOutside(ref, () => setShowMenu(false))

    useEffect(() => {
        channel.bind("deleteBlock", function (data) {
            if (socketId !== data.message.data.socketId) {
                deleteBlock(extractBlockId(data.message.data.blockId))
            }
        })
        return () => {
            channel.unbind("deleteBlock")
        }
    },[])

    const handleInput = useCallback(
        async (event) => {
            if (event.key === "Enter") {
                loader.emit("start")
                event.preventDefault()
                const inputValue = event.target.value
                const response = await BlockService.updateBlock(
                    docId,
                    extractBlockId(blockId),
                    {
                        title: inputValue,
                    }
                )
                loader.emit("stop")
                handlerError(response)
                await RealtimeService.sendData("updateTitleBlock", docId, {
                    socketId: socketId,
                    pageId: pageId,
                    blockId: extractBlockId(blockId),
                    title: inputValue,
                    color: color,
                })
                setInputTitle(inputValue)
                event.target.blur()
            }
        },
        [blockId]
    )

    return (
        <div
            className={clsx(
                `w-full h-full shadow-lg rounded-lg border`,
                isTempBlock ? "transparent" : color
            )}
        >
            <div className="drag-handle w-full flex hover:bg-gray-100 hover:opacity-70 transition transform h-6 rounded-tr-lg rounded-tl-lg hover:cursor-grab active:cursor-grabbing">
                <button
                    className="ml-auto"
                    onClick={() => setShowMenu(!showMenu)}
                >
                    <EllipsisHorizontalIcon
                        className={clsx(
                            "w-full h-full inline mr-2",
                            `closeMenu_${blockId}`
                        )}
                    />
                </button>
            </div>

            <div
                className={
                    "drag-handle w-full h-full transform transition rounded-tr-lg rounded-tl-lg"
                }
                style={{ height: "calc(100% - 24px)" }}
            >
                {children}
                {!isTempBlock ? (
                    <div className="w-full h-full">
                        {showTitle ? (
                            <div className={`w-full px-2 h-auto ${color}`}>
                                <input
                                    value={inputTitle}
                                    onKeyDown={handleInput}
                                    style={{ cursor: "text" }}
                                    onChange={(event) => {
                                        setInputTitle(event.target.value)
                                    }}
                                    placeholder={DEFAULT_TITLE}
                                    className={`placeholder font-bold w-full px-3 ${color} border-none focus:ring-0 rounded-lg focus:outline-0 h-7 overflow-hidden`}
                                ></input>
                            </div>
                        ) : null}
                        <Content
                            contents={contents}
                            setContents={setContents}
                            onExpandBlock={onExpandBlock}
                        />
                    </div>
                ) : null}

                {showMenu && (
                    <div ref={ref}>
                        <MenuBlock
                            tabIndex={0}
                            title={inputTitle}
                            showTitle={showTitle}
                            isTitleHidden={isTitleHidden}
                            setShowTitle={setShowTitle}
                            showMenu={showMenu}
                            setShowMenu={setShowMenu}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
