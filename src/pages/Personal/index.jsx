import React from "react"
import { PlusIcon } from "@heroicons/react/24/solid"
import { useNavigate } from "react-router-dom"
import { IconButton } from "../../components/UI/IconButton"
import { DefaultLayout } from "../../components/UI/Layout/DefaultLayout"
import { PAGE_TITLES } from "../../utils/constants"
import { DefaultBody } from "../../components/UI/DefaultBody"
import { useDocument } from "../../hooks/useDocument"

export function Personal() {
    document.title = PAGE_TITLES.PERSONAL
    const navigate = useNavigate()
    const { documents, createDocument, renameDocument, deleteDocument } =
        useDocument()

    const handleCreate = async () => {
        const response = await createDocument()
        if (!response) return
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
                <DefaultBody
                    documents={documents}
                    renameDocument={renameDocument}
                    deleteDocument={deleteDocument}
                />
            </div>
        </DefaultLayout>
    )
}
