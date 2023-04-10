import { useState } from "react"
import { loader } from "../components/UI/Loader"
import PageService from "../services/pageService"
import customToast from "../utils/toast"
import { MESSAGE, MAXIMUM_PAGES_NUMBER } from "../utils/constants"
import _ from "lodash"

export const usePage = (listPages) => {
    const [pages, setPages] = useState([...listPages])

    const createPage = async ({ docId, pageName }) => {
        if (pages.length === MAXIMUM_PAGES_NUMBER) {
            customToast.error(MESSAGE.PAGES_NUMBER_REACH_MAXIMUM)
            return
        }
        loader.emit("start")
        const response = await PageService.createNewPage(docId, pageName)
        loader.emit("stop")

        if (response.error) {
            const {
                error: { message },
            } = response
            customToast.error(message)
            return
        }
        setPages([...pages, response.results])
        return _.get(response, "results.id", pages[pages.length - 1].id)
    }

    const renamePage = async ({ docId, selectedPageId, newName }) => {
        const page = pages.find((page) => page.id === selectedPageId)
        if (!newName || !page || newName === page.name) {
            return
        }
        loader.emit("start")
        const response = await PageService.updatePage({
            documentId: docId,
            pageId: selectedPageId,
            name: newName,
        })
        loader.emit("stop")
        if (response.error) {
            const {
                error: { message },
            } = response
            customToast.error(message)
            return
        }
        setPages(
            pages.map((page) => {
                return page.id === selectedPageId ? response.results : page
            })
        )
    }

    const deletePage = async ({ pageId }) => {
        loader.emit("start")
        const response = await PageService.deletePage(pageId)
        loader.emit("stop")
        if (response.error) {
            const {
                error: { message },
            } = response
            customToast.error(message)
            return
        }
        const newListPage = pages.filter((page) => page.id !== pageId)
        setPages(newListPage)
        customToast.success(_.get(response, "results.message"))
        return newListPage
    }

    return { pages, createPage, renamePage, deletePage }
}
