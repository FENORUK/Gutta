import React from "react"
import { PAGE_TITLES } from "../../utils/constants"
export const NoMatch = () => {
    document.title = PAGE_TITLES.NOMATCH
    return <p>There's nothing here: 404!</p>
}
