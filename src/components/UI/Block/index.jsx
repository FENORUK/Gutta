import { useDraggable } from "@dnd-kit/core"
import { Resizable } from "re-resizable"
import React, { useState } from "react"
import { GRID_SIZE, MAX_HEIGHT, MAX_WIDTH } from "../../../utils/constants"

const calculateSize = ({ size, position, delta, max }) => {
    let newSize = Math.round(delta / GRID_SIZE) * GRID_SIZE + size
    if (newSize + position > max) {
        return max - position
    }
    return newSize
}

export function Block(props) {
    const { id, position, size, onResize } = props
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: id,
    })
    const [currentSize, setCurrentSize] = useState(size)

    const style = transform
        ? {
              transform: `translate3d(${transform.x + position.x}px, ${
                  transform.y + position.y
              }px, 0)`,
          }
        : {
              transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          }
    return (
        <div
            style={style}
            className="absolute border border-2 bg-white rounded-xl border-gray-400"
        >
            <Resizable
                id={id}
                minWidth="90px"
                minHeight="60px"
                size={currentSize}
                onResizeStop={(e, direction, ref, d) => {
                    let newWidth = calculateSize({
                        size: currentSize.width,
                        position: position.x,
                        delta: d.width,
                        max: MAX_WIDTH,
                    })
                    let newHeight = calculateSize({
                        size: currentSize.height,
                        position: position.y,
                        delta: d.height,
                        max: MAX_HEIGHT,
                    })
                    setCurrentSize({ width: newWidth, height: newHeight })
                    onResize(id, currentSize)
                }}
            >
                <div
                    className="w-full bg-black h-6 rounded-t-xl"
                    ref={setNodeRef}
                    {...listeners}
                    {...attributes}
                ></div>
            </Resizable>
        </div>
    )
}
