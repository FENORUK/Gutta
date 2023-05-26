import { useEffect, useState } from "react"
import { loader } from "../components/UI/Loader"
import PageService from "../services/pageService"
import customToast from "../utils/toast"
import { MESSAGE, MAXIMUM_PAGES_NUMBER } from "../utils/constants"
import get from "lodash/get"
import RealtimeService from "../services/realtimeService"

export const usePage = (listPages, socketId, channel) => {
    const [pages, setPages] = useState([...listPages])

    useEffect(() => {
        channel.bind("page", function (data) {
            if (socketId !== data.message.data.socketId) {
                setPages(data.message.data.listPages)
            }
        })
        return () => {
            channel.unbind("page")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const createPage = async ({ docId, pageName }) => {
        if (pages.length === MAXIMUM_PAGES_NUMBER) {
            customToast.error(MESSAGE.PAGES_NUMBER_REACH_MAXIMUM)
            return
        }
        loader.emit("start")
        const response = await PageService.createNewPage({
            documentId: docId,
            pageName: pageName,
        })
        loader.emit("stop")

        if (response.error) {
            const {
                error: { message },
            } = response
            customToast.error(message)
            return
        }
        setPages([...pages, response.results])

        await RealtimeService.sendData("page", docId, {
            socketId: socketId,
            listPages: [...pages, response.results],
        })
        return get(response, "results.id", pages[pages.length - 1].id)
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
        await RealtimeService.sendData("page", docId, {
            socketId: socketId,
            listPages: pages.map((page) => {
                return page.id === selectedPageId ? response.results : page
            }),
        })
    }

    const deletePage = async ({ docId, pageId }) => {
        loader.emit("start")
        const response = await PageService.deletePage({
            documentId: docId,
            pageId: pageId,
        })
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
        customToast.success(get(response, "results.message"))
        await RealtimeService.sendData("page", docId, {
            socketId: socketId,
            listPages: newListPage,
            pageId: pageId,
        })
        return newListPage
    }

    return { pages, createPage, renamePage, deletePage, updatePages: setPages }
}
