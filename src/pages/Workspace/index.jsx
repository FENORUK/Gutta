import React from "react"
import { generatePath, useNavigate, useParams } from "react-router-dom"
import { useState } from "react"
import { useEffect } from "react"
import { PAGES, PATH } from "../../utils/constants"
import { PencilIcon, PlusSmallIcon, TrashIcon } from "@heroicons/react/24/solid"
import { StarIcon as OutlineStarIcon } from "@heroicons/react/24/outline"
import { StarIcon as SolidStarIcon } from "@heroicons/react/24/solid"
import { IconButton } from "../../components/UI/IconButton"
import { useDocument } from "../../hooks/useDocument"
import { usePopover } from "../../hooks/usePopover"
import { useModal } from "../../hooks/useModal"
import { DefaultLayout } from "../../components/UI/Layout/DefaultLayout"
import { DefaultBody } from "../../components/UI/DefaultBody"
import { createContext } from "react"
import { PopoverMenu } from "../../components/UI/PopoverMenu"
import { DeleteModal } from "../../components/UI/ModalBox/DeleteModal"
import { EditNameModal } from "../../components/UI/ModalBox/EditNameModal"
import { useWorkspace } from "../../hooks/useWorkspace"
import { get } from "lodash"

const DOCUMENT_MENU_ID = "document-menu"
const WORKSPACE_MENU_ID = "workspace-menu"
const RENAME_DOCUMENT_MODAL_ID = "rename-document-input"
const DELETE_DOCUMENT_MODAL_ID = "delete-document-button"
const ADD_WORKSPACE_MODAL_ID = "add-workspace-button"
const RENAME_WORKSPACE_MODAL_ID = "rename-workspace-input"
const DELETE_WORKSPACE_MODAL_ID = "delete-workspace-button"

export const DocumentContext = createContext()

