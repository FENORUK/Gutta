import React from "react"
import { DefaultLayout } from "../../components/UI/Layout/DefaultLayout"

export function Personal() {
    document.title = "Personal"
    return (
        <>
            <DefaultLayout>
                <div className="pt-3 text-2xl">Personal</div>
            </DefaultLayout>
        </>
    )
}
