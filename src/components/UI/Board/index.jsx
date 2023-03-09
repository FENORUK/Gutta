import React, { useEffect, useRef, useState } from "react"
import ReactGridLayout from "react-grid-layout"
import {
    COLUMNS_NUMBER,
    DOCUMENT_WIDTH,
    GRID_SIZE,
} from "../../../utils/constants"
import { Block } from "../Block"
import { getGridElements } from "./utils"
import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"
import "./index.css"

export function Board() {
    const containerRef = useRef()
    const [containerWidth, setContainerWidth] = useState(DOCUMENT_WIDTH)
    const [cols, setCols] = useState(COLUMNS_NUMBER)
    const [items, setItems] = useState(getGridElements())

    useEffect(() => {
        if (!containerRef.current) return
        const width = containerRef.current.offsetWidth
        setContainerWidth(width)
        setCols(Math.floor(width / GRID_SIZE))
    }, [])

    const handleLayoutChanged = (data) => {
        setItems(data)
    }

    return (
        <div
            ref={containerRef}
            className="w-full h-full min-h-screen bg-white background"
        >
            <ReactGridLayout
                className="layout"
                cols={cols}
                rowHeight={GRID_SIZE}
                width={containerWidth}
                layout={items}
                compactType={null}
                margin={[0, 0]}
                draggableHandle=".drag-handle"
                onLayoutChange={handleLayoutChanged}
            >
                {items.map(({ i }) => (
                    <div key={i} className="">
                        <Block>
                            <span className="text">{i}</span>
                        </Block>
                    </div>
                ))}
            </ReactGridLayout>
        </div>
    )
}
