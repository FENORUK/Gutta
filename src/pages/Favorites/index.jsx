import React from "react"
import { DefaultLayout } from "../../components/UI/Layout/DefaultLayout"
import { PAGE_TITLES } from "../../utils/constants"

export function Favorites() {
    document.title = PAGE_TITLES.FAVORITES
    return (
        <DefaultLayout>
            <div className="pt-3 text-2xl">Favorites</div>
        </DefaultLayout>
    )
}
