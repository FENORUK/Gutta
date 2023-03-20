import React from "react"
import { DefaultLayout } from "../../components/UI/Layout/DefaultLayout"

export function Shared() {
    document.title = "Shared"
    return (
        <DefaultLayout>
            <div className="pt-3 text-2xl">Shared</div>
        </DefaultLayout>
    )
}
