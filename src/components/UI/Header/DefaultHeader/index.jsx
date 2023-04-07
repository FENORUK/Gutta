import React, { useContext } from "react"
import { IconButton } from "../../IconButton"
import {
    ArrowRightOnRectangleIcon,
    BellIcon,
    MagnifyingGlassIcon,
    QuestionMarkCircleIcon,
} from "@heroicons/react/24/solid"
import clsx from "clsx"
import { PopoverMenu } from "../../PopoverMenu"
import { usePopover } from "../../../../hooks/usePopover"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../../../contexts/AuthContext"
const BUTTONS = [
    {
        key: 0,
        className: "px-4 h-8 text-gray-400 hover:text-black",
        icon: <MagnifyingGlassIcon />,
        iconClassName: "mr-2",
        description: "Search...",
    },
    {
        key: 1,
        title: "Notifications",
        icon: <BellIcon />,
    },
    {
        key: 2,
        title: "Help Center",
        icon: <QuestionMarkCircleIcon />,
    },
]
const USER_AVATAR_ID = "user-image"
const USER_SETTING_MENU_ID = "user-menu"

export function DefaultHeader() {
    const { user, logout } = useContext(AuthContext)
    const { popover, triggerPopover } = usePopover()
    const navigate = useNavigate()
    return (
        <div className="flex justify-end items-center h-14 bg-white">
            {BUTTONS.map(
                ({
                    key,
                    className,
                    title,
                    iconClassName,
                    icon,
                    description,
                }) => (
                    <IconButton key={key} className={className} title={title}>
                        <div className={clsx("w-4 h-4", iconClassName)}>
                            {icon}
                        </div>
                        {description}
                    </IconButton>
                )
            )}
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
            <PopoverMenu id={USER_SETTING_MENU_ID}>
                <IconButton
                    className="rounded-lg text-gray-400 bg-white hover:text-black hover:bg-gray-100 w-full px-3 py-1.5"
                    onClick={() => {
                        popover.hide()
                        logout()
                        navigate("/login")
                    }}
                >
                    <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                    Sign out
                </IconButton>
            </PopoverMenu>
        </div>
    )
}
