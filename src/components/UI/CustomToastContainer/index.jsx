import { ToastContainer } from "react-toastify"
import React from "react"
export const CustomToastContainer = () => {
    return (
        <ToastContainer
            position="top-right"
            autoClose={500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />
    )
}
