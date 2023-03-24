import React from "react"
import { IconButton } from "../../IconButton"
import {
    BellIcon,
    MagnifyingGlassIcon,
    QuestionMarkCircleIcon,
} from "@heroicons/react/24/solid"
import clsx from "clsx"
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

export function DefaultHeader() {
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
            <div className="w-8 h-8 bg-cover bg-[url('assets/theme.jpg')] rounded-2xl cursor-pointer ml-2"></div>
        </div>
    )
}
