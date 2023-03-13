import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"
import React from "react"

export function Block(props) {
    return (
        <div className="w-full h-full bg-white shadow-lg rounded-lg border">
            <div className="drag-handle w-full hover:bg-gray-100 transition transform h-6 rounded-tr-lg rounded-tl-lg hover:cursor-grab active:cursor-grabbing"></div>
            {props.children}
        </div>
    )
}
