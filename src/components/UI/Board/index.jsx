import React, { useEffect, useRef, useState } from "react"
import ReactGridLayout from "react-grid-layout"
import { Block } from "../Block"
import { convertCoordinates } from "./convertCoordinates"
import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"
import "./index.css"
import {
    GRID_SIZE,
    MINIMUM_DISTANCE,
    COLUMNS_NUMBER,
    DOCUMENT_WIDTH,
    MIN_HEIGHT,
    MIN_WIDTH,
} from "../../../utils/constants"

export function Board() {
    const containerRef = useRef()
    const [containerWidth, setContainerWidth] = useState(DOCUMENT_WIDTH)
    const [cols, setCols] = useState(COLUMNS_NUMBER)
    const [blocks, setBlocks] = useState([])
    const [mouseDownCoords, setMouseDownCoords] = useState(null)

    useEffect(() => {
        if (!containerRef.current) return
        const width = containerRef.current.offsetWidth
        setContainerWidth(width)
        setCols(Math.floor(width / GRID_SIZE))
    }, [])

    const handleMouseDown = (event) => {
        const { pageX, pageY } = event

        const isOverlapBlock = !event.target.classList.contains("placeDrag")
        if (isOverlapBlock) {
            return
        }

        setMouseDownCoords({
            x: pageX - containerRef.current.getBoundingClientRect().x,
            y: pageY - containerRef.current.getBoundingClientRect().y,
        })
    }

    const handleMouseUp = (event) => {
        const { pageX, pageY } = event
        if (!mouseDownCoords) return

        const deltaX =
            pageX -
            mouseDownCoords.x -
            containerRef.current.getBoundingClientRect().x
        const deltaY =
            pageY -
            mouseDownCoords.y -
            containerRef.current.getBoundingClientRect().y
        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2)

        if (distance < MINIMUM_DISTANCE) {
            setMouseDownCoords(null)
            return
        }

        let newBlocks = [...blocks]
        const updatedBlock = convertCoordinates(mouseDownCoords, {
            x: pageX - containerRef.current.getBoundingClientRect().x,
            y: pageY - containerRef.current.getBoundingClientRect().y,
        })

        const index =
            newBlocks.length === 0
                ? "0"
                : String(Number(newBlocks[newBlocks.length - 1].i) + 1)

        newBlocks = [
            ...newBlocks,
            {
                i: index,
                x: updatedBlock.x,
                y: updatedBlock.y,
                w: updatedBlock.w,
                h: updatedBlock.h,
                minH: MIN_HEIGHT,
                minW: MIN_WIDTH,
            },
        ]

        setBlocks(newBlocks)
        setMouseDownCoords(null)
    }

    const createBlocks = () => {
        return blocks.map((block) => {
            if (block.w === 0) return <></>
            return (
                <div key={block.i}>
                    <Block></Block>
                </div>
            )
        })
    }

    return (
        <div
            ref={containerRef}
            className="w-full h-full min-h-screen placeDrag bg-white background"
            onMouseDown={handleMouseDown}
            onClick={handleMouseUp}
        >
            <ReactGridLayout
                className="placeDrag"
                cols={cols}
                rowHeight={GRID_SIZE}
                width={containerWidth}
                layout={blocks}
                margin={[0, 0]}
                compactType={null}
                draggableHandle=".drag-handle"
                style={{ cursor: "grab" }}
                onLayoutChange={setBlocks}
            >
                {createBlocks()}
            </ReactGridLayout>
        </div>
    )
}
