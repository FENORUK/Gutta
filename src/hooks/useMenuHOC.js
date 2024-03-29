import { useState } from "react"

export const useMenuHOC = ({ Menu, defaultOptions }) => {
    const [menu, setMenu] = useState(undefined)
    const defaultMenuOptions = {
        targetId: "",
        triggerId: "",
    }
    const [menuOptions, setMenuOptions] = useState(defaultMenuOptions)

    const create = ({ targetId, triggerId, options }) => {
        if (!targetId || !triggerId) return
        const $targetEl = document.getElementById(targetId)
        const $triggerEl = document.getElementById(triggerId)

        if (!$targetEl || !$triggerEl) return {}

        const newMenu = new Menu($targetEl, $triggerEl, {
            ...defaultOptions,
            ...options,
        })
        return newMenu
    }
    const trigger = ({ targetId, triggerId, options = {} }) => {
        if (
            triggerId === menuOptions.triggerId &&
            targetId === menuOptions.targetId
        ) {
            menu.show()
            return
        }
        setMenuOptions({
            targetId: targetId,
            triggerId: triggerId,
        })
        const newMenu = create({
            targetId: targetId,
            triggerId: triggerId,
            options: options,
        })
        newMenu.show()
        setMenu(newMenu)
    }
    const clearMenu = () => {
        setMenu(undefined)
        setMenuOptions(defaultMenuOptions)
    }
    return { menu, trigger, clearMenu }
}
