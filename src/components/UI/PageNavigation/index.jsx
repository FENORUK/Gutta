import React, { useEffect, useState } from "react"
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid"
import { usePopover } from "../../../hooks/usePopover"
import { IconButton } from "../IconButton"
import { PageTab } from "../PageTab"
import { PopoverMenu } from "../PopoverMenu"
import { useModal } from "../../../hooks/useModal"
import "./index.css"
import { DeleteModal } from "../ModalBox/DeleteModal"
import { ScrollContainer } from "./ScrollContainer"
import { usePage } from "../../../hooks/usePage"

const POPOVER_ADD_ID = "popover-add"
const POPOVER_PAGE_ID = "popover-page"
const BUTTON_ADD_ID = "button-popover"
const DELETE_MODAL_ID = "button-delete"

export const PageNavigation = ({
    docId,
    channel,
    socketId,
    listPages,
    activePageId,
    isOnlyViewPages,
    setActivePageId,
}) => {
    const [showRenameInput, setShowRenameInput] = useState(false)

    const { pages, createPage, renamePage, deletePage } = usePage(
        listPages,
        socketId,
        channel
    )

    useEffect(() => {
        channel.bind("page", function (data) {
            if (socketId !== data.message.data.socketId) {
                const newPage = data.message.data
                if (activePageId === newPage.pageId)
                    setActivePageId(newPage.listPages[0]?.id)
            }
        })
    },[])

    const [selectedPageId, setSelectedPageId] = useState("")
    const [tempPageName, setTempPageName] = useState("")

    const { popover, triggerPopover } = usePopover()
    const { modal, triggerModal } = useModal()

    const handleAddPageButtonKeyDown = async (event) => {
        if (event.key === "Enter") {
            popover.hide()
            if (tempPageName === "") return
            const newPageId = await createPage({
                docId: docId,
                pageName: tempPageName,
            })
            setTempPageName("")
            setActivePageId(newPageId)
        }
    }

    const handleRenamePageInputKeyDown = async (event) => {
        if (event.key === "Enter") {
            popover.hide()
            renamePage({
                docId: docId,
                selectedPageId: selectedPageId,
                newName: tempPageName,
            })
            setTempPageName("")
        }
    }

    const handleDeletePage = async (pageId) => {
        const newListPage = await deletePage({ docId, pageId })
        if (activePageId === pageId) setActivePageId(newListPage[0]?.id)
    }

    return (
        <div className="w-max max-w-[1080px] relative">
            <ScrollContainer
                addButtonProps={{
                    id: BUTTON_ADD_ID,
                    title: "Add a page",
                    onClick: () => {
                        if (isOnlyViewPages) return
                        setTempPageName("")
                        triggerPopover({
                            targetId: POPOVER_ADD_ID,
                            triggerId: BUTTON_ADD_ID,
                        })
                    },
                }}
                activePageId={activePageId}
                itemsCount={pages.length}
            >
                {pages &&
                    pages.map(({ id, name }) => (
                        <PageTab
                            key={id}
                            id={id}
                            name={name}
                            isActive={id === activePageId}
                            onClick={setActivePageId}
                            onMenuClick={(pageId) => {
                                if (isOnlyViewPages) return
                                setShowRenameInput(false)
                                setSelectedPageId(pageId)
                                triggerPopover({
                                    targetId: POPOVER_PAGE_ID,
                                    triggerId: pageId,
                                })
                            }}
                        />
                    ))}
            </ScrollContainer>

            <PopoverMenu id={POPOVER_PAGE_ID} className="w-48">
                {!showRenameInput && (
                    <>
                        <IconButton
                            className="transition w-full px-3 py-1.5 bg-white hover:bg-gray-100 text-sm text-gray-400 hover:text-black rounded-lg"
                            onClick={() => {
                                setShowRenameInput(true)
                                setTempPageName(
                                    pages.find(
                                        (page) => page.id === selectedPageId
                                    )?.name
                                )
                            }}
                        >
                            <PencilIcon className="w-3.5 h-3.5 mr-2.5" />
                            Rename
                        </IconButton>
                        {pages.length > 1 && (
                            <IconButton
                                className="transition w-full px-3 py-1.5 bg-red-200 text-sm text-gray-400 hover:text-red-600 rounded-lg"
                                onClick={() => {
                                    popover.hide()
                                    triggerModal({ targetId: DELETE_MODAL_ID })
                                }}
                            >
                                <TrashIcon className="w-3.5 h-3.5 mr-2" />
                                Delete
                            </IconButton>
                        )}
                    </>
                )}
                {showRenameInput && (
                    <input
                        autoFocus
                        type="text"
                        className="w-full border-none text-sm py-1 px-2 placeholder-gray-300 text-gray-400 rounded-md focus:ring-0"
                        onKeyDown={handleRenamePageInputKeyDown}
                        value={tempPageName}
                        onChange={(event) => {
                            setTempPageName(event.target.value)
                        }}
                    />
                )}
            </PopoverMenu>

            <PopoverMenu id={POPOVER_ADD_ID}>
                <input
                    type="text"
                    className="border-2 border-gray-100 focus:border-gray-100 text-sm p-1 px-4 placeholder-gray-300 text-gray-400 rounded-md focus:ring-0"
                    placeholder="Create a new page"
                    onKeyDown={handleAddPageButtonKeyDown}
                    value={tempPageName}
                    onChange={(event) => {
                        setTempPageName(event.target.value)
                    }}
                />
            </PopoverMenu>

            <DeleteModal
                modalProps={{ id: DELETE_MODAL_ID }}
                onCancel={() => {
                    modal.hide()
                }}
                onDelete={() => {
                    modal.hide()
                    handleDeletePage(selectedPageId)
                }}
            />
        </div>
    )
}
