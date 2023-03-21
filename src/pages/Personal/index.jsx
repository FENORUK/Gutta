import { PlusIcon } from "@heroicons/react/24/solid"
import React from "react"
import { useNavigate } from "react-router"
import { IconButton } from "../../components/UI/IconButton"
import { DefaultLayout } from "../../components/UI/Layout/DefaultLayout"
import DocumentService from "../../services/DocumentService"
import { DEFAULT_TITLE } from "../../utils/constants"
import customToast from "../../utils/toast"

export function Personal() {
    document.title = "Personal"
    const navigate = useNavigate()

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
        <>
            <DefaultLayout>
                <div className="pt-3 flex justify-between text-2xl">
                    Personal
                    <IconButton
                        className="bg-red-100 px-3"
                        onClick={handleCreate}
                    >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        New Document
                    </IconButton>
                </div>
                <div className="w-full h-full py-6"></div>
            </DefaultLayout>
        </>
    )
}
