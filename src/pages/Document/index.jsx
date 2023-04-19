import React, { useEffect, useState } from "react"
import { generatePath, useNavigate, useParams } from "react-router-dom"
import { Board } from "../../components/UI/Board"
import { DefaultHeader } from "../../components/UI/Header/DefaultHeader"
import { IconButton } from "../../components/UI/IconButton"
import { SideBar } from "../../components/UI/SideBar"
import { useDrawer } from "../../hooks/useDrawer"
import DocumentService from "../../services/documentService"
import {
    DEFAULT_TITLE,
    MESSAGE,
    PAGE_TITLES,
    PATH,
    USER_ROLE,
} from "../../utils/constants"
import RealtimeService from "../../services/realtimeService"
import "react-toastify/dist/ReactToastify.css"
import { ReactComponent as LockIcon } from "../../assets/lock.svg"
import {
    Bars3Icon,
    UserCircleIcon,
    UserGroupIcon,
} from "@heroicons/react/24/solid"
import { StarIcon as OutlineStarIcon } from "@heroicons/react/24/outline"
import { StarIcon as SolidStarIcon } from "@heroicons/react/24/solid"

import customToast from "../../utils/toast"
import { loader } from "../../components/UI/Loader"
import "./index.css"
import { PageNavigation } from "../../components/UI/PageNavigation"
import { useWorkspace } from "../../hooks/useWorkspace"
import { usePopover } from "../../hooks/usePopover"
import { PopoverShare } from "./PopoverShare"
import clsx from "clsx"
import { useContext } from "react"
import { AuthContext } from "../../contexts/AuthContext"
import { pusher } from "../../lib"

const DRAWER_ID = "drawer-navigation"
const SHARE_MENU_ID = "menu-id"
const BUTTON_SHARE_ID = "share-button"

const fetchUsersRoleDocument = async (docId) => {
    const response = await DocumentService.getUsersRoleDocument({
        documentId: docId,
    })
    return response?.results
}

