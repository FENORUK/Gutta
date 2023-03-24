import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import axios from "axios"
import LoginPage from "./pages/Login"
import { CookiesProvider } from "react-cookie"
import { Favorites } from "./pages/Favorites"
import { Personal } from "./pages/Personal"
import { Shared } from "./pages/Shared"
import { Recent } from "./pages/Recent"
import { AuthGuard, PublicGuard } from "./components/Routes"
import { authLoader } from "./utils/loaders"
import { NoMatch } from "./pages/NoMatch"
import { Document } from "./pages/Document"
import "flowbite"
import { CustomToastContainer } from "./components/UI/CustomToastContainer"
import { LoadingBar } from "./components/UI/Loader"

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL

const router = createBrowserRouter([
    {
        path: "/",
        loader: authLoader,
        element: (
            <AuthGuard>
                <Personal />
            </AuthGuard>
        ),
    },
    {
        path: "/login",
        loader: authLoader,
        element: (
            <PublicGuard>
                <LoginPage />
            </PublicGuard>
        ),
    },
    {
        path: "/favorites",
        loader: authLoader,
        element: (
            <AuthGuard>
                <Favorites />
            </AuthGuard>
        ),
    },
    {
        path: "/shared",
        loader: authLoader,
        element: (
            <AuthGuard>
                <Shared />
            </AuthGuard>
        ),
    },
    {
        path: "/recent",
        loader: authLoader,
        element: (
            <AuthGuard>
                <Recent />
            </AuthGuard>
        ),
    },
    {
        path: "/document/:docId",
        loader: authLoader,
        element: (
            <AuthGuard>
                <Document />
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
