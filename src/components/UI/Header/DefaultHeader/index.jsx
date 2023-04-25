import React, { useContext, useState, useRef, useEffect } from "react"
import { IconButton } from "../../IconButton"
import { loader } from "../../Loader"
import { ArrowRightOnRectangleIcon, BellIcon } from "@heroicons/react/24/solid"
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
        return () => {
            channel.unbind("share-document")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <IconButton key="2" title="Notifications" onClick={handleClick}>
                <div className="w-4 h-4">
                    <BellIcon />
                </div>
            </IconButton>
            <div className="relative">
                <div
                    id={USER_AVATAR_ID}
                    className="w-8 h-8 rounded-2xl flex items-center justify-center cursor-pointer ml-2 bg-rose-500 font-bold text-sm text-white"
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
                    <div className="absolute flex h-2.5 w-2.5 right-11 top-6">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-400"></span>
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
                            <div className="flex flex-col items-center text-slate-500">
                                <BellIcon className="w-10 h-10 mt-6" />
                                <p className="mb-2.5 p-3 w-96 text-center break-words text-sm">
                                    You have no unread messages
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <PopoverMenu id={USER_SETTING_MENU_ID} className="px-6">
                <div className="text-lg font-semibold py-2.5 cursor-default">
                    Profile
                </div>
                <div className="flex items-center pt-1.5 pb-4 border-b">
                    <div className="w-9 h-9 rounded-3xl flex items-center justify-center cursor-pointer bg-rose-500 font-bold text-sm text-white">
                        <span className="uppercase tracking-wider">
                            {(user?.email || "").slice(0, 2)}
                        </span>
                    </div>
                    <div className="ml-3 text-black text-sm w-64 truncate cursor-default">
                        {user?.email}
                    </div>
                </div>
                <IconButton
                    className="rounded-lg w-full text-slate-500 bg-white hover:text-black hover:bg-gray-100 px-1.5 py-2 mt-2 mb-0.5"
                    onClick={() => {
                        popover.hide()
                        logout()
                        navigate(PATH.DEFAULT)
                    }}
                >
                    <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                    Sign out
                </IconButton>
            </PopoverMenu>
        </div>
    )
}
