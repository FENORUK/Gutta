import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import axios from "axios"
import LoginPage from "./pages/Login"
import { CookiesProvider } from "react-cookie"
import { AuthGuard, PublicGuard } from "./components/Routes"
import { authLoader } from "./utils/loaders"
import { NoMatch } from "./pages/NoMatch"
import { Document } from "./pages/Document"
import "flowbite"
import { CustomToastContainer } from "./components/UI/CustomToastContainer"
import { LoadingBar } from "./components/UI/Loader"
import { Workspace } from "./pages/Workspace"
import { PATH } from "./utils/constants"
import { InvitePage } from "./pages/InvitePage"

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL

const router = createBrowserRouter([
    {
        path: PATH.DEFAULT,
        loader: authLoader,
        element: (
            <PublicGuard>
                <LoginPage />
            </PublicGuard>
        ),
    },
    {
        path: PATH.WORKSPACE.DEFAULT,
        loader: authLoader,
        element: (
            <AuthGuard>
                <Workspace />
            </AuthGuard>
        ),
    },
    {
        path: PATH.DOCUMENT.DEFAULT,
        loader: authLoader,
        element: (
            <AuthGuard>
                <Document />
            </AuthGuard>
        ),
    },
    {
        path: "/invite",
        loader: authLoader,
        element: (
            <AuthGuard>
                <InvitePage />
            </AuthGuard>
        ),
    },
    {
        path: "*",
        element: <NoMatch />,
    },
])

function App() {
    return (
        <div className="App">
            <LoadingBar />
            <CookiesProvider>
                <AuthProvider>
                    <RouterProvider router={router} />
                </AuthProvider>
            </CookiesProvider>
            <CustomToastContainer />
        </div>
    )
}

export default App
