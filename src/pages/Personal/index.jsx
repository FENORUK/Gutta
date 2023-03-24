import React, { useEffect, useState } from "react"
import { PlusIcon } from "@heroicons/react/24/solid"
import { useNavigate } from "react-router-dom"
import { IconButton } from "../../components/UI/IconButton"
import { DefaultLayout } from "../../components/UI/Layout/DefaultLayout"
import DocumentService from "../../services/DocumentService"
import { DEFAULT_TITLE, PAGE_TITLES } from "../../utils/constants"
import customToast from "../../utils/toast"
import { DefaultBody } from "../../components/UI/DefaultBody"
import { loader } from "../../components/UI/Loader"

export function Personal() {
    document.title = PAGE_TITLES.PERSONAL
    const navigate = useNavigate()
    const [documentList, setDocumentList] = useState()
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
            setDocumentList(listDoc)
        }
        fetchDocuments()
    }, [])

    const handleCreate = async () => {
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
        const {
            results: { id },
        } = response
        navigate(`/document/${id}`)
    }

    return (
        <DefaultLayout>
            <div className="pt-3 pb-1.5 text-2xl sticky top-[58px] bg-white flex justify-between">
                Personal
                <IconButton
                    className="bg-red-100 hover:bg-red-300 px-3"
                    onClick={handleCreate}
                >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    New Document
                </IconButton>
            </div>
            <div className="w-full h-full py-6">
                <DefaultBody documents={documentList} />
            </div>
        </DefaultLayout>
    )
}
