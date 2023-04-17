import clsx from "clsx"
import debounce from "lodash/debounce"
import get from "lodash/get"
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

export const Board = ({
    docId,
    activePageId,
    setSelectedContent,
    selectedContent,
    listPages,
}) => {
    const containerRef = useRef()
    const [blocks, setBlocks] = useState([])
    const [cols, setCols] = useState(COLUMNS_NUMBER)
    const [previewImage, setPreviewImage] = useState([])
    const [showUpImage, setShowUpImage] = useState(false)
    const [mouseDownCoords, setMouseDownCoords] = useState(null)
    const [showPreviewImage, setShowPreviewImage] = useState(false)
    const [containerWidth, setContainerWidth] = useState(DOCUMENT_WIDTH)

    let temp = DEFAULT_TEMP

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
            if (block.w === 0) return <></>
            return (
                <div key={block.i}>
                    <BlockProvider
                        docId={docId}
                        height={block.h}
                        blockId={block.i}
                        color={block.color}
                        listPages={listPages}
                        deleteBlock={deleteBlock}
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
            className="w-full h-full min-h-screen select-none pb-48 placeDrag cursor-cell bg-white background"
            onMouseDown={handleMouseDown}
            onMouseMove={debounce(handleMouseMove, 5)}
            onClick={handleMouseUp}
        >
            <ReactGridLayout
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
