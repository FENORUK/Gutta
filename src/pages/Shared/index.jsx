import React from "react"
import { DefaultLayout } from "../../components/UI/Layout/DefaultLayout"
import { PAGE_TITLES } from "../../utils/constants"

export function Shared() {
    document.title = PAGE_TITLES.SHARED
    return (
        <DefaultLayout>
            <div className="pt-3 text-2xl">Shared</div>
        </DefaultLayout>
    )
}
