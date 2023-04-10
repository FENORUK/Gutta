import { useState } from "react"
import { loader } from "../components/UI/Loader"
import DocumentService from "../services/documentService"
import customToast from "../utils/toast"
import { DEFAULT_TITLE } from "../utils/constants"
import { useEffect } from "react"
import _ from "lodash"

export const useDocument = () => {
    const [documents, setDocuments] = useState([])

    useEffect(() => {
        const fetchDocuments = async () => {
            loader.emit("start")
            const response = await DocumentService.getPersonalDocuments()
            loader.emit("stop")
            if (response.error) {
                const {
                    error: { message },
                } = response
                customToast.error(message)
                return
            }
            const { results: listDoc } = response
            setDocuments(listDoc)
        }
        fetchDocuments()
    }, [])

    const createDocument = async () => {
        loader.emit("start")
        const response = await DocumentService.createNewDocument({
            name: DEFAULT_TITLE,
        })
        loader.emit("stop")
        if (response.error) {
            const {
                error: { message },
            } = response
            customToast.error(message)
            return
        }
        return response
    }

    const deleteDocument = async ({ docId }) => {
        loader.emit("start")
        const response = await DocumentService.deleteDocument(docId)
        loader.emit("stop")

        if (response.error) {
            const {
                error: { message },
            } = response
            customToast.error(message)
            return
        }
        const newListDocuments = documents.filter(
            (document) => document.id !== docId
        )
        setDocuments(newListDocuments)
        customToast.success(_.get(response, "results.message"))
    }

    const renameDocument = async ({ docId, newName }) => {
        const document = documents.find((document) => document.id === docId)
        if (!newName || !document || newName === document.name) {
            return
        }
        loader.emit("start")
        const response = await DocumentService.updateDocument(docId, {
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
        customToast.success("Changed name successfully!")
        setDocuments(
            documents.map((item) => {
                return item.id === docId ? response.results : item
            })
        )
    }

    return { documents, createDocument, deleteDocument, renameDocument }
}
