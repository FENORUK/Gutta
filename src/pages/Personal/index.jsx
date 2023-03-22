import React, { useEffect, useState } from "react"
import { PlusIcon } from "@heroicons/react/24/solid"
import { useNavigate } from "react-router"
import { IconButton } from "../../components/UI/IconButton"
import { DefaultLayout } from "../../components/UI/Layout/DefaultLayout"
import DocumentService from "../../services/DocumentService"
import { DEFAULT_TITLE } from "../../utils/constants"
import customToast from "../../utils/toast"
import { DefaultBody } from "../../components/UI/DefaultBody"

export function Personal() {
    document.title = "Personal"
    const navigate = useNavigate()
    const [documentList, setDocumentList] = useState()
    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const {
                    data: { results: listDoc },
                } = await DocumentService.getPersonalDocuments()

                setDocumentList(listDoc)
            } catch (error) {
                customToast.error(error.message)
            }
        }
        fetchDocuments()
    }, [])

    const handleCreate = async () => {
        try {
            const {
                data: {
                    results: { id },
                },
            } = await DocumentService.createNewDocument({
                name: DEFAULT_TITLE,
            })

            navigate(`/document/${id}`)
        } catch (error) {
            customToast.error(error.message)
        }
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
