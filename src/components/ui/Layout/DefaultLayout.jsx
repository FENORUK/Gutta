import { SideBar } from "../SideBar"
import { DefaultHeader } from "../Header/DefaultLayout"

export const DefaultLayout = ({ children }) => {
    return (
        <div>
            <SideBar />
            <div className="sm:ml-0 top-0 h-14">
                <DefaultHeader />
            </div>
            <div className="py-2 ml-80 text-xl font-medium">{children}</div>
        </div>
    )
}
