import { SideBar } from "../SideBar"
import { DefaultHeader } from "../Header/DefaultHeader"

export const DefaultLayout = ({
    children,
    workspaces,
    onWorkspaceMenuClicked,
    onWorkspaceAddButtonClicked,
}) => {
    return (
        <div className="w-full h-full bg-gray-50">
            <div className="h-screen w-2/12 bg-gray-50 fixed">
                <SideBar
                    workspaces={workspaces}
                    allowEditWorkspaces={true}
                    onWorkspaceMenuClicked={onWorkspaceMenuClicked}
                    onWorkspaceAddButtonClicked={onWorkspaceAddButtonClicked}
                />
            </div>
            <div className="fixed right-0 h-full w-10/12 bg-gray-50">
                <div className="fixed right-0 overflow-y-auto h-full min-h-screen w-10/12 border border-gray-100 rounded-t-3xl">
                    <div className="px-12 min-h-screen bg-white">
                        <div className="border-b border-gray-100 sticky top-px z-10">
                            <DefaultHeader />
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
