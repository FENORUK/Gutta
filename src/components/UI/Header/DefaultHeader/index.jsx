import React, { useContext, useState, useRef, useEffect } from "react"
import { IconButton } from "../../IconButton"
import { loader } from "../../Loader"
import {
    ArrowRightOnRectangleIcon,
    BellIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/solid"
import { PopoverMenu } from "../../PopoverMenu"
import { usePopover } from "../../../../hooks/usePopover"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../../../contexts/AuthContext"
import { useOnClickOutside } from "use-hooks"
import NotifyService from "../../../../services/NotifyService"
import { pusher } from "../../../../utils/pusher"
import Notification from "../../Notification"
import { PATH } from "../../../../utils/constants"

const USER_AVATAR_ID = "user-image"
const USER_SETTING_MENU_ID = "user-menu"

export function DefaultHeader() {
    const { user, logout } = useContext(AuthContext)
    const { popover, triggerPopover } = usePopover()
    const [isShown, setIsShown] = useState(false)
    const [isOutside, setIsOutside] = useState(true)
    const [isNotify, setIsNotify] = useState(false)
    const [data, setData] = useState([])
    useEffect(() => {
        const channel = pusher.subscribe(`channel-${user?.id}`)
        channel.bind("share-document", function (data) {
            if (isShown) {
                fetchNotifications()
            }
            setIsNotify(true)
        })
        const dataFetch = async () => {
            const response = await NotifyService.checkNotification()
            setIsNotify(response.results.check)
        }
        dataFetch()
    }, [])

    const fetchNotifications = async () => {
        loader.emit("start")
        const response = await NotifyService.getNotification()
        loader.emit("stop")
        setData(response.results)
    }
    const ref = useRef()
    useOnClickOutside(ref, () => {
        setIsOutside(false)
    })
    const handleClick = () => {
        if (!isShown) {
            fetchNotifications()
        }
        setIsOutside(true)
        setIsShown((current) => !current)
        setIsNotify(false)
    }
    const navigate = useNavigate()
    return (
        <div className="flex justify-end items-center h-14 bg-white">
            <IconButton
                key="1"
                className="px-4 h-8 text-gray-400 hover:text-black"
            >
                <div className="w-4 h-4 mr-2">
                    <MagnifyingGlassIcon />
                </div>
                Search...
            </IconButton>

            <IconButton key="2" title="Notifications" onClick={handleClick}>
                <div className="w-4 h-4">
                    <BellIcon />
                </div>
            </IconButton>
            <div className="relative">
                <div
                    id={USER_AVATAR_ID}
                    className="w-8 h-8 rounded-2xl flex items-center justify-center cursor-pointer ml-2 bg-red-300 font-bold text-sm text-white"
                    onClick={() => {
                        triggerPopover({
                            targetId: USER_SETTING_MENU_ID,
                            triggerId: USER_AVATAR_ID,
                        })
                    }}
                >
                    <span className="uppercase tracking-wider">
                        {(user?.email || "").slice(0, 2)}
                    </span>
                </div>
                {isNotify && (
                    <div class="absolute flex h-2.5 w-2.5 right-11 top-6">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-300"></span>
                    </div>
                )}
            </div>
            <div className="relative z-50">
                {isShown && isOutside && (
                    <div
                        ref={ref}
                        className="absolute right-12 top-5 rounded-md w-96 border bg-gray-100  bg-white overflow-auto overflow-x-hidden"
                        style={{ minHeight: 150, maxHeight: 510 }}
                    >
                        <p className="ml-6 mr-3 mt-3 mb-2.5 border-b-2 border-green-50 text-lg py-3 font-bold">
                            Notifications
                        </p>
                        {data?.length ? (
                            data.map((item) => <Notification data={item} />)
                        ) : (
                            <div className="flex flex-col items-center text-gray-400">
                                <BellIcon className="w-10 h-10 mt-6" />
                                <p className="mb-2.5 p-3 w-96 text-center break-words text-sm">
                                    You have no unread messages
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <PopoverMenu id={USER_SETTING_MENU_ID}>
                <IconButton
                    className="rounded-lg text-gray-400 bg-white hover:text-black hover:bg-gray-100 w-full px-3 py-1.5"
                    onClick={() => {
                        popover.hide()
                        logout()
                        navigate(PATH.DEFAULT)
                    }}
                >
                    <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                    Sign out
                </IconButton>
            </PopoverMenu>
        </div>
    )
}
