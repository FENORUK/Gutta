import React from "react"
import { IconButton } from "../../IconButton"
import {
    BellIcon,
    CheckCircleIcon,
    MagnifyingGlassIcon,
    QuestionMarkCircleIcon,
    UserPlusIcon,
} from "@heroicons/react/24/solid"
import clsx from "clsx"
import { ReactComponent as NoteIcon } from "../../../../assets/note.svg"
const BUTTONS = [
    {
        key: 0,
        className: "px-3 mr-4 bg-white hover:bg-red-100 h-8 text-black",
        icon: <UserPlusIcon />,
        iconClassName: "mr-2",
        description: "Refer a friends, get more blocks",
    },
    {
        key: 1,
        className: "px-3 h-8 text-gray-400 hover:text-black",
        icon: <MagnifyingGlassIcon />,
        iconClassName: "mr-2",
        description: "Search...",
    },
    {
        key: 2,
        title: "Quick Note",
        icon: <NoteIcon />,
    },
    {
        key: 3,
        title: "Tasks",
        icon: <CheckCircleIcon />,
    },
    {
        key: 4,
        title: "Notifications",
        icon: <BellIcon />,
    },
    {
        key: 5,
        title: "Help Center",
        icon: <QuestionMarkCircleIcon />,
    },
]

export function DefaultHeader() {
    return (
        <div className="flex justify-end items-center h-14">
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