export const Workspace = () => {
    const { workspaceId } = useParams()
    const {
        workspaces,
        fetchWorkspaces,
        createWorkspace,
        renameWorkspace,
        deleteWorkspace,
    } = useWorkspace()

    const { popover, triggerPopover, clearPopover } = usePopover()
    const { modal, triggerModal } = useModal()
    const {
        documents,
        fetchDocuments,
        createDocument,
        updateFavoriteDocument,
        renameDocument,
        clearDocuments,
        deleteDocument,
    } = useDocument()
    const navigate = useNavigate()

    const [currentWorkspace, setCurrentWorkspace] = useState()
    const [selectedDocument, setSelectedDocument] = useState()
    const [selectedWorkspace, setSelectedWorkspace] = useState()

    useEffect(() => {
        const fetchData = async () => {
            clearPopover()
            clearDocuments()
            const newWorkspaces = await fetchWorkspaces()
            let workspace = PAGES[workspaceId]?.name
                ? { id: workspaceId, name: PAGES[workspaceId]?.name }
                : newWorkspaces.find(
                      (workspace) => workspace?.id === workspaceId
                  )

            if (!workspace && newWorkspaces.length !== 0) {
                navigate(PATH.NOT_FOUND)
            }
            setCurrentWorkspace(workspace)
            fetchDocuments(workspace.id)
            document.title = workspace.name
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workspaceId])
    const handleCreate = async () => {
        const response = await createDocument(currentWorkspace.id)
        if (!response) return
        const {
            results: { id },
        } = response
        navigate(generatePath(PATH.DOCUMENT.DEFAULT, { docId: id }))
    }

    const onDocumentMenuClicked = (docId) => {
        setSelectedDocument(documents.find((doc) => doc.id === docId))
        triggerPopover({
            triggerId: docId,
            targetId: DOCUMENT_MENU_ID,
        })
    }

    const onWorkspaceMenuClicked = (workspaceId) => {
        setSelectedWorkspace(
            workspaces.find((workspace) => workspace.id === workspaceId)
        )
        triggerPopover({
            triggerId: workspaceId,
            targetId: WORKSPACE_MENU_ID,
        })
    }

    const onWorkspaceAddButtonClicked = () => {
        triggerModal({ targetId: ADD_WORKSPACE_MODAL_ID })
    }

    const onCreateWorkspace = async (workspaceName) => {
        const workspaceId = await createWorkspace(workspaceName)
        if (!workspaceId) return
        navigate(
            generatePath(PATH.WORKSPACE.DEFAULT, {
                workspaceId: workspaceId,
            })
        )
    }

    const onRenameworkspace = async (workspaceId, newName) => {
        const newWorkspace = await renameWorkspace({
            workspaceId: workspaceId,
            newName: newName,
        })
        if (!newWorkspace?.id || workspaceId !== currentWorkspace.id) return
        setCurrentWorkspace({ ...currentWorkspace, ...newWorkspace })
        document.title = newWorkspace.name
    }

    const handleUpdateFavoriteDocument = async (isFavorite) => {
        const newSelectedDocument = await updateFavoriteDocument({
            isFavouriteWorkspace: isFavouriteWorkspace,
            docId: selectedDocument?.id,
            isFavorite: isFavorite,
        })
        setSelectedDocument(newSelectedDocument)
    }

    const isDefaultWorkspace = get(PAGES, `${currentWorkspace?.id}`)

    const isFullPermissionWorkspace =
        (isDefaultWorkspace &&
            currentWorkspace?.name === PAGES.personal.name) ||
        workspaces?.find((workspace) => workspace.id === workspaceId)

    const isFavouriteWorkspace =
        isDefaultWorkspace && currentWorkspace?.name === PAGES.favorite.name

    if (!currentWorkspace) return <></>

    return (
        <>
            <DefaultLayout
                workspaces={workspaces}
                onWorkspaceMenuClicked={onWorkspaceMenuClicked}
                onWorkspaceAddButtonClicked={onWorkspaceAddButtonClicked}
            >
                <div className="pt-3 pb-1.5 text-2xl sticky top-[58px] bg-white flex justify-between">
                    {currentWorkspace.name}
                    {isFullPermissionWorkspace && (
                        <IconButton
                            className="text-white bg-blue-600 hover:bg-blue-700 px-3"
                            onClick={handleCreate}
                        >
                            <PlusSmallIcon className="w-5 h-5 mr-1.5" />
                            New Document
                        </IconButton>
                    )}
                </div>
                <div className="w-full h-full py-6">
                    <DocumentContext.Provider value={{ onDocumentMenuClicked }}>
                        {documents && (
                            <DefaultBody
                                documents={documents}
                                isFullPermissionWorkspace={
                                    isFullPermissionWorkspace
                                }
                                isFavouriteWorkspace={isFavouriteWorkspace}
                            />
                        )}
                    </DocumentContext.Provider>
                </div>
            </DefaultLayout>

            <PopoverMenu id={DOCUMENT_MENU_ID}>
                {isFullPermissionWorkspace && (
                    <IconButton
                        className="w-full px-3 py-1.5 bg-white hover:bg-gray-100 text-sm text-slate-500 hover:text-black rounded-lg"
                        onClick={() => {
                            popover.hide()
                            triggerModal({
                                targetId: RENAME_DOCUMENT_MODAL_ID,
                            })
                        }}
                    >
                        <PencilIcon className="w-3.5 h-3.5 mr-2.5" />
                        Rename
                    </IconButton>
                )}
                <IconButton
                    className="w-full px-3 py-1.5 bg-white hover:bg-gray-100 text-sm text-slate-500 hover:text-black rounded-lg pr-8"
                    onClick={() => {
                        popover.hide()
                        handleUpdateFavoriteDocument(
                            !isFavouriteWorkspace &&
                                !selectedDocument?.favourite
                        )
                    }}
                >
                    {selectedDocument?.favourite || isFavouriteWorkspace ? (
                        <>
                            <SolidStarIcon className="w-4 h-4 mr-2 text-rose-500" />
                            Remove from favorites
                        </>
                    ) : (
                        <>
                            <OutlineStarIcon className="w-3.5 h-3.5 mr-2.5 text-slate-600" />
                            Add to favorites
                        </>
                    )}
                </IconButton>
                {isFullPermissionWorkspace && (
                    <IconButton
                        className="transition w-full px-3 py-1.5 bg-red-200 text-sm text-slate-500 hover:text-red-600 rounded-lg"
                        onClick={() => {
                            popover.hide()
                            triggerModal({
                                targetId: DELETE_DOCUMENT_MODAL_ID,
                            })
                        }}
                    >
                        <TrashIcon className="w-3.5 h-3.5 mr-2.5" />
                        Delete
                    </IconButton>
                )}
            </PopoverMenu>

            <PopoverMenu id={WORKSPACE_MENU_ID} className="w-48">
                <IconButton
                    className="transition w-full px-3 py-1.5 bg-white hover:bg-gray-100 text-sm text-slate-500 hover:text-black rounded-lg pr-8"
                    onClick={() => {
                        popover.hide()
                        triggerModal({ targetId: RENAME_WORKSPACE_MODAL_ID })
                    }}
                >
                    <PencilIcon className="w-3.5 h-3.5 mr-2.5" />
                    Rename
                </IconButton>
                <IconButton
                    className="transition w-full px-3 py-1.5 bg-rose-100 text-sm text-slate-500 hover:text-red-600 rounded-lg"
                    onClick={() => {
                        popover.hide()
                        triggerModal({ targetId: DELETE_WORKSPACE_MODAL_ID })
                    }}
                >
                    <TrashIcon className="w-3.5 h-3.5 mr-2.5" />
                    Delete
                </IconButton>
            </PopoverMenu>

            <DeleteModal
                modalProps={{ id: DELETE_WORKSPACE_MODAL_ID }}
                onCancel={() => {
                    modal.hide()
                }}
                onDelete={() => {
                    modal.hide()
                    if (selectedWorkspace.id === currentWorkspace.id) {
                        navigate(PATH.WORKSPACE.PERSONAL)
                    }
                    deleteWorkspace(selectedWorkspace.id)
                }}
            />

            <DeleteModal
                modalProps={{ id: DELETE_DOCUMENT_MODAL_ID }}
                onCancel={() => {
                    modal.hide()
                }}
                onDelete={() => {
                    modal.hide()
                    deleteDocument({ docId: selectedDocument.id })
                }}
            />

            <EditNameModal
                id={ADD_WORKSPACE_MODAL_ID}
                title="Create Workspace"
                placeholder="Workspace Name"
                initialName=""
                titleSubmitButton="Create"
                onCancel={() => {
                    modal.hide()
                }}
                onSubmit={(name) => {
                    modal.hide()
                    onCreateWorkspace(name)
                }}
            />

            <EditNameModal
                id={RENAME_WORKSPACE_MODAL_ID}
                title="Rename Workspace"
                placeholder="Workspace Name"
                initialName={selectedWorkspace?.name}
                titleSubmitButton="Rename"
                onCancel={() => {
                    modal.hide()
                }}
                onSubmit={(newName) => {
                    modal.hide()
                    onRenameworkspace(selectedWorkspace.id, newName)
                }}
            />

            <EditNameModal
                id={RENAME_DOCUMENT_MODAL_ID}
                title="Rename document"
                placeholder="Document Name"
                initialName={selectedDocument?.name}
                titleSubmitButton="Rename"
                onCancel={() => {
                    modal.hide()
                }}
                onSubmit={(newName) => {
                    modal.hide()
                    renameDocument({
                        docId: selectedDocument.id,
                        newName: newName,
                    })
                }}
            />
        </>
    )
}