export function Document() {
    document.title = PAGE_TITLES.DOCUMENT
    const { docId } = useParams()

    const { fetchUserInfo } = useContext(AuthContext)
    const [doc, setDoc] = useState(undefined)
    const [tempDoc, setTempDoc] = useState({})
    const [showNameInput, setShowNameInput] = useState(false)
    const [favorites, setFavorites] = useState(false)
    const [currentWorkspace, setCurrentWorkspace] = useState({
        name: "",
        url: "",
    })
    const [roleData, setRoleData] = useState({
        userRole: USER_ROLE.VIEW.name,
        listRole: [],
    })
    const { workspaces, fetchWorkspaces } = useWorkspace()
    const [activePageId, setActivePageId] = useState(undefined)
    const [selectedContent, setSelectedContent] = useState([])
    const { drawer } = useDrawer({ id: DRAWER_ID, shouldUpdate: doc })
    const { popover, triggerPopover } = usePopover()
    const navigate = useNavigate()

    const isViewRole = roleData.userRole === USER_ROLE.VIEW.name
    const isEditRole = roleData.userRole === USER_ROLE.EDIT.name

    const channel = pusher.subscribe(`channel-${docId}`)
    const socketId = pusher.connection.socket_id

    useEffect(() => {
        channel.bind("changeTitle", function (data) {
            if (pusher.connection.socket_id !== data.message.data.socketId) {
                setDoc({ ...doc, ...{ name: data.message.data.title } })
                setTempDoc({ ...doc, ...{ name: data.message.data.title } })
            }
        })
    },[])
    
    useEffect(() => {
        const fetchDocuments = async () => {
            loader.emit("start")
            const response = await DocumentService.getDocumentByID(docId)
            loader.emit("stop")

            if (response.error) {
                navigate(PATH.NOT_FOUND)
                return
            }
            const {
                results: { 0: document, is_favourite, is_owner },
            } = response
            setFavorites(is_favourite)
            const [newWorkspaces, listRole, userInfor] = await Promise.all([
                fetchWorkspaces(),
                fetchUsersRoleDocument(docId),
                fetchUserInfo(),
            ])
            setDoc(document)
            setTempDoc(document)
            setActivePageId(document.pages[0]?.id)
            setCurrentWorkspaceData({
                workspaces: newWorkspaces,
                document: document,
                is_owner: is_owner,
            })
            setRoleData({
                userRole: is_owner
                    ? USER_ROLE.OWNER.name
                    : listRole.find((role) => role.email === userInfor.email)
                          ?.role,
                listRole: [...listRole],
            })
        }
        fetchDocuments()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [docId])

    const setCurrentWorkspaceData = ({ workspaces, document, is_owner }) => {
        if (is_owner) {
            let name = "Personal"
            let url = PATH.WORKSPACE.PERSONAL
            if (document?.workspace_id) {
                name = workspaces.find(
                    (workspace) => workspace.id === document.workspace_id
                )?.name
                url = generatePath(PATH.WORKSPACE.DEFAULT, {
                    workspaceId: document?.workspace_id,
                })
            }

            setCurrentWorkspace({ name: name, url: url })
            return
        }
        setCurrentWorkspace({ name: "Shared", url: PATH.WORKSPACE.SHARED })
    }

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

            await RealtimeService.sendData("changeTitle", docId, {
                socketId: pusher.connection.socket_id,
                title: `${tempDoc.name}`,
            })
        }
    }

    const handleUpdateFavoriteDocument = async (documentId, isFavorite) => {
        const response = await DocumentService.updateFavoriteDocument({
            documentId: documentId,
            isFavorite: isFavorite,
        })
        if (response.error) {
            const {
                error: { message },
            } = response
            customToast.error(message)
            setTempDoc(doc)
            return
        }
        setFavorites(isFavorite)
    }

    const handleShareDocument = async (email, role) => {
        const response = await DocumentService.shareDocument({
            documentId: doc?.id,
            data: { role: role, email: email },
        })
        if (response.error) {
            const {
                error: { message },
            } = response
            customToast.error(message)
            setTempDoc(doc)
            return
        }
        setRoleData({
            ...roleData,
            ...{ listRole: [...(await fetchUsersRoleDocument(docId))] },
        })
        customToast.success(MESSAGE.INVITE_EMAIL_SENT)
    }

    const handleUpdateRoleDocument = async (userRoleId, userRole) => {
        const response = await DocumentService.updateUsersRoleDocument({
            userRoleId,
            userRole,
        })
        if (response.error) {
            const {
                error: { message },
            } = response
            customToast.error(message)
            setTempDoc(doc)
            return
        }
        const {
            results: { id, role },
        } = response
        setRoleData({
            ...roleData,
            ...{
                listRole: roleData?.listRole.map((itemRole) => {
                    return itemRole?.id !== id
                        ? itemRole
                        : { ...itemRole, ...{ role: role } }
                }),
            },
        })
        customToast.success(MESSAGE.UPDATE_ROLE_SUCCESS)
    }
    const handleRemoveUserRoleDocument = async (userRoleId) => {
        const response = await DocumentService.removeUsersRoleDocument({
            documentId: docId,
            userRoleId: userRoleId,
        })
        if (response.error) {
            const {
                error: { message },
            } = response
            customToast.error(message)
            setTempDoc(doc)
            return
        }
        setRoleData({
            ...roleData,
            ...{ listRole: [...(await fetchUsersRoleDocument(docId))] },
        })
        const {
            results: { message },
        } = response
        customToast.success(message)
    }

    if (!doc) return <></>

    return (
        <div className="relative bg-gray-50 flex justify-center">
            <div className="bg-white w-[1298px] rounded-t-3xl border border-solid border-gray-100">
                <div className="w-full px-12">
                    <div className="flex justify-between items-center border-b border-gray-100">
                        <div className="flex">
                            <IconButton
                                onClick={() => drawer.show()}
                                className="px-2 mr-3 justify-center hover:bg-gray-100 text-slate-500 hover:text-black"
                            >
                                <Bars3Icon className="w-4 h-4" />
                            </IconButton>
                            <IconButton
                                className="rounded-xl py-1 pl-1 px-2 text-black bg-white hover:bg-gray-100"
                                onClick={() => {
                                    navigate(currentWorkspace.url)
                                }}
                            >
                                <div className="text-white bg-rose-400 w-6 h-6 flex items-center justify-center rounded-lg mr-2">
                                    <UserCircleIcon className="w-4 h-4" />
                                </div>
                                <div
                                    className="max-w-[150px] truncate"
                                    title={`Back to ${currentWorkspace.name}`}
                                >
                                    {currentWorkspace.name}
                                </div>
                            </IconButton>
                            <div className="flex items-center text-sm">
                                <div className="mx-1.5 text-slate-500">/</div>
                                <div
                                    className="px-1.5 py-1 text-slate-500 max-w-[200px] truncate"
                                    title={doc.name}
                                >
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
                                            className="text-2xl max-w-[290px] truncate"
                                            title={tempDoc.name}
                                            onClick={() => {
                                                if (isViewRole) return
                                                setShowNameInput(!showNameInput)
                                            }}
                                        >
                                            {tempDoc.name}
                                        </div>
                                    )}
                                    <div className="relative flex pl-3.5 justify-center items-center">
                                        <div className="w-7 h-7 text-slate-500 text-xl text-center">
                                            |
                                        </div>

                                        <IconButton
                                            className="bg-white hover:bg-gray-100 w-7 h-7 rounded-lg m-0.5 justify-center"
                                            title={
                                                favorites
                                                    ? "Remove from favorites"
                                                    : "Add to favorites"
                                            }
                                            onClick={() => {
                                                handleUpdateFavoriteDocument(
                                                    docId,
                                                    !favorites
                                                )
                                            }}
                                        >
                                            {favorites ? (
                                                <SolidStarIcon className="w-5 h-5 text-rose-500" />
                                            ) : (
                                                <OutlineStarIcon className="w-4 h-4 text-slate-500" />
                                            )}
                                        </IconButton>
                                    </div>
                                    {showNameInput && !isViewRole && (
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
                                    {!isViewRole && (
                                        <>
                                            <IconButton
                                                id={BUTTON_SHARE_ID}
                                                className="text-sm px-3 text-white bg-blue-600 hover:bg-blue-700 justify-center"
                                                title="Private to only me"
                                                onClick={() => {
                                                    triggerPopover({
                                                        targetId: SHARE_MENU_ID,
                                                        triggerId:
                                                            BUTTON_SHARE_ID,
                                                    })
                                                }}
                                            >
                                                {isEditRole ? (
                                                    <>
                                                        <UserGroupIcon className="w-4 h-4 mr-2.5" />
                                                        Members
                                                    </>
                                                ) : (
                                                    <>
                                                        <LockIcon className="w-4 h-4 mr-2.5" />
                                                        Share
                                                    </>
                                                )}
                                            </IconButton>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 h-full page-container">
                            <PageNavigation
                                docId={docId}
                                channel={channel}
                                socketId={socketId}
                                listPages={doc.pages}
                                activePageId={activePageId}
                                isOnlyViewPages={isViewRole}
                                setActivePageId={setActivePageId}
                            />
                        </div>
                    </div>
                </div>
                <div className=" mx-12 mt-4">
                    <div className={clsx("w-full", isViewRole && "relative")}>
                        <Board
                            listPages={doc.pages}
                            docId={doc.id}
                            channel={channel}
                            socketId={socketId}
                            activePageId={activePageId}
                            setSelectedContent={setSelectedContent}
                            selectedContent={selectedContent}
                        />
                        {isViewRole && (
                            <div className="absolute top-0 right-0 w-full h-full bg-transparent"></div>
                        )}
                    </div>
                </div>
            </div>
            <div
                id={DRAWER_ID}
                className="fixed top-0 left-0 z-40 h-screen overflow-y-auto transition-transform -translate-x-full bg-white w-2/12"
                tabIndex="-1"
                aria-labelledby="drawer-navigation-label"
            >
                <SideBar
                    className="bg-white"
                    hideBackGround={() => drawer.hide()}
                    workspaces={workspaces}
                />
            </div>
            <PopoverShare
                id={SHARE_MENU_ID}
                roleData={roleData}
                onSubmit={(email, role) => {
                    popover.hide()
                    handleShareDocument(email, role)
                }}
                updateListRole={(userRoleId, role) => {
                    handleUpdateRoleDocument(userRoleId, role)
                }}
                removeUserRole={(userRoleId) => {
                    popover.hide()
                    handleRemoveUserRoleDocument(userRoleId)
                }}
            />
        </div>
    )
}
