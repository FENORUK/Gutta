import React from "react"
import { PAGE_TITLES, PATH } from "../../utils/constants"
import { useNavigate } from "react-router"
export const NoMatch = () => {
    document.title = PAGE_TITLES.NOMATCH
    const navigate = useNavigate()
    return (
        <div className="w-full min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full max-w-md">
                <div className="mb-6">
                    <div className="h-12 w-12 bg-[url('assets/logo.png')] bg-cover"></div>
                </div>
                <div className="mb-4 text-2xl font-bold">Page not found</div>
                <p className="mb-6 text-center text-base text-slate-500">
                    The page could not be found. Click the button below to go
                    back to your dashboard.
                </p>
                <button
                    className="bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-lg text-sm px-5 py-2.5"
                    onClick={() => {
                        navigate(PATH.WORKSPACE.PERSONAL)
                    }}
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    )
}
