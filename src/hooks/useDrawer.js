import { Drawer as FBDrawer } from "flowbite"
import { useEffect, useState } from "react"

const OPTIONS = { placement: "left" }

export const useDrawer = ({ id, shouldUpdate, options = {} }) => {
    const [drawer, setDrawer] = useState(undefined)

    useEffect(() => {
        const $targetEl = document.getElementById(id)
        if (!$targetEl) return
        const drawerInstance = new FBDrawer($targetEl, {
            ...OPTIONS,
            ...options,
        })
        setDrawer(drawerInstance)
    }, [id, shouldUpdate])

    return {
        drawer,
    }
}
