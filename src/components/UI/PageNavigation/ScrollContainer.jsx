import React, { useState, useRef, useEffect } from "react"
import { IconButton } from "../IconButton"
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    PlusIcon,
} from "@heroicons/react/24/solid"
import get from "lodash/get"
import { PAGE_SCROLL_WIDTH } from "../../../utils/constants"
import clsx from "clsx"

export const ScrollContainer = ({
    children,
    addButtonProps,
    itemsCount,
    activePageId,
    isOnlyViewPages,
}) => {
    const scrollRef = useRef()
    const [scrollRefLeft, setScrollRefLeft] = useState(0)
    const [isOverflow, setIsOverflow] = useState(false)

    useEffect(() => {
        setIsOverflow(
            get(scrollRef, "current.scrollWidth", 0) >= PAGE_SCROLL_WIDTH
        )
    }, [itemsCount])

    useEffect(() => {
        const element = document.getElementById(activePageId + "_p")
        const elementOffsetLeft = element?.offsetLeft

        setScrollRefLeft(elementOffsetLeft)
        scrollTo({ left: elementOffsetLeft })
    }, [activePageId])

    const scrollTo = ({ left }) => {
        setScrollRefLeft(left)
        scrollRef.current.scrollTo({
            top: 0,
            left,
            behavior: "smooth",
        })
    }

    return (
        <>
            <div
                ref={scrollRef}
                className="h-8 flex max-w-full overflow-x-auto container"
            >
                {children}
            </div>
            <div className="absolute z-10 -right-[120px] top-1 w-[120px] flex">
                {isOverflow && (
                    <>
                        <div className="w-8 px-2 button-scroll">
                            <IconButton
                                className="p-0 h-6 w-6 items-center justify-center text-slate-500 hover:text-black disabled:text-gray-400 bg-gray-100"
                                onClick={() => {
                                    scrollTo({ left: 0 })
                                }}
                                disabled={scrollRefLeft === 0}
                            >
                                <ChevronLeftIcon className="w-4 h-4" />
                            </IconButton>
                        </div>
                        <div className="w-8 px-2">
                            <IconButton
                                className="p-0 h-6 w-6 items-center justify-center text-slate-500 hover:text-black disabled:text-gray-400 bg-gray-100"
                                onClick={() => {
                                    scrollTo({
                                        left: scrollRef.current.scrollWidth,
                                    })
                                }}
                                disabled={
                                    scrollRefLeft ===
                                    scrollRef.current.scrollWidth
                                }
                            >
                                <ChevronRightIcon className="w-4 h-4" />
                            </IconButton>
                        </div>
                    </>
                )}
                <div className="w-8 flex items-center justify-center ml-2 text-slate-500">
                    <IconButton
                        {...addButtonProps}
                        className={clsx(
                            "p-0 h-6 w-6 items-center justify-center bg-gray-100",
                            isOnlyViewPages
                                ? "cursor-not-allowed"
                                : "hover:text-black"
                        )}
                        disabled={isOnlyViewPages}
                    >
                        <PlusIcon className="w-4 h-4" />
                    </IconButton>
                </div>
            </div>
        </>
    )
}
