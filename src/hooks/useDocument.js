import { useState } from "react"
import { loader } from "../components/UI/Loader"
import DocumentService from "../services/documentService"
import customToast from "../utils/toast"
import { DEFAULT_TITLE, PAGES } from "../utils/constants"
import get from "lodash/get"
import { MESSAGE } from "../utils/constants"

const PATH = {
    personal: "/personal",
    favorite: "/favourite",
    shared: "/share",
}

export const useDocument = () => {
    const [documents, setDocuments] = useState(undefined)

    const fetchDocuments = async (id) => {
        let path = get(PATH, `${id}`, `?workspace_id=${id}`)

        loader.emit("start")
        const response = await DocumentService.getDocuments(path)
        loader.emit("stop")
        if (response.error) {
            customToast.error(
                get(response, "error.message", MESSAGE.DEFAULT_ERROR)
            )
            return
        }
        const listDoc = get(response, "results", [])
        setDocuments(listDoc)
    }

    const createDocument = async (id) => {
        let data = {
            name: DEFAULT_TITLE,
        }
        if (!get(PAGES, `${id}`)) {
            data.workspace_id = id
        }
        loader.emit("start")
        const response = await DocumentService.createNewDocument(data)
        loader.emit("stop")
        if (response.error) {
            customToast.error(
                get(response, "error.message", MESSAGE.DEFAULT_ERROR)
            )
            return
        }
        return response
    }

    const renameDocument = async ({ docId, newName }) => {
        loader.emit("start")
        const response = await DocumentService.updateDocument(docId, {
            name: newName,
        })
        loader.emit("stop")

        if (response.error) {
            customToast.error(
                get(response, "error.message", MESSAGE.DEFAULT_ERROR)
            )
            return
        }
        customToast.success("Changed name successfully!")
        setDocuments(
            documents.map((item) => {
                return item.id === docId ? response.results : item
            })
        )
    }

    const updateFavoriteDocument = async ({
        isFavouriteWorkspace,
        docId,
        isFavorite,
    }) => {
        const selectedDocument = documents.find(
            (document) => document.id === docId
        )
        if (!selectedDocument) return
        const response = await DocumentService.updateFavoriteDocument({
            documentId: docId,
            isFavorite: isFavorite,
        })
        if (response.error) {
            customToast.error(
                get(response, "error.message", MESSAGE.DEFAULT_ERROR)
            )
            return
        }
        const newSelectedDocument = {
            ...selectedDocument,
            ...{ favourite: isFavorite },
        }
        const newDocument = isFavouriteWorkspace
            ? documents.filter((document) => document.id !== docId)
            : documents.map((document) =>
                  document.id === docId ? newSelectedDocument : document
              )
        setDocuments(newDocument)
        return newSelectedDocument
    }

    const deleteDocument = async ({ docId }) => {
        loader.emit("start")
        const response = await DocumentService.deleteDocument(docId)
        loader.emit("stop")

        if (response.error) {
            customToast.error(
                get(response, "error.message", MESSAGE.DEFAULT_ERROR)
            )
            return
        }
        const newListDocuments = documents.filter(
            (document) => document.id !== docId
        )
        setDocuments(newListDocuments)
        customToast.success(get(response, "results.message"))
    }

    return {
        documents,
        fetchDocuments,
        createDocument,
        renameDocument,
        updateFavoriteDocument,
        deleteDocument,
    }
}
