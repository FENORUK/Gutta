import React, { useState, useRef, useContext } from "react"
import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid"
import { MenuBlock } from "../MenuBlock"
import { BlockContext } from "../../../contexts/BlockContext"
import clsx from "clsx"
import { useOnClickOutside } from "use-hooks"
import { DEFAULT_TITLE } from "../../../utils/constants"

export function Block({
    i: id,
    title,
    color: ogColor,
    isTitleHidden,
    children,
    deleteBlock,
    pages,
}) {
    const [color, setColor] = useState(ogColor || "bg-white")
    const { handleInput } = useContext(BlockContext)
    const isTempBlock = id === "temp"
    const [showMenu, setShowMenu] = useState(false)
    const [showTitle, setShowTitle] = useState(!isTitleHidden)

    const ref = useRef()
    useOnClickOutside(ref, () => setShowMenu(false))

    return (
        <div
            className={clsx(
                `w-full h-full shadow-lg rounded-lg border`,
                isTempBlock ? "bg-red-50" : color
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
                            `closeMenu_${id}`
                        )}
                    />
                </button>
            </div>

            <div
                className={clsx(
                    "drag-handle w-full h-full transform transition rounded-tr-lg rounded-tl-lg"
                )}
                style={{ cursor: "text" }}
            >
                {children}
                {!isTempBlock ? (
                    <div className="w-full h-full">
                        {showTitle ? (
                            <div className={`w-full px-2 h-auto ${color}`}>
                                <input
                                    onKeyDown={(e) => handleInput(e, id)}
                                    style={{ cursor: "text" }}
                                    defaultValue={title}
                                    placeholder={DEFAULT_TITLE}
                                    className={`placeholder font-bold w-full px-3 ${color} border-none focus:ring-0 rounded-lg focus:outline-0 h-9 overflow-hidden`}
                                ></input>
                            </div>
                        ) : null}
                    </div>
                ) : null}

                {showMenu && (
                    <div ref={ref}>
                        <MenuBlock
                            i={id}
                            color={color}
                            tabIndex={0}
                            pages={pages}
                            showTitle={showTitle}
                            setShowTitle={setShowTitle}
                            showMenu={showMenu}
                            setShowMenu={setShowMenu}
                            setColor={setColor}
                            deleteBlock={deleteBlock}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
