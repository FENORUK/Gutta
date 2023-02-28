import { BrowserRouter, Route, Routes } from "react-router-dom"

import {Favorites} from "./pages/Favorites"
import {Personal} from "./pages/Personal"
import {Shared} from "./pages/Shared"
import {Recent} from "./pages/Recent"

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Personal />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/shared" element={<Shared />} />
                    <Route path="/recent" element={<Recent />} />
                    <Route path="*" element={<NoMatch />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

const NoMatch = () => {
    return <p>There's nothing here: 404!</p>
}

export default App
