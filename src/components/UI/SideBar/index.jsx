import React from "react"
import {
    PlusSmallIcon,
    EllipsisHorizontalIcon,
} from "@heroicons/react/24/solid"
import { clsx } from "clsx"
import { NavLink, generatePath } from "react-router-dom"
import { PAGES, PATH } from "../../../utils/constants"
import { IconButton } from "../IconButton"
import { FolderIcon } from "@heroicons/react/24/outline"

export function SideBar(props) {
    const {
        className,
        hideBackGround,
        workspaces,
        allowEditWorkspaces = false,
        onWorkspaceMenuClicked,
        onWorkspaceAddButtonClicked,
    } = props

    return (
        <aside
            className={clsx(
                "transition-transform block bg-gray-50 flex flex-col h-full",
                className
            )}
        >
            <div className="w-full mx-auto flex-shrink-0 flex items-center px-3 py-4 text-center font-bold">
                <div className="h-8 w-8 bg-[url('assets/logo.png')] bg-cover"></div>
                <div className="ml-2.5 text-2xl">Gutta</div>
            </div>
            <div className="h-full py-1 overflow-y-auto flex flex-col justify-between">
                <ul className="my-4">
                    <li className="px-3">
                        <span className="text-xs text-slate-500">
                            DOCUMENTS
                        </span>
                        <div className="h-full w-full py-2 overflow-y-auto">
                            <ul className="text-slate-500">
                                {Object.entries(PAGES).map(
                                    ([id, { Icon, name }]) => (
                                        <li
                                            key={id}
                                            className="rounded-lg w-full"
                                            data-drawer-hide="drawer-navigation"
                                            onClick={hideBackGround}
                                        >
                                            <NavLink
                                                to={generatePath(
                                                    PATH.WORKSPACE.DEFAULT,
                                                    { workspaceId: id }
                                                )}
                                                className={({ isActive }) =>
                                                    clsx(
                                                        {
                                                            "bg-rose-100 text-black":
                                                                isActive,
                                                        },
                                                        "py-2 my-1 pl-2 block items-center font-normal rounded-lg hover:bg-rose-100"
                                                    )
                                                }
                                            >
                                                <Icon
                                                    aria-hidden="true"
                                                    className="w-4 h-4 inline transition duration-75"
                                                />
                                                <div className="ml-3 inline text-sm max-w-[140px] truncate">
                                                    {name}
                                                </div>
                                            </NavLink>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    </li>
                    <li className="px-3 py-4 flex flex-col items-center">
                        <div className="flex items-center w-full h-full">
                            <span className="text-slate-500 text-xs flex-grow">
                                WORKSPACES
                            </span>
                            {allowEditWorkspaces && (
                                <button
                                    className="flex hover:bg-rose-100 justify-center items-center w-6 h-6 rounded btn--create-workspace"
                                    title="Create new Workspace"
                                    onClick={onWorkspaceAddButtonClicked}
                                >
                                    <PlusSmallIcon className="h-5 w-5 text-slate-500" />
                                </button>
                            )}
                        </div>
                    </li>
                    <li className="flex flex-col items-center max-h-[300px] overflow-y-auto">
                        <div className="h-full w-full">
                            <ul className="text-slate-500 px-3">
                                {workspaces &&
                                    workspaces.map(({ id, name }) => (
                                        <li
                                            key={id}
                                            className="rounded-lg"
                                            data-drawer-hide="drawer-navigation"
                                            onClick={hideBackGround}
                                        >
                                            <NavLink
                                                to={generatePath(
                                                    PATH.WORKSPACE.DEFAULT,
                                                    { workspaceId: id }
                                                )}
                                                className={({ isActive }) =>
                                                    clsx(
                                                        {
                                                            "bg-rose-100 text-black":
                                                                isActive,
                                                        },
                                                        "py-2 my-1 pl-2 block items-center font-normal rounded-lg hover:bg-rose-100"
                                                    )
                                                }
                                            >
                                                <div className="flex justify-between">
                                                    <div className="flex items-center">
                                                        <FolderIcon
                                                            aria-hidden="true"
                                                            className="w-4 h-4 inline transition duration-75"
                                                        />
                                                        <div
                                                            className="ml-3 text-sm min-w-0 max-w-[140px] truncate"
                                                            title={name}
                                                        >
                                                            {name}
                                                        </div>
                                                    </div>
                                                    {allowEditWorkspaces && (
                                                        <IconButton
                                                            className="w-6 h-6 justify-center mr-2 text-slate-500 hover:text-black bg-transparent hover:bg-rose-300"
                                                            id={id}
                                                            onClick={(
                                                                event
                                                            ) => {
                                                                event.preventDefault()
                                                                onWorkspaceMenuClicked(
                                                                    id
                                                                )
                                                            }}
                                                        >
                                                            <EllipsisHorizontalIcon className="w-4 h-4" />
                                                        </IconButton>
                                                    )}
                                                </div>
                                            </NavLink>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </aside>
    )
}
