import React, { useState } from "react"
import { DocumentItem } from "../DocumentItem"
import { PopoverMenu } from "../PopoverMenu"
import { usePopover } from "../../../hooks/usePopover"
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid"
import { IconButton } from "../IconButton"
import { StarIcon } from "@heroicons/react/24/outline"
import { ModalBox } from "../ModalBox"
import { useModal } from "../../../hooks/useModal"
import { DeleteModal } from "../ModalBox/DeleteModal"

const MENU_ID = "document-menu"
const RENAME_MODAL_ID = "rename-input"
const DELETE_MODAL_ID = "delete-button"

export const DefaultBody = ({ documents, renameDocument, deleteDocument }) => {
    const { popover, triggerPopover } = usePopover()
    const { modal, triggerModal } = useModal()

    const [selectedDocument, setSelectedDocument] = useState("")
    const [tempDocumentName, setTempDocumentName] = useState("")

    return (
        documents && (
            <>
                <div className="grid gap-x-6 gap-y-8 grid-cols-2 lg:grid-cols-4">
                    {documents.map((document) => (
                        <DocumentItem
                            key={document.id}
                            document={document}
                            onMenuClick={(documentId) => {
                                setSelectedDocument(documentId)
                                triggerPopover({
                                    triggerId: documentId,
                                    targetId: MENU_ID,
                                })
                            }}
                        />
                    ))}
                </div>

                <PopoverMenu id={MENU_ID}>
                    <IconButton
                        className="w-full px-3 py-1.5 mb-1.5 bg-white hover:bg-gray-100 text-sm text-gray-400 hover:text-black rounded-lg"
                        onClick={() => {
                            popover.hide()
                            setTempDocumentName(
                                documents.filter(
                                    (x) => x.id === selectedDocument
                                )[0].name
                            )
                            triggerModal({ targetId: RENAME_MODAL_ID })
                        }}
                    >
                        <PencilIcon className="w-3.5 h-3.5 mr-2.5" />
                        Rename
                    </IconButton>
                    <IconButton
                        className="w-full px-3 py-1.5 mb-1.5 bg-white hover:bg-gray-100 text-sm text-gray-400 hover:text-black rounded-lg pr-8"
                        onClick={() => {
                            popover.hide()
                        }}
                    >
                        <StarIcon className="w-3.5 h-3.5 mr-2.5" />
                        Add to Favorites
                    </IconButton>
                    <IconButton
                        className="w-full px-3 py-1.5 mb-1 bg-red-200 text-sm text-gray-400 hover:text-red-600 rounded-lg"
                        onClick={() => {
                            popover.hide()
                            triggerModal({ targetId: DELETE_MODAL_ID })
                        }}
                    >
                        <TrashIcon className="w-3.5 h-3.5 mr-2.5" />
                        Delete
                    </IconButton>
                </PopoverMenu>

                <DeleteModal
                    modalProps={{ id: DELETE_MODAL_ID }}
                    onCancel={() => {
                        modal.hide()
                    }}
                    onDelete={() => {
                        modal.hide()
                        deleteDocument({ docId: selectedDocument })
                    }}
                />

                <ModalBox id={RENAME_MODAL_ID}>
                    <div className="pb-5 space-y-3 text-center">
                        <div className="font-bold text-xl">Rename document</div>
                        <input
                            autoFocus
                            type="text"
                            placeholder="Document Name"
                            className="w-full border-2 border-gray-100 focus:border-gray-100 text-lg p-1 px-4 placeholder-gray-300 text-gray-400 rounded-md focus:ring-0"
                            value={tempDocumentName}
                            onChange={(event) => {
                                setTempDocumentName(event.target.value)
                            }}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    modal.hide()
                                    renameDocument({
                                        docId: selectedDocument,
                                        newName: tempDocumentName,
                                    })
                                }
                            }}
                        />
                    </div>
                    <div className="flex items-center space-x-3 rounded-b">
                        <button
                            type="button"
                            className="w-full transition text-gray-500 bg-white hover:bg-gray-100 focus:outline-none rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
                            onClick={() => {
                                modal.hide()
                            }}
                        >
                            Close
                        </button>
                        <button
                            className="w-full transition text-white bg-blue-500 hover:bg-blue-700 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            onClick={() => {
                                modal.hide()
                                renameDocument()
                            }}
                        >
                            Rename
                        </button>
                    </div>
                </ModalBox>
            </>
        )
    )
}
