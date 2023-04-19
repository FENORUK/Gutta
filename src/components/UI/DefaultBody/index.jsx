import React from "react"
import { DocumentItem } from "../DocumentItem"
import clsx from "clsx"

export const DefaultBody = ({
    documents,
    isFullPermissionWorkspace,
    isFavouriteWorkspace,
}) => {
    const getEmptyTitle = () => {
        return isFullPermissionWorkspace
            ? "Create your first document"
            : isFavouriteWorkspace
            ? "Add a document to Favorites to see it here"
            : "Documents shared with you will be shown here"
    }

    return documents?.length !== 0 ? (
        <div className="grid gap-x-6 gap-y-8 grid-cols-2 lg:grid-cols-4">
            {documents.map((document) => (
                <DocumentItem key={document.id} document={document} />
            ))}
        </div>
    ) : (
        <div className="flex flex-col w-full h-full items-center">
            <div
                className={clsx(
                    "w-[328px] h-[345px] bg-no-repeat bg-contain mt-16",
                    isFullPermissionWorkspace
                        ? "bg-[url('assets/full-permission-workspace-empty-page.png')]"
                        : "bg-[url('assets/workspace-empty-page.png')]"
                )}
            ></div>
            <div className="text-xl mt-10 font-bold">{getEmptyTitle()}</div>
        </div>
    )
}
