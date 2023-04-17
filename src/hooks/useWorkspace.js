import { useState } from "react"
import WorkspaceService from "../services/workspaceService"
import get from "lodash/get"
import { loader } from "../components/UI/Loader"
import customToast from "../utils/toast"

export const useWorkspace = () => {
    const [workspaces, setWorkspaces] = useState(undefined)

    const fetchWorkspaces = async () => {
        const response = await WorkspaceService.getAllWorkspace()
        if (response.error) {
            const {
                error: { message },
            } = response
            customToast.error(message)
            return
        }
        const { results: listWorkspaces } = response
        setWorkspaces(listWorkspaces)
        return listWorkspaces
    }

    const createWorkspace = async (workspaceName) => {
        loader.emit("start")
        const response = await WorkspaceService.createNewWorkspace({
            name: workspaceName,
        })
        loader.emit("stop")
        if (response.error) {
            const {
                error: { message },
            } = response
            customToast.error(message)
            return
        }
        const { results: newWorkspace } = response
        setWorkspaces([...workspaces, newWorkspace])
        return newWorkspace.id
    }

    const renameWorkspace = async ({ workspaceId, newName }) => {
        loader.emit("start")
        const response = await WorkspaceService.updateWorkspace({
            workspaceId: workspaceId,
            data: { name: newName },
        })
        loader.emit("stop")
        if (response.error) {
            const {
                error: { message },
            } = response
            customToast.error(message)
            return
        }
        const { results: newWorkspace } = response
        customToast.success("Changed name successfully!")
        setWorkspaces(
            workspaces.map((item) => {
                return item.id === workspaceId ? newWorkspace : item
            })
        )
        return newWorkspace
    }

    const deleteWorkspace = async (workspaceId) => {
        loader.emit("start")
        const response = await WorkspaceService.deleteWorkspace(workspaceId)
        loader.emit("stop")

        if (response.error) {
            const {
                error: { message },
            } = response
            customToast.error(message)
            return
        }
        const newListWorkspaces = workspaces.filter(
            (workspace) => workspace.id !== workspaceId
        )
        setWorkspaces(newListWorkspaces)
        customToast.success(get(response, "results.message"))
    }

    return {
        workspaces,
        fetchWorkspaces,
        createWorkspace,
        renameWorkspace,
        deleteWorkspace,
    }
}
