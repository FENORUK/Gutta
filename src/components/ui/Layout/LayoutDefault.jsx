import SideBar from "../SideBar/SideBar"
import HeaderLayoutDefault from "../Header/HeaderLayoutDefault/HeaderDefault"

export const LayoutDefault = ({ children }) => {
    return (
        <div>
            <SideBar />
            <div className={"ml-[240px] top-0 h-14"}>
                <HeaderLayoutDefault />
            </div>
            <div className={"ml-[295px] py-2 text-xl font-medium"}>
                {children}
            </div>
        </div>
    )
}
