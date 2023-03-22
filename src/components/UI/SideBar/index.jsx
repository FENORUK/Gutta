import React from "react"
import {
    PlusSmallIcon,
    UserIcon,
    UsersIcon,
    StarIcon,
    ClockIcon,
    TrashIcon,
} from "@heroicons/react/24/solid"
import { clsx } from "clsx"
import { NavLink } from "react-router-dom"

const ITEMS = [
    {
        Icon: UserIcon,
        label: "Personal",
        url: "/",
    },
    {
        Icon: UsersIcon,
        label: "Shared",
        url: "/shared",
    },
    {
        Icon: StarIcon,
        label: "Favorites",
        url: "/favorites",
    },
    {
        Icon: ClockIcon,
        label: "Recent",
        url: "/recent",
    },
]

const TRASH = [
    {
        Icon: TrashIcon,
        label: "Trash",
        url: "#",
    },
]

export function SideBar(props) {
    return (
        <aside
            className={clsx(
                "transition-transform block bg-gray-50 flex flex-col h-full",
                props.className
            )}
        >
            <div className="w-full text-2xl mx-auto flex-shrink-0 flex items-center px-4 py-4 text-center font-bold">
                CWork
            </div>
            <div className="h-full py-1 overflow-y-auto flex flex-col justify-between">
                <ul className="my-4">
                    <li className="px-4">
                        <span className="text-xs">DOCUMENTS</span>
                        <div className="h-full w-full py-2 overflow-y-auto">
                            <ul className="text-gray-500">
                                {ITEMS.map(({ Icon, label, url }) => (
                                    <li
                                        key={url}
                                        className="rounded-lg hover:bg-red-100 w-full"
                                        data-drawer-hide="drawer-navigation"
                                        onClick={props.hideBackGround}
                                    >
                                        <NavLink
                                            to={url}
                                            className={({ isActive }) =>
                                                clsx(
                                                    {
                                                        "bg-red-100 text-black":
                                                            isActive,
                                                    },
                                                    "py-3 pl-2 block items-center font-normal rounded-lg hover:bg-red-100"
                                                )
                                            }
                                        >
                                            <Icon
                                                aria-hidden="true"
                                                className="w-4 h-4 inline transition duration-75"
                                            />
                                            <span className="ml-3 inline text-sm">
                                                {label}
                                            </span>
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </li>
                    <li className="px-4 py-4 flex items-center">
                        <div className="flex items-center w-full h-full">
                            <span className="text-gray-500 text-xs flex-grow">
                                WORKSPACES
                            </span>
                            <button
                                className="flex hover:bg-red-100 justify-center items-center w-6 h-6 rounded btn--create-workspace"
                                title="Create new Workspace"
                            >
                                <PlusSmallIcon className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>
                    </li>
                </ul>
                {TRASH.map((item) => (
                    <div
                        key={item.url}
                        title="View deleted documents"
                        className="py-3 pl-2 mx-4 mb-4 rounded-lg cursor-pointer hover:bg-red-100"
                    >
                        <button className="flex items-center font-normal text-gray-500 hover:bg-red-100">
                            <item.Icon
                                aria-hidden="true"
                                className="w-4 h-4"
                            ></item.Icon>
                            <span className="ml-3 text-sm">{item.label}</span>
                        </button>
                    </div>
                ))}
            </div>
        </aside>
    )
}
