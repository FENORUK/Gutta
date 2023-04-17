import clsx from "clsx"
import debounce from "lodash/debounce"
import ReactGridLayout from "react-grid-layout"
import "/node_modules/react-resizable/css/styles.css"
import "/node_modules/react-grid-layout/css/styles.css"
import React, { useEffect, useRef, useState } from "react"

import "./index.css"
import { Block } from "../Block"
import {
    GRID_SIZE,
    MINIMUM_DISTANCE,
    COLUMNS_NUMBER,
    DOCUMENT_WIDTH,
    DEFAULT_TEMP,
} from "../../../utils/constants"
import { loader } from "../Loader"
import customToast from "../../../utils/toast"
import PageService from "../../../services/pageService"
import BlockService from "../../../services/blockService"
import { BlockProvider } from "../../../contexts/BlockContext"
import {
    extractValues,
    convertCoordinates,
    handleUpdateBlock,
} from "../../../helper/helper"

export function Board({ listPages, docId, activePageId }) {
    const containerRef = useRef()
    const [containerWidth, setContainerWidth] = useState(DOCUMENT_WIDTH)
    const [cols, setCols] = useState(COLUMNS_NUMBER)
    const [blocks, setBlocks] = useState([])
    const [mouseDownCoords, setMouseDownCoords] = useState(null)
    const [pages, setPages] = useState([])
    let temp = DEFAULT_TEMP

    useEffect(() => {
        if (!containerRef.current) return
        const width = containerRef.current.offsetWidth
        setContainerWidth(width)
        setCols(Math.floor(width / GRID_SIZE))

        const fetchPages = async () => {
            loader.emit("start")
            const response = await PageService.getPageByDocumentId({
                documentId: docId,
            })
            loader.emit("stop")
            if (response.error) {
                const {
                    error: { message },
                } = response
                customToast.error(message)
                return
            }
            const { results: listPages } = response
            setPages(listPages)
        }
        fetchPages()

        const fetchBlocks = async () => {
            loader.emit("start")
            const response = await BlockService.getBlockByPageId({
                documentId: docId,
                pageId: activePageId,
            })
            loader.emit("stop")
            if (response.error) {
                const {
                    error: { message },
                } = response
                customToast.error(message)
                return
            }
            const { results: listBlocks } = response
            const newBlocks = listBlocks.map((block) => {
                const [x, y] = extractValues(block.position)
                const [width, height] = extractValues(block.size)

                return {
                    i: block.id,
                    title: block.title,
                    color: block.color,
                    isTitleHidden: block.is_title_hidden,
                    x: x,
                    y: y,
                    w: width,
                    h: height,
                }
            })
            setBlocks(newBlocks)
        }
        fetchBlocks()
    }, [activePageId])

    const handleCreateBlock = async (updatedBlock) => {
        loader.emit("start")
        const response = await BlockService.createNewBlock({
            is_title_hidden: 0,
            position: String(`${updatedBlock.x}x${updatedBlock.y}`),
            size: String(`${updatedBlock.w}x${updatedBlock.h}`),
            page_id: activePageId,
        })
        loader.emit("stop")
        if (response.error) {
            const {
                error: { message },
            } = response
            customToast.error(message)
            return
        }
        const {
            results: { id, position, size },
        } = response
        return { id, position, size }
    }

    const handleMouseDown = (event) => {
        const { pageX, pageY } = event

        const isOverlapBlock = !event.target.classList.contains("placeDrag")
        if (isOverlapBlock) {
            return
        }

        const currentMouseCoords = {
            x: pageX - containerRef.current.offsetLeft,
            y: pageY - containerRef.current.offsetTop,
        }
        setMouseDownCoords(currentMouseCoords)
    }

    const handleMouseUp = async (event) => {
        const { pageX, pageY } = event

        if (!mouseDownCoords) return

        const deltaX =
            pageX - mouseDownCoords.x - containerRef.current.offsetLeft

        const deltaY =
            pageY - mouseDownCoords.y - containerRef.current.offsetTop

        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2)

        if (distance < MINIMUM_DISTANCE) {
            setMouseDownCoords(null)
            return
        }

        let newBlocks = blocks.filter((block) => block.i !== "temp")
        const updatedBlock = convertCoordinates(mouseDownCoords, {
            x: pageX - containerRef.current.offsetLeft,
            y: pageY - containerRef.current.offsetTop,
        })

        const newBlock = await handleCreateBlock(updatedBlock)

        const [x, y] = extractValues(newBlock.position)
        const [width, height] = extractValues(newBlock.size)

        newBlocks = [
            ...newBlocks,
            {
                i: newBlock.id,
                title: null,
                color: "bg-white",
                isTitleHidden: 0,
                x: x,
                y: y,
                w: width,
                h: height,
            },
        ]
        setBlocks(newBlocks)
        setMouseDownCoords(null)
        temp = DEFAULT_TEMP
    }

    const handleMouseMove = (event) => {
        if (!mouseDownCoords) return
        const { pageX, pageY } = event

        const deltaX =
            pageX - mouseDownCoords.x - containerRef.current.offsetLeft

        const deltaY =
            pageY - mouseDownCoords.y - containerRef.current.offsetTop

        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2)

        if (distance > MINIMUM_DISTANCE) {
            const updatedBlock = convertCoordinates(mouseDownCoords, {
                x: pageX - containerRef.current.offsetLeft,
                y: pageY - containerRef.current.offsetTop,
            })
            temp = { ...temp, ...updatedBlock }
            const restBlocks = blocks.filter((block) => block.i !== "temp")
            setBlocks([...restBlocks, temp])
        }
    }

    const deleteBlock = (id) => {
        setBlocks(blocks.filter((block) => block.i !== id))
    }

    const showBlocks = () => {
        return blocks.map((block) => {
            if (block.w === 0) return <></>
            return (
                <div key={block.i}>
                    <Block
                        i={block.i}
                        pages={pages}
                        blocks={blocks}
                        title={block.title}
                        color={block.color}
                        deleteBlock={deleteBlock}
                        setBlocks={setBlocks}
                        isTitleHidden={block.isTitleHidden}
                        className={clsx(
                            block.i === "temp" && "opacity-50 bg-rose-100"
                        )}
                    >
                        <span className="text-black">
                            {block.i === "temp" && `${block.w} x ${block.h}`}
                        </span>
                    </Block>
                </div>
            )
        })
    }

    const handleLayoutChange = (layout) => {
        const updatedLayout = layout.map((updatingBlock) => {
            const mappedBlock = blocks.find(
                (block) => block.i === updatingBlock.i
            )
            if (!mappedBlock) {
                return updatingBlock
            }
            return {
                ...mappedBlock,
                x: updatingBlock.x,
                y: updatingBlock.y,
                w: updatingBlock.w,
                h: updatingBlock.h,
            }
        })
        setBlocks(updatedLayout)
    }

    return (
        <div
            ref={containerRef}
            className="w-full h-full min-h-screen pb-48 placeDrag bg-white background"
            onMouseDown={handleMouseDown}
            onMouseMove={debounce(handleMouseMove, 5)}
            onClick={handleMouseUp}
            style={{ cursor: "cell" }}
        >
            <BlockProvider>
                <ReactGridLayout
                    className="placeDrag"
                    cols={cols}
                    rowHeight={GRID_SIZE}
                    width={containerWidth}
                    layout={blocks}
                    margin={[0, 0]}
                    onDragStop={handleUpdateBlock}
                    onResizeStop={handleUpdateBlock}
                    compactType={null}
                    draggableHandle=".drag-handle"
                    onLayoutChange={handleLayoutChange}
                >
                    {showBlocks()}
                </ReactGridLayout>
            </BlockProvider>
        </div>
    )
}
