import React, { useState } from "react"
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid"
import _ from "lodash"
import { usePopover } from "../../../hooks/usePopover"
import PageService from "../../../services/pageService"
import { MAXIMUM_PAGES_NUMBER, MESSAGE } from "../../../utils/constants"
import customToast from "../../../utils/toast"
import { IconButton } from "../IconButton"
import { loader } from "../Loader"
import { PageTab } from "../PageTab"
import { PopoverMenu } from "../PopoverMenu"
import { useModal } from "../../../hooks/useModal"
import "./index.css"
import { DeleteModal } from "../ModalBox/DeleteModal"
import { ScrollContainer } from "./ScrollContainer"

const POPOVER_ADD_ID = "popover-add"
const POPOVER_PAGE_ID = "popover-page"
const BUTTON_ADD_ID = "button-popover"
const DELETE_MODAL_ID = "button-delete"

export const PageNavigation = (props) => {
    const { docId, listPages } = props

    const [showRenameInput, setShowRenameInput] = useState(false)
    const [pages, setPages] = useState([...listPages])
    const [activePage, setActivePage] = useState(listPages[0]?.id)
    const [selectedPage, setSelectedPage] = useState("")
    const [tempPageName, setTempPageName] = useState("")

    const { popover, triggerPopover } = usePopover()
    const { modal, triggerModal } = useModal()

    const handleAddPageButtonKeyDown = async (event) => {
        if (event.key === "Enter") {
            popover.hide()
            if (tempPageName === "") return
            if (pages.length === MAXIMUM_PAGES_NUMBER) {
                setTempPageName("")
                customToast.error(MESSAGE.PAGES_NUMBER_REACH_MAXIMUM)
                return
            }
            loader.emit("start")
            const response = await PageService.createNewPage(
                docId,
                tempPageName
            )
            loader.emit("stop")

            if (response.error) {
                const {
                    error: { message },
                } = response
                customToast.error(message)
                setTempPageName("")
                return
            }
            setPages([...pages, response.results])
            setActivePage(
                _.get(response, "results.id", pages[pages.length - 1].id)
            )
            setTempPageName("")
        }
    }

    const handleRenamePageInputKeyDown = async (event) => {
        if (event.key === "Enter") {
            popover.hide()
            const page = pages.find((x) => x.id === selectedPage)
            if (tempPageName === "" || tempPageName === page.id) {
                setTempPageName("")
                return
            }
            loader.emit("start")
            const response = await PageService.updatePage({
                documentId: docId,
                pageId: selectedPage,
                name: tempPageName,
            })
            loader.emit("stop")

            if (response.error) {
                const {
                    error: { message },
                } = response
                customToast.error(message)
                setTempPageName("")
                return
            }
            setPages(
                pages.map((item) => {
                    return item.id === selectedPage ? response.results : item
                })
            )
            setTempPageName("")
        }
    }

    const deletePage = async (pageId) => {
        loader.emit("start")
        const response = await PageService.deletePage(pageId)
        loader.emit("stop")

        if (response.error) {
            const {
                error: { message },
            } = response
            customToast.error(message)
            return
        }
        const newListPage = pages.filter((x) => x.id !== pageId)
        setPages(newListPage)
        if (activePage === pageId) setActivePage(newListPage[0].id)
        customToast.success(_.get(response, "results.message"))
    }

    return (
        <div className="w-max max-w-[1080px] relative">
            <ScrollContainer
                addButtonProps={{
                    id: BUTTON_ADD_ID,
                    title: "Add a page",
                    onClick: () => {
                        setTempPageName("")
                        triggerPopover({
                            targetId: POPOVER_ADD_ID,
                            triggerId: BUTTON_ADD_ID,
                        })
                    },
                }}
                activePage={activePage}
                itemsCount={pages.length}
            >
                {pages &&
                    pages.map(({ id, name }) => (
                        <PageTab
                            key={id}
                            id={id}
                            name={name}
                            isActive={id === activePage}
                            onClick={setActivePage}
                            onMenuClick={(pageId) => {
                                setShowRenameInput(false)
                                setSelectedPage(pageId)
                                triggerPopover({
                                    targetId: POPOVER_PAGE_ID,
                                    triggerId: pageId,
                                })
                            }}
                        />
                    ))}
            </ScrollContainer>

            <PopoverMenu id={POPOVER_PAGE_ID} className="w-44 p-2">
                {!showRenameInput && (
                    <>
                        <IconButton
                            className="w-full px-3 py-1.5 bg-white hover:bg-gray-100 text-sm text-gray-400 hover:text-black rounded-lg"
                            onClick={() => {
                                setShowRenameInput(true)
                                setTempPageName(
                                    pages.find((x) => x.id === selectedPage)
                                        .name
                                )
                            }}
                        >
                            <PencilIcon className="w-3.5 h-3.5 mr-2.5" />
                            Rename
                        </IconButton>
                        {pages.length > 1 && (
                            <IconButton
                                className="w-full px-3 py-1.5 mt-1.5 mb-1 bg-red-200 text-sm text-gray-400 hover:text-red-600 rounded-lg"
                                onClick={() => {
                                    popover.hide()
                                    triggerModal({ targetId: DELETE_MODAL_ID })
                                }}
                            >
                                <TrashIcon className="w-3.5 h-3.5 mr-2.5" />
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
                    deletePage(selectedPage)
                }}
            />
        </div>
    )
}
