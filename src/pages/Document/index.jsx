import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Board } from "../../components/UI/Board"
import { DefaultHeader } from "../../components/UI/Header/DefaultLayout"
import { IconButton } from "../../components/UI/IconButton"
import { SideBar } from "../../components/UI/SideBar"
import { useDrawer } from "../../hooks/useDrawer"
import DocumentService from "../../services/DocumentService"
import { toast } from "react-toastify"
import { TOAST_CONFIG } from "../../utils/constants"
import { CustomToastContainer } from "../../components/UI/CustomToastContainer"
import "react-toastify/dist/ReactToastify.css"
import { ReactComponent as LockIcon } from "../../assets/lock.svg"
import {
    ArrowUpTrayIcon,
    ArrowUturnLeftIcon,
    ArrowUturnRightIcon,
    Bars3Icon,
    PlusIcon,
    UserCircleIcon,
} from "@heroicons/react/24/solid"
import {
    ChatBubbleOvalLeftEllipsisIcon,
    StarIcon,
} from "@heroicons/react/24/outline"

const DRAWER_ID = "drawer-navigation"

export function Document() {
    document.title = "Document"
    const { docId } = useParams()
    const navigate = useNavigate()
    const [doc, setDoc] = useState(undefined)
    const { drawer } = useDrawer({ id: DRAWER_ID, shouldUpdate: doc })
    const [showNameInput, setShowNameInput] = useState(false)
    const [tempDoc, setTempDoc] = useState({})

    useEffect(() => {
        const fetchDocuments = async () => {
            const res = await DocumentService.getDocumentByID(docId)
            if (!res) return
            const {
                data: { results },
            } = res
            if (!results || !results.length) {
                navigate("/not-found")
                return
            }
            const [currentDocument] = results
            setDoc(currentDocument)
            setTempDoc(currentDocument)
        }
        fetchDocuments()
    }, [docId])

    const handleKeyDown = async (event) => {
        if (event.key === "Enter") {
            try {
                const response = await DocumentService.updateDocument(docId, {
                    name: tempDoc.name || "Untitled",
                })
                toast.success("Changed name successfully!", TOAST_CONFIG)
                const updatedDoc = response.data.results
                setDoc(updatedDoc)
                setTempDoc(updatedDoc)
            } catch (error) {
                toast.error(error.message, TOAST_CONFIG)
                setTempDoc(doc)
            }
            setShowNameInput(!showNameInput)
        }
    }

    const handleInputChange = (value) => {
        setTempDoc({ ...tempDoc, name: value })
    }

    if (!doc) return <div>Loading...</div>

    return (
        <div className="relative bg-gray-100 flex justify-center">
            <div className="bg-white w-[1298px]  rounded-t-3xl border border-solid border-gray-200">
                <div className="w-full px-12">
                    <div className="flex justify-between items-center border-b border-gray-200">
                        <div className="flex">
                            <IconButton
                                onClick={() => drawer.show()}
                                className="px-2 mr-3"
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
                                        <IconButton
                                            className="rounded-none bg-white text-gray-400 hover:text-gray-400 w-8 m-0"
                                            status="disabled"
                                        >
                                            <ArrowUturnLeftIcon className="w-4 h-4" />
                                        </IconButton>

                                        <IconButton
                                            className="rounded-none bg-white text-gray-400 hover:text-gray-400 w-8 m-0 mr-8"
                                            status="disabled"
                                        >
                                            <ArrowUturnRightIcon className="w-4 h-4" />
                                        </IconButton>

                                        <IconButton
                                            className="bg-white hover:bg-gray-100 w-7 h-7 m-0 rounded-lg m-0.5"
                                            title="Comments"
                                        >
                                            <ChatBubbleOvalLeftEllipsisIcon className="w-4 h-4" />
                                        </IconButton>

                                        <IconButton
                                            className="bg-white hover:bg-gray-100 w-7 h-7 m-0 rounded-lg m-0.5"
                                            title="Add to Favourites"
                                        >
                                            <StarIcon className="w-4 h-4" />
                                        </IconButton>

                                        <div className="absolute text-gray-400 text-2xl">
                                            |
                                        </div>
                                    </div>
                                    {showNameInput && (
                                        <input
                                            autoFocus
                                            type="text"
                                            className="absolute border-none text-2xl p-0 focus:ring-0 focus:shadow-md"
                                            placeholder="Untitled"
                                            value={tempDoc.name}
                                            onChange={(event) => {
                                                handleInputChange(
                                                    event.target.value
                                                )
                                            }}
                                            onBlur={() => {
                                                setShowNameInput(!showNameInput)
                                            }}
                                            onKeyDown={handleKeyDown}
                                        />
                                    )}
                                </div>
                                <div className="flex">
                                    <IconButton
                                        className="text-sm px-3 text-black bg-red-100 hover:bg-red-300"
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
                        <div className="mt-4 h-full flex flex-row">
                            <div className="h-8 w-min border border-b-0 px-2">
                                Page_layouts
                            </div>
                            <div className="w-8 border-b flex items-center justify-center ml-2 text-gray-400 hover:text-black">
                                <IconButton
                                    className="p-0 h-6 w-6 items-center justify-center"
                                    title="Add a page"
                                >
                                    <PlusIcon className="w-4 h-4" />
                                </IconButton>
                            </div>
                            <div className="w-full border-b"></div>
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
                className="fixed top-0 left-0 z-40 h-screen p-4 overflow-y-auto transition-transform -translate-x-full bg-white w-72"
                tabIndex="-1"
                aria-labelledby="drawer-navigation-label"
            >
                <SideBar
                    className="bg-white"
                    hideBackGround={() => drawer.hide()}
                />
            </div>
            <CustomToastContainer />
        </div>
    )
}
