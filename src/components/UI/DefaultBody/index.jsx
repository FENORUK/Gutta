import React from "react"
import { DocumentItem } from "../DocumentItem"

export const DefaultBody = (props) => {
    const { documents } = props
    return (
        documents && (
            <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
                {documents.map((document) => (
                    <DocumentItem key={document.id} document={document} />
                ))}
            </div>
        )
    )
}
