import { StarIcon, UserIcon, UsersIcon } from "@heroicons/react/24/solid"
import { generatePath } from "react-router-dom"
export const EMAIL_VALIDATION = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
export const PASSWORD_VALIDATION = /^[a-zA-Z0-9]{6,}/

export const MIN_WIDTH = 9
export const MIN_HEIGHT = 4
export const GRID_SIZE = 25
export const COLUMNS_NUMBER = 48
export const DOCUMENT_WIDTH = 1200
export const PAGE_SCROLL_WIDTH = 1080
export const MINIMUM_DISTANCE = 15
export const MAXIMUM_PAGES_NUMBER = 16
export const BLOCK_EXPAND = 4
export const IMAGE_EXPAND = 4
export const IMAGE_HEIGHT = 3
export const TEXT_EXPAND = 1
export const TASK_EXPAND = 1

export const DEFAULT_TITLE = "Untitled"

const WORKSPACE_BARE_PATH = "/workspace/:workspaceId"
export const PATH = {
    DEFAULT: "/",
    DOCUMENT: { DEFAULT: "/document/:docId" },
    WORKSPACE: {
        DEFAULT: WORKSPACE_BARE_PATH,
        PERSONAL: generatePath(WORKSPACE_BARE_PATH, {
            workspaceId: "personal",
        }),
        SHARED: generatePath(WORKSPACE_BARE_PATH, {
            workspaceId: "shared",
        }),
        FAVORITE: generatePath(WORKSPACE_BARE_PATH, {
            workspaceId: "favorite",
        }),
    },
    NOT_FOUND: "/not-found",
}

export const PAGE_TITLES = {
    LOGIN: "Login",
    REGISTER: "Sign Up",
    DOCUMENT: "Document",
    NOMATCH: "Not Found",
}

export const COLOR = [
    { key: "gray", body: "bg-gray-300" },
    { key: "pink", body: "bg-red-100" },
    { key: "blue", body: "bg-cyan-100" },
    { key: "purple", body: "bg-fuchsia-100" },
    { key: "orange", body: "bg-orange-200" },
    { key: "lime", body: "bg-lime-200" },
    { key: "red", body: "bg-red-400" },
    { key: "yellow", body: "bg-amber-200" },
    { key: "white", body: "bg-white" },
]

export const MESSAGE = {
    REGISTER_SUCCEEDED: "Registered successfully, please login again!",
    DEFAULT_ERROR: "Something went wrong!",
    ACCOUNT_NOT_FOUND: "No active account found with the given credentials",
    INVALID_EMAIL: "Invalid email",
    INVALID_PASSWORD_LENGTH: "The password must be at least 6 characters",
    PASSWORDS_NOT_THE_SAME: "Password and Confirm password must be the same",
    PAGES_NUMBER_REACH_MAXIMUM: "Pages number has reached the maximum",
    INVITE_EMAIL_SENT: "Email sent",
    UPDATE_ROLE_SUCCESS: "Update role successed",
}
export const DEFAULT_TEMP = { i: "temp" }

export const PAGES = {
    personal: {
        Icon: UserIcon,
        name: "Personal",
    },
    shared: {
        Icon: UsersIcon,
        name: "Shared",
    },
    favorite: {
        Icon: StarIcon,
        name: "Favorites",
    },
}

export const USER_ROLE = {
    OWNER: { name: "OWNER", title: "Owner" },
    EDIT: { name: "EDIT", title: "Can edit" },
    VIEW: { name: "VIEW", title: "Can view" },
}
