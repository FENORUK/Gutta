import { useContext } from "react"
import { PopoverMenu } from "../../components/UI/PopoverMenu"
import { AuthContext } from "../../contexts/AuthContext"
import { useState } from "react"
import { EMAIL_VALIDATION } from "../../utils/constants"
import { ChevronDownIcon } from "@heroicons/react/24/solid"
import { useDropdown } from "../../hooks/useDropdown"
import { DropdownMenu } from "../../components/UI/DropdownMenu"

const BUTTON_ROLE_DROPDOWN = "dropdown-button-role-id"
const BUTTON_INVITE_DROPDOWN = "dropdown-button-invite-id"
const DROPDOWN_ROLE_MENU = "dropdown-menu-role-id"
const DROPDOWN_INVITE_MENU = "dropdown-menu-invite-id"

export const PopoverShare = ({ id, onSubmit }) => {
    const { user } = useContext(AuthContext)
    const { dropdown, triggerDropdown } = useDropdown()
    const [emailInput, setEmailInput] = useState("")

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && EMAIL_VALIDATION.test(emailInput)) {
            onSubmit(emailInput)
        }
    }

    return (
        <PopoverMenu id={id} className="py-4 px-6">
            <div className="pb-4 mb-2.5 border-b">
                <div className="text-lg font-semibold mb-4">Share & Invite</div>
                <div className="flex">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Email address"
                            className="border-none w-72 h-8 focus:ring-0 bg-gray-100 py-1 pl-2 pr-24 text-xs rounded-md"
                            value={emailInput}
                            onChange={(event) => {
                                setEmailInput(event.target.value)
                            }}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            id={BUTTON_INVITE_DROPDOWN}
                            className="absolute right-2 top-2 text-sm text-gray-400 flex items-center text-xs"
                            onClick={() => {
                                triggerDropdown({
                                    targetId: DROPDOWN_INVITE_MENU,
                                    triggerId: BUTTON_INVITE_DROPDOWN,
                                })
                            }}
                        >
                            Can view
                            <ChevronDownIcon className="ml-1 w-3 h-3" />
                        </button>
                    </div>
                    <button
                        className="ml-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-100 disabled:text-gray-400 text-white text-xs px-4 rounded-md"
                        disabled={!EMAIL_VALIDATION.test(emailInput)}
                        onClick={() => {
                            onSubmit(emailInput)
                        }}
                    >
                        Add
                    </button>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center mb-2">
                    <div className="w-7 h-7 rounded-2xl flex items-center justify-center cursor-pointer ml-2 bg-red-300 font-bold text-sm text-white">
                        <span className="uppercase tracking-wider">
                            {(user?.email || "").slice(0, 2)}
                        </span>
                    </div>
                    <div
                        className="ml-2 text-xs max-w-[200px] truncate"
                        title={user?.email}
                    >
                        {user?.email}
                    </div>
                </div>
                <div className="text-xs text-gray-400">Owner</div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center mb-2">
                    <div className="w-7 h-7 rounded-2xl flex items-center justify-center cursor-pointer ml-2 bg-red-300 font-bold text-sm text-white">
                        <span className="uppercase tracking-wider">
                            {(user?.email || "").slice(0, 2)}
                        </span>
                    </div>
                    <div
                        className="ml-2 text-xs max-w-[200px] truncate"
                        title={"email here"}
                    >
                        email here
                    </div>
                </div>
                <button
                    id={BUTTON_ROLE_DROPDOWN}
                    className="text-sm text-gray-400 flex items-center text-xs"
                    onClick={() => {
                        triggerDropdown({
                            targetId: DROPDOWN_ROLE_MENU,
                            triggerId: BUTTON_ROLE_DROPDOWN,
                        })
                    }}
                >
                    Can edit <ChevronDownIcon className="ml-1 w-3 h-3" />
                </button>
            </div>
            <DropdownMenu id={DROPDOWN_INVITE_MENU} className="w-28">
                <button
                    className="transition hover:bg-gray-100 py-2 px-4 rounded-lg text-xs text-left"
                    onClick={() => {
                        dropdown.hide()
                    }}
                >
                    Can edit
                </button>
            </DropdownMenu>

            <DropdownMenu id={DROPDOWN_ROLE_MENU} className="w-28">
                <button
                    className="transition hover:bg-gray-100 py-2 px-4 rounded-lg text-xs text-left"
                    onClick={() => {
                        dropdown.hide()
                    }}
                >
                    Can view
                </button>
                <button
                    className="transition hover:bg-gray-100 py-2 px-4 rounded-lg text-xs text-left"
                    onClick={() => {
                        dropdown.hide()
                    }}
                >
                    Remove
                </button>
            </DropdownMenu>
        </PopoverMenu>
    )
}
