import clsx from "clsx"
import debounce from "lodash/debounce"
import get from "lodash/get"
import ReactGridLayout from "react-grid-layout"
import "/node_modules/react-resizable/css/styles.css"
import "/node_modules/react-grid-layout/css/styles.css"
import React, { useEffect, useRef, useState, useCallback } from "react"

import "./index.css"
import { Block } from "../Block"
import {
    GRID_SIZE,
    MINIMUM_DISTANCE,
    COLUMNS_NUMBER,
    DOCUMENT_WIDTH,
    DEFAULT_TEMP,
    MIN_HEIGHT,
    MIN_WIDTH,
} from "../../../utils/constants"
import { BlockProvider } from "../../../contexts/BlockContext"
import BlockService from "../../../services/blockService"
import {
    extractValues,
    convertCoordinates,
    handleUpdateBlock,
    handlerError,
} from "../../../helper/helper"
import { loader } from "../Loader"
import { UpLoadImage } from "../UpLoadImage"
import { PreViewImage } from "../PreViewImage"
import RealtimeService from "../../../services/realtimeService"
import { extractBlockId } from "../../../helper/helper"

export const Board = ({
    docId,
    channel,
    socketId,
    listPages,
    activePageId,
    selectedContent,
    setSelectedContent,
}) => {
    const containerRef = useRef()
    const test = useRef()
    const [blocks, setBlocks] = useState([])
    const [cols, setCols] = useState(COLUMNS_NUMBER)
    const [previewImage, setPreviewImage] = useState([])
    const [showUpImage, setShowUpImage] = useState(false)
    const [mouseDownCoords, setMouseDownCoords] = useState(null)
    const [showPreviewImage, setShowPreviewImage] = useState(false)
    const [containerWidth, setContainerWidth] = useState(DOCUMENT_WIDTH)

    let temp = DEFAULT_TEMP
    useEffect(() => {
        channel.bind("createBlock", function (data) {
            if (
                socketId !== data.message.data.socketId &&
                data.message.data.pageId === activePageId
            ) {
                const newBlocks = [...blocks, data.message.data.newBlock]
                setBlocks(newBlocks)
            }
        })

        channel.bind("updateBlocks", function (data) {
            if (
                socketId !== data.message.data.socketId && activePageId &&
                data.message.data.pageId === activePageId
            ) {
                const newBlocks = data.message.data.newBlocks
                const listBlocks = blocks.map((block) => {
                    const mappedBlock = newBlocks.find(
                        (socketBlock) =>
                            extractBlockId(socketBlock.id) ===
                            extractBlockId(block.i)
                    )
                    if (!mappedBlock) {
                        return block
                    }
                    const [x, y] = extractValues(mappedBlock.position)
                    const [w, h] = extractValues(mappedBlock.size)
                    return {
                        ...block,
                        x,
                        y,
                        w,
                        h,
                    }
                })
                setBlocks(listBlocks)
            }
        })

        channel.bind("updateTitleBlock", function (data) {
            const newBlock = data.message.data
            if (socketId !== newBlock.socketId) {
                const listBlocks = blocks.map((block) => {
                    if (
                        extractBlockId(block.i) ===
                        extractBlockId(newBlock.blockId)
                    ) {
                        block = {
                            ...block,
                            i: `${block.i}_${Date.now()}`,
                            title: newBlock.title,
                            color: newBlock.color,
                        }
                    }
                    return block
                })
                setBlocks(listBlocks)
            }
        })

        channel.bind("updateStateTitleBlock", function (data) {
            const newBlock = data.message.data
            if (socketId !== newBlock.socketId) {
                const listBlocks = blocks.map((block) => {
                    if (
                        extractBlockId(block.i) ===
                        extractBlockId(newBlock.blockId)
                    ) {
                        block = {
                            ...block,
                            i: `${block.i}_${Date.now()}`,
                            isTitleHidden: newBlock.is_title_hidden,
                            title: newBlock.title,
                            color: newBlock.color,
                        }
                    }
                    return block
                })
                setBlocks(listBlocks)
            }
        })

        channel.bind("updateColorBlock", function (data) {
            const newBlock = data.message.data
            if (socketId !== newBlock.socketId) {
                const listBlocks = blocks.map((block) => {
                    if (
                        extractBlockId(block.i) ===
                        extractBlockId(newBlock.blockId)
                    ) {
                        block = {
                            ...block,
                            i: `${block.i}_${Date.now()}`,
                            color: newBlock.color,
                            title: newBlock.title,
                            isTitleHidden: !newBlock.isTitleHidden,
                        }
                    }
                    return block
                })
                setBlocks(listBlocks)
            }
        })

        channel.bind("updatePageBlock", function (data) {
            const newBlock = data.message.data
            if (socketId !== newBlock.socketId) {
                deleteBlock(newBlock.blockId)
            }
        })

        channel.bind("createContent", function (data) {
            const newBlock = data.message.data
            if (socketId !== newBlock.socketId) {
                const listBlocks = blocks.map((block) => {
                    if (
                        extractBlockId(block.i) ===
                        extractBlockId(newBlock.blockId)
                    ) {
                        block = {
                            ...block,
                            i: `${block.i}_${Date.now()}`,
                            contents: newBlock.listContents,
                            h: newBlock.height,
                        }
                    }
                    return block
                })
                setBlocks(listBlocks)
            }
        })
    }, [blocks])

    useEffect(() => {
        if (!containerRef.current) return
        const width = containerRef.current.offsetWidth
        setContainerWidth(width)
        setCols(Math.floor(width / GRID_SIZE))

        const fetchBlocks = async () => {
            loader.emit("start")
            const response = await BlockService.getBlockByPageId(
                docId,
                activePageId
            )
            loader.emit("stop")
            handlerError(response)
            const listBlocks = get(response, "results[0].blocks", [])

            const newBlocks = listBlocks.map((block) => {
                const [x, y] = extractValues(block.position)
                const [width, height] = extractValues(block.size)
                return {
                    i: block.id,
                    title: block.title,
                    contents: block.contents,
                    color: block.color,
                    isTitleHidden: block.is_title_hidden,
                    x: x,
                    y: y,
                    w: width,
                    h: height,
                    minH: MIN_HEIGHT,
                    minW: MIN_WIDTH,
                }
            })
            setBlocks(newBlocks)
        }
        fetchBlocks()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activePageId])

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

        loader.emit("start")
        const response = await BlockService.createNewBlock(docId, {
            is_title_hidden: 0,
            position: String(`${updatedBlock.x}x${updatedBlock.y}`),
            size: String(`${updatedBlock.w}x${updatedBlock.h}`),
            page_id: activePageId,
        })
        loader.emit("stop")
        handlerError(response)

        const { id, position, size } = response.results
        const [x, y] = extractValues(position)
        const [width, height] = extractValues(size)

        newBlocks = [
            ...newBlocks,
            {
                i: id,
                title: null,
                color: "bg-white",
                isTitleHidden: 0,
                contents: [],
                x: x,
                y: y,
                w: width,
                h: height,
                minH: MIN_HEIGHT,
                minW: MIN_WIDTH,
            },
        ]
        setBlocks(newBlocks)
        await RealtimeService.sendData("createBlock", docId, {
            socketId: socketId,
            pageId: activePageId,
            newBlock: {
                i: id,
                title: null,
                color: "bg-white",
                isTitleHidden: 0,
                contents: [],
                pageId: activePageId,
                x: x,
                y: y,
                w: width,
                h: height,
                minH: MIN_HEIGHT,
                minW: MIN_WIDTH,
            },
        })
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

    const onExpandBlock = (position) => (expandUnits) => {
        const newBlocks = [...blocks]
        const currentBlock = newBlocks[position]
        newBlocks[position] = {
            ...currentBlock,
            h: currentBlock.h + expandUnits,
        }
        handleUpdateBlock(docId, newBlocks, newBlocks[position])
        setBlocks(newBlocks)
    }

    const deleteBlock = (id) => {
        setBlocks(blocks.filter((block) => block.i !== id))
    }

    const showBlocks = () => {
        return blocks.map((block, index) => {
            return (
                <div key={block.i} data-grid={block}>
                    <BlockProvider
                        docId={docId}
                        height={block.h}
                        channel={channel}
                        socketId={socketId}
                        blockId={block.i}
                        pageId={block.pageId}
                        title={block.title}
                        color={block.color}
                        isTitleHidden={block.isTitleHidden}
                        listPages={listPages}
                        deleteBlock={deleteBlock}
                        block={block}
                        selectedContent={selectedContent}
                        setPreviewImage={setPreviewImage}
                        setShowPreviewImage={setShowPreviewImage}
                        setShowUpImage={setShowUpImage}
                        setSelectedContent={setSelectedContent}
                    >
                        <Block
                            title={block.title}
                            listContents={block.contents}
                            isTitleHidden={block.isTitleHidden}
                            onExpandBlock={onExpandBlock(index)}
                            className={clsx(
                                block.i === "temp" && "opacity-50 bg-rose-100"
                            )}
                        >
                            {block.i === "temp" ? (
                                <span className="text-black mx-3">
                                    {block.w} x {block.h}
                                </span>
                            ) : null}
                        </Block>
                    </BlockProvider>
                </div>
            )
        })
    }

    const handleLayoutChange = useCallback(
        async (layout) => {
            const changes = []

            const comparator = (
                { x, y, w, h },
                { x: x2, y: y2, w: w2, h: h2 }
            ) => x !== x2 || y !== y2 || w !== w2 || h !== h2

            let checkUpdate = true

            for (const updatingBlock of layout) {
                const { i, x, y, w, h } = updatingBlock

                if (i === "temp") checkUpdate = false

                const mappedBlock = blocks.find((block) => block.i === i)

                if (!mappedBlock) {
                    continue
                }

                if (comparator(mappedBlock, updatingBlock)) {
                    changes.push({
                        id: i,
                        size: `${w}x${h}`,
                        position: `${x}x${y}`,
                        pageId: mappedBlock.pageId,
                    })
                }

                Object.assign(mappedBlock, { x, y, w, h })
            }

            setBlocks(layout)
            if (checkUpdate && changes.length > 0) {
                loader.emit("start")
                const response = await BlockService.editListBLock(docId, {
                    blocks: changes,
                })
                loader.emit("stop")
                handlerError(response)
                await RealtimeService.sendData("updateBlocks", docId, {
                    pageId: activePageId,
                    socketId: socketId,
                    newBlocks: changes,
                })
            }
        },
        [blocks, docId, setBlocks]
    )

    return (
        <div
            ref={containerRef}
            className="w-full h-full min-h-screen select-none pb-48 placeDrag cursor-cell bg-white background"
            onMouseDown={handleMouseDown}
            onMouseMove={debounce(handleMouseMove, 5)}
            onClick={handleMouseUp}
        >
            <ReactGridLayout
                ref={test}
                className="placeDrag"
                cols={cols}
                rowHeight={GRID_SIZE}
                width={containerWidth}
                layout={blocks}
                margin={[0, 0]}
                autoSize={true}
                compactType={null}
                draggableHandle=".drag-handle"
                onLayoutChange={handleLayoutChange}
            >
                {showBlocks()}
            </ReactGridLayout>
            {showUpImage ? (
                <UpLoadImage
                    setShowUpImage={setShowUpImage}
                    selectedContent={selectedContent}
                    setSelectedContent={setSelectedContent}
                />
            ) : null}
            {showPreviewImage ? (
                <PreViewImage
                    previewImage={previewImage}
                    setShowPreviewImage={setShowPreviewImage}
                />
            ) : null}
        </div>
    )
}
