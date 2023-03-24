export const EMAIL_VALIDATION = /^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$/
export const PASSWORD_VALIDATION = /^[a-zA-Z0-9]{6,}/
export const MIN_WIDTH = 4
export const MIN_HEIGHT = 2
export const GRID_SIZE = 25
export const COLUMNS_NUMBER = 48
export const DOCUMENT_WIDTH = 1200
export const MINIMUM_DISTANCE = 15
export const DEFAULT_TITLE = "Untitled"
export const DEFAULT_PATH = "/"
export const PAGE_TITLES = {
    LOGIN: "Login",
    REGISTER: "Sign Up",
    PERSONAL: "Personal",
    FAVORITES: "Favorites",
    RECENT: "Recent",
    SHARED: "Shared",
    DOCUMENT: "Document",
    NOMATCH: "Not Found",
}

export const MESSAGE = {
    REGISTER_SUCCEEDED: "Registered successfully, please login again!",
    DEFAULT_ERROR: "Something went wrong!",
    ACCOUNT_NOT_FOUND: "No active account found with the given credentials",
    INVALID_EMAIL: "Invalid email",
    INVALID_PASSWORD_LENGTH: "The password must be at least 6 characters",
    PASSWORDS_NOT_THE_SAME: "Password and Confirm password must be the same",
}
