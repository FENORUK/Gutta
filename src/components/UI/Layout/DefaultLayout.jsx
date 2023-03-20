import { SideBar } from "../SideBar"
import { DefaultHeader } from "../Header/DefaultLayout"

export const DefaultLayout = ({ children }) => {
    return (
        <div className="relative w-full h-full">
            <div className="h-full min-h-screen bg-gray-50">
                <SideBar />
            </div>
            <div className="absolute bg-white absolute top-0 right-0 h-full w-10/12 border border-gray-200 rounded-t-3xl">
                <div className="px-12">
                    <div className="border-b border-gray-200">
                        <DefaultHeader />
                    </div>
                    {children}
                </div>
            </div>
        </div>
    )
}
