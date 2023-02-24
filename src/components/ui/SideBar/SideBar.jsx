import React from "react"
import {
    PlusSmallIcon,
    UserIcon,
    UsersIcon,
    StarIcon,
    ClockIcon,
    TrashIcon,
} from "@heroicons/react/24/solid"
import styles from "./SideBar.module.css"
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
    {
        Icon: TrashIcon,
        label: "Trash",
        url: "#",
    },
]

export default function Side_bar() {
    const filteredItems = ITEMS.filter((item) => item.label !== "Trash")
    const ItemsTrash = ITEMS.filter((item) => item.label === "Trash")

    return (
        <div
            className={
                "sidebar w-60 h-screen fixed bg-gray-800 top-0 left-0 z-10 text-gray-500"
            }
        >
            <div
                className={
                    "bg-gray-50 w-240 text-2xl mx-auto flex-shrink-0 flex items-center px-4 py-4 text-center font-bold"
                }
            >
                CWork
            </div>
            <aside
                className={
                    "transition-transform block h-screen text-gray-500 sm:translate-x-0"
                }
            >
                <div
                    className={
                        "h-full py-1 overflow-y-auto bg-gray-50 dark:bg-gray-800"
                    }
                >
                    <ul className={"my-4"}>
                        <li className={"px-4"}>
                            <span className={"text-xs"}>DOCUMENTS</span>
                            <div
                                className={
                                    "h-full py-2 overflow-y-auto bg-gray-50"
                                }
                            >
                                <ul className={"text-gray-200"}>
                                    {filteredItems.map(
                                        ({ Icon, label, url }) => (
                                            <li
                                                key={url}
                                                className={clsx(
                                                    "rounded-lg cursor-pointer hover:bg-red-100",
                                                    styles.listItem
                                                )}
                                            >
                                                <NavLink
                                                    to={url}
                                                    className={({ isActive }) =>
                                                        clsx(
                                                            "py-3 pl-2 block text-gray-500 items-center text-base font-normal rounded-lg hover:bg-red-100",
                                                            {
                                                                "bg-red-100 text-black":
                                                                    isActive,
                                                            }
                                                        )
                                                    }
                                                >
                                                    <Icon
                                                        aria-hidden="true"
                                                        className={
                                                            "w-4 h-4 inline transition duration-75 group-hover:text-gray-900"
                                                        }
                                                    />
                                                    <span
                                                        className={
                                                            "ml-3 inline  text-sm"
                                                        }
                                                    >
                                                        {label}
                                                    </span>
                                                </NavLink>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </li>
                        <li className={"px-4 py-4 flex items-center"}>
                            <div className={"flex items-center w-full h-full"}>
                                <span
                                    className={
                                        "text-gray-500 text-xs flex-grow"
                                    }
                                >
                                    WORKSPACES
                                </span>
                                <button
                                    className={
                                        "flex hover:bg-red-100 justify-center items-center w-6 h-6 rounded btn_add_workspace"
                                    }
                                    title="Create new Workspace"
                                >
                                    <PlusSmallIcon
                                        className={"h-5 w-5 text-gray-500"}
                                    />
                                </button>
                            </div>
                        </li>
                    </ul>
                    {ItemsTrash.map((item) => (
                        <div
                            key={item.url}
                            title="View deleted documents"
                            className={`py-3 pl-2 mx-4 bottom-0 mb-20 absolute rounded-lg cursor-pointer hover:bg-red-100 ${styles.listItem}`}
                        >
                            <button
                                className={
                                    "flex items-center text-base font-normal text-gray-500 rounded-lg hover:bg-red-100"
                                }
                            >
                                <item.Icon
                                    aria-hidden="true"
                                    className={
                                        "w-4 h-4 transition duration-75 group-hover:text-gray-900"
                                    }
                                ></item.Icon>
                                <span className={"ml-3 text-sm"}>
                                    {item.label}
                                </span>
                            </button>
                        </div>
                    ))}
                </div>
            </aside>
        </div>
    )
}
