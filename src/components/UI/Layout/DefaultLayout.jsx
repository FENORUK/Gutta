import { SideBar } from "../SideBar"
import { DefaultHeader } from "../Header/DefaultHeader"

export const DefaultLayout = ({ children }) => {
    return (
        <div className="w-full h-full bg-gray-50">
            <div className="h-screen w-2/12 bg-gray-50 fixed">
                <SideBar />
            </div>
            <div className="ml-auto bg-white h-full min-h-screen w-10/12 border rounded-t-3xl">
                <div className="px-12">
                    <div className="border-b-2 border-gray-200 sticky top-px z-10">
                        <DefaultHeader />
                    </div>
                    {children}
                </div>
            </div>
        </div>
    )
}
