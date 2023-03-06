import { DndContext, useDroppable } from "@dnd-kit/core"
import React, { useState } from "react"
import {
    MAX_HEIGHT,
    MAX_WIDTH,
    MIN_HEIGHT,
    MIN_WIDTH,
} from "../../../utils/constants"
import { Block } from "../Block"
import { calculateCoordinate, getElements } from "./utils"

export function Board() {
    const [items, setItems] = useState(getElements())

    const { setNodeRef } = useDroppable({
        id: "Board",
    })

    function handleDragEnd(event) {
        const { active, delta } = event
        const { x, y } = items[active.id].position
        const { width, height } = items[active.id].size
        const newX = calculateCoordinate({
            position: x,
            delta: delta.x,
            itemSize: width,
            min: MIN_WIDTH,
            max: MAX_WIDTH,
        })
        const newY = calculateCoordinate({
            position: y,
            delta: delta.y,
            itemSize: height,
            min: MIN_HEIGHT,
            max: MAX_HEIGHT,
        })
        setItems({
            ...items,
            [active.id]: {
                ...items[active.id],
                position: {
                    x: newX,
                    y: newY,
                },
            },
        })
    }

    function handleResize(id, size) {
        setItems({
            ...items,
            [id]: {
                ...items[id],
                size: {
                    width: size.width,
                    height: size.height,
                },
            },
        })
    }

    return (
        <div className="h-screen w-full relative">
            <div
                className="absolute top-0 left-0 w-full h-full"
                style={{
                    backgroundSize: "var(--grid-size) var(--grid-size)",
                    backgroundImage: `repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent calc(var(--grid-size) - 1px),
                        #ddd calc(var(--grid-size) - 1px),
                        #ddd var(--grid-size)
                      ),
                      repeating-linear-gradient(
                        -90deg,
                        transparent,
                        transparent calc(var(--grid-size) - 1px),
                        #ddd calc(var(--grid-size) - 1px),
                        #ddd var(--grid-size)
                      )`,
                }}
            ></div>
            <div className="relative w-full h-full">
                <DndContext onDragEnd={handleDragEnd}>
                    <div ref={setNodeRef} className="h-full">
                        {Object.entries(items).map(
                            ([id, { position, size }]) => (
                                <Block
                                    id={id}
                                    key={id}
                                    position={position}
                                    size={size}
                                    onResize={handleResize}
                                ></Block>
                            )
                        )}
                    </div>
                </DndContext>
            </div>
        </div>
    )
}
