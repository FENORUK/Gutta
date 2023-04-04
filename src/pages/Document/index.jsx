import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Board } from "../../components/UI/Board"
import { DefaultHeader } from "../../components/UI/Header/DefaultLayout"
import { IconButton } from "../../components/UI/IconButton"
import { SideBar } from "../../components/UI/SideBar"
import { useDrawer } from "../../hooks/useDrawer"
import DocumentService from "../../services/documentService"
import { DEFAULT_TITLE, PAGE_TITLES } from "../../utils/constants"
import "react-toastify/dist/ReactToastify.css"
import { ReactComponent as LockIcon } from "../../assets/lock.svg"
import {
    ArrowUpTrayIcon,
    Bars3Icon,
    UserCircleIcon,
} from "@heroicons/react/24/solid"
import {
    ChatBubbleOvalLeftEllipsisIcon,
    StarIcon as OutlineStarIcon,
} from "@heroicons/react/24/outline"
import { StarIcon as SolidStarIcon } from "@heroicons/react/24/solid"

import customToast from "../../utils/toast"
import { loader } from "../../components/UI/Loader"
import "./index.css"
import { PageNavigation } from "../../components/UI/PageNavigation"

const DRAWER_ID = "drawer-navigation"

export function Document() {
    document.title = PAGE_TITLES.DOCUMENT
    const { docId } = useParams()

    const [doc, setDoc] = useState(undefined)
    const [tempDoc, setTempDoc] = useState({})
    const [showNameInput, setShowNameInput] = useState(false)
    const [favorites, setFavorites] = useState(false)

    const { drawer } = useDrawer({ id: DRAWER_ID, shouldUpdate: doc })
    const navigate = useNavigate()

    useEffect(() => {
        const fetchDocuments = async () => {
            loader.emit("start")
            const response = await DocumentService.getDocumentByID(docId)
            loader.emit("stop")

            if (response.error) {
                navigate("/not-found")
                return
            }
            const {
                results: { 0: document, is_favourite },
            } = response
            setFavorites(is_favourite)
            setDoc(document)
            setTempDoc(document)
        }
        fetchDocuments()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [docId])

    const handleDocumentNameInputKeyDown = async (event) => {
        if (event.key === "Enter") {
            if (tempDoc.name === "") {
                setTempDoc(doc)
                setShowNameInput(!showNameInput)
                return
            }
            loader.emit("start")
            const response = await DocumentService.updateDocument(docId, {
                name: tempDoc.name,
            })
            loader.emit("stop")

            if (response.error) {
                const {
                    error: { message },
                } = response
                customToast.error(message)
                setTempDoc(doc)
                return
            }

            customToast.success("Changed name successfully!")
            const updatedDoc = { ...doc, ...response.results }
            setDoc(updatedDoc)
            setTempDoc(updatedDoc)
            setShowNameInput(!showNameInput)
        }
    }

    if (!doc) return <></>

    return (
        <div className="relative bg-gray-50 flex justify-center">
            <div className="bg-white w-[1298px]  rounded-t-3xl border border-solid border-gray-100">
                <div className="w-full px-12">
                    <div className="flex justify-between items-center border-b border-gray-100">
                        <div className="flex">
                            <IconButton
                                onClick={() => drawer.show()}
                                className="px-2 mr-3 justify-center"
                            >
                                <Bars3Icon className="w-4 h-4" />
                            </IconButton>
                            <IconButton
                                className="rounded-xl py-1 pl-1 px-2 text-black bg-white hover:bg-gray-100"
                                onClick={() => {
                                    navigate("/")
                                }}
                            >
                                <div className="bg-red-100 w-6 h-6 flex items-center justify-center rounded-lg mr-2">
                                    <UserCircleIcon className="w-4 h-4" />
                                </div>
                                Personal
                            </IconButton>
                            <div className="flex items-center text-sm">
                                <div className="mx-1.5 text-gray-400">/</div>
                                <div className="px-1.5 py-1 text-gray-400">
                                    {doc.name}
                                </div>
                            </div>
                        </div>
                        <DefaultHeader />
                    </div>
                    <div>
                        <div className="h-12 flex flex-col justify-end">
                            <div className="mb-1 flex flex-row justify-between">
                                <div className="flex relative">
                                    {!showNameInput && (
                                        <div
                                            className="text-2xl"
                                            onClick={() => {
                                                setShowNameInput(!showNameInput)
                                            }}
                                        >
                                            {tempDoc.name}
                                        </div>
                                    )}
                                    <div className="relative flex pl-4 justify-center items-center">
                                        <div className="w-7 h-7 text-gray-400 text-2xl text-center">
                                            |
                                        </div>

                                        <IconButton
                                            className="bg-white hover:bg-gray-100 w-7 h-7 rounded-lg m-0.5 justify-center"
                                            title="Comments"
                                        >
                                            <ChatBubbleOvalLeftEllipsisIcon className="w-4 h-4" />
                                        </IconButton>

                                        <IconButton
                                            className="bg-white hover:bg-gray-100 w-7 h-7 rounded-lg m-0.5 justify-center"
                                            title="Add to Favorites"
                                        >
                                            {favorites ? (
                                                <SolidStarIcon className="w-4 h-4" />
                                            ) : (
                                                <OutlineStarIcon className="w-4 h-4" />
                                            )}
                                        </IconButton>
                                    </div>
                                    {showNameInput && (
                                        <input
                                            autoFocus
                                            type="text"
                                            className="absolute border-none text-2xl p-0 focus:ring-0 focus:shadow-md"
                                            placeholder={DEFAULT_TITLE}
                                            value={tempDoc.name}
                                            onChange={(event) => {
                                                setTempDoc({
                                                    ...tempDoc,
                                                    name: event.target.value,
                                                })
                                            }}
                                            onBlur={() => {
                                                setShowNameInput(!showNameInput)
                                                setTempDoc(doc)
                                            }}
                                            onKeyDown={
                                                handleDocumentNameInputKeyDown
                                            }
                                        />
                                    )}
                                </div>
                                <div className="flex">
                                    <IconButton
                                        className="text-sm px-3 text-black bg-red-100 hover:bg-red-300 justify-center"
                                        title="Private to only me"
                                    >
                                        <LockIcon className="w-4 h-4 mr-2.5" />
                                        Share
                                    </IconButton>

                                    <IconButton
                                        className="ml-2 px-2 h-8 text-gray-400 hover:text-black"
                                        title="Export menu"
                                    >
                                        <ArrowUpTrayIcon className="w-4 h-4" />
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 h-full page-container">
                            <PageNavigation
                                docId={docId}
                                listPages={doc.pages}
                            />
                        </div>
                    </div>
                </div>
                <div className=" mx-12 mt-4">
                    <div className="w-full">
                        <Board />
                    </div>
                </div>
            </div>
            <div
                id={DRAWER_ID}
                className="fixed top-0 left-0 z-40 h-screen overflow-y-auto transition-transform -translate-x-full bg-white w-72"
                tabIndex="-1"
                aria-labelledby="drawer-navigation-label"
            >
                <SideBar
                    className="bg-white"
                    hideBackGround={() => drawer.hide()}
                />
            </div>
        </div>
    )
}
