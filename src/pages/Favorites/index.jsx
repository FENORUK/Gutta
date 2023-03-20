import React from "react"
import { DefaultLayout } from "../../components/UI/Layout/DefaultLayout"

export function Favorites() {
    document.title = "Favourites"
    return (
        <DefaultLayout>
            <div className="pt-3 text-2xl">Favorites</div>
        </DefaultLayout>
    )
}
