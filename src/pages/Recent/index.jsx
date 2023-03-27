import React from "react"
import { DefaultLayout } from "../../components/UI/Layout/DefaultLayout"
import { PAGE_TITLES } from "../../utils/constants"

export function Recent() {
    document.title = PAGE_TITLES.RECENT
    return (
        <DefaultLayout>
            <div className="pt-3 text-2xl">Recent</div>
        </DefaultLayout>
    )
}
