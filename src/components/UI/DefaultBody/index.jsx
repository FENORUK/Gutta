import React from "react"
import { DocumentItem } from "../DocumentItem"

export const DefaultBody = ({ documents, isFullPermissionWorkspace }) => {
    return documents?.length !== 0 ? (
        <div className="grid gap-x-6 gap-y-8 grid-cols-2 lg:grid-cols-4">
            {documents.map((document) => (
                <DocumentItem key={document.id} document={document} />
            ))}
        </div>
    ) : (
        isFullPermissionWorkspace && (
            <div className="flex flex-col w-full h-full items-center">
                <div className="w-[328px] h-[345px] bg-[url('assets/workspace-empty-page.png')] bg-no-repeat bg-contain mt-16"></div>
                <div className="text-xl mt-10 font-bold">
                    Create your first document
                </div>
            </div>
        )
    )
}
