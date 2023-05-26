import { useContext } from "react"
import { PopoverMenu } from "../../components/UI/PopoverMenu"
import { AuthContext } from "../../contexts/AuthContext"
import { useState } from "react"
import { EMAIL_VALIDATION, USER_ROLE } from "../../utils/constants"
import { ChevronDownIcon } from "@heroicons/react/24/solid"
import { useDropdown } from "../../hooks/useDropdown"
import { DropdownMenu } from "../../components/UI/DropdownMenu"
import get from "lodash/get"
import clsx from "clsx"

const BUTTON_INVITE_DROPDOWN = "dropdown-button-invite-id"
const DROPDOWN_ROLE_MENU = "dropdown-menu-role-id"
const DROPDOWN_INVITE_MENU = "dropdown-menu-invite-id"

export const PopoverShare = ({
    id,
    roleData,
    updateListRole,
    removeUserRole,
    onSubmit,
}) => {
    const { user } = useContext(AuthContext)
    const { dropdown, triggerDropdown } = useDropdown()
    const [emailInput, setEmailInput] = useState("")
    const [roleShare, setRoleShare] = useState(USER_ROLE.VIEW.name)
    const [selectedUserRole, setSelectedUserRole] = useState({})

    const handleKeyDown = (event) => {
        if (
            event.key === "Enter" &&
            EMAIL_VALIDATION.test(emailInput) &&
            emailInput !== user?.email
        ) {
            onSubmit(emailInput, roleShare)
            setEmailInput("")
        }
    }

    const getRoleShareChange = (currentRoleShare) => {
        return currentRoleShare === USER_ROLE.EDIT.name
            ? USER_ROLE.VIEW.name
            : USER_ROLE.EDIT.name
    }

    const isOwnerRole = (userRole) => {
        return userRole === USER_ROLE.OWNER.name
    }

    const isDocumentOwner = isOwnerRole(roleData?.userRole)

    const allowEditUserRole = ({ userRole, is_accepted }) => {
        return !isOwnerRole(userRole) && isDocumentOwner && is_accepted
    }

    return (
        <PopoverMenu id={id} className="py-4 px-6">
            <div className="pb-4 mb-2.5 border-b">
                <div
                    className={clsx(
                        "text-lg font-semibold",
                        isDocumentOwner ? "mb-4" : "w-[352px]"
                    )}
                >
                    {isDocumentOwner ? "Share & Invite" : "Members"}
                </div>
                <div className="flex">
                    {isDocumentOwner && (
                        <>
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
                                    className="absolute right-2 top-2 text-sm text-slate-500 flex items-center text-xs"
                                    onClick={() => {
                                        triggerDropdown({
                                            targetId: DROPDOWN_INVITE_MENU,
                                            triggerId: BUTTON_INVITE_DROPDOWN,
                                        })
                                    }}
                                >
                                    {get(USER_ROLE, `${roleShare}.title`)}
                                    <ChevronDownIcon className="ml-1 w-3 h-3" />
                                </button>
                            </div>

                            <button
                                className="ml-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-100 disabled:text-slate-500 text-white text-xs px-4 rounded-md"
                                disabled={
                                    !EMAIL_VALIDATION.test(emailInput) ||
                                    emailInput === user?.email
                                }
                                onClick={() => {
                                    onSubmit(emailInput, roleShare)
                                    setEmailInput("")
                                }}
                            >
                                Add
                            </button>
                        </>
                    )}
                </div>
            </div>

            {roleData?.listRole.map(({ id, role, email, is_accepted }) => (
                <div
                    className="flex items-center justify-between text-slate-500"
                    key={id}
                >
                    <div className="flex items-center mb-2">
                        <div className="w-7 h-7 rounded-2xl flex items-center justify-center cursor-pointer ml-2 bg-rose-500 font-bold text-xs text-white">
                            <span className="uppercase tracking-wider">
                                {(email || "").slice(0, 2)}
                            </span>
                        </div>
                        <div
                            className={clsx(
                                "ml-2 text-xs max-w-[200px] truncate",
                                is_accepted === 0
                                    ? "text-gray-400"
                                    : "text-black"
                            )}
                            title={email}
                        >
                            {email}
                        </div>
                    </div>
                    <div
                        id={id}
                        className={clsx(
                            "text-xs flex items-center text-xs mb-2",
                            allowEditUserRole({ role, is_accepted })
                                ? "cursor-pointer text-slate-500"
                                : is_accepted === 0 && "text-gray-400"
                        )}
                        onClick={() => {
                            if (
                                !allowEditUserRole({
                                    role,
                                    is_accepted,
                                })
                            )
                                return
                            triggerDropdown({
                                targetId: DROPDOWN_ROLE_MENU,
                                triggerId: id,
                            })
                            setSelectedUserRole(
                                roleData?.listRole.find(
                                    (role) => role.id === id
                                ) || {}
                            )
                        }}
                    >
                        {is_accepted || isOwnerRole(role)
                            ? get(USER_ROLE, `${role}.title`)
                            : "Pending..."}
                        {allowEditUserRole({ role, is_accepted }) ? (
                            <ChevronDownIcon className="ml-1 w-3 h-3" />
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            ))}

            {isDocumentOwner && (
                <>
                    <DropdownMenu id={DROPDOWN_INVITE_MENU} className="w-28">
                        <button
                            className="transition hover:bg-gray-100 py-2 px-4 rounded-lg text-xs text-left"
                            onClick={() => {
                                dropdown.hide()
                                setRoleShare(getRoleShareChange(roleShare))
                            }}
                        >
                            {get(
                                USER_ROLE,
                                `${getRoleShareChange(roleShare)}.title`
                            )}
                        </button>
                    </DropdownMenu>

                    <DropdownMenu id={DROPDOWN_ROLE_MENU} className="w-28">
                        <button
                            className="transition hover:bg-gray-100 py-2 px-4 rounded-lg text-xs text-left"
                            onClick={() => {
                                dropdown.hide()
                                updateListRole(
                                    selectedUserRole.id,
                                    getRoleShareChange(selectedUserRole?.role)
                                )
                            }}
                        >
                            {get(
                                USER_ROLE,
                                `${getRoleShareChange(
                                    selectedUserRole?.role
                                )}.title`
                            )}
                        </button>
                        <button
                            className="transition hover:bg-gray-100 py-2 px-4 rounded-lg text-xs text-left"
                            onClick={() => {
                                dropdown.hide()
                                removeUserRole(selectedUserRole.id)
                            }}
                        >
                            Remove
                        </button>
                    </DropdownMenu>
                </>
            )}
        </PopoverMenu>
    )
}
