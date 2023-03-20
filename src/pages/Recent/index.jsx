import React from "react"
import { DefaultLayout } from "../../components/UI/Layout/DefaultLayout"

export function Recent() {
    document.title = "Recent"
    return (
        <DefaultLayout>
            <div className="pt-3 text-2xl">Recent</div>
        </DefaultLayout>
    )
}
