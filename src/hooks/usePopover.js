import { Popover } from "flowbite"
import { useState } from "react"

export const usePopover = () => {
    const defaultOptions = {
        placement: "bottom",
        triggerType: "none",
        offset: 3,
    }

    const [popover, setPopover] = useState(undefined)
    const [popoverOptions, setPopoverOptions] = useState({
        targetId: "",
        triggerId: "",
    })

    const createPopover = ({ targetId, triggerId, options }) => {
        if (!targetId || !triggerId) return
        const $targetEl = document.getElementById(targetId)
        const $triggerEl = document.getElementById(triggerId)

        if (!$targetEl || !$triggerEl) return {}

        const newPopover = new Popover($targetEl, $triggerEl, {
            ...defaultOptions,
            ...options,
        })
        return newPopover
    }

    const triggerPopover = ({ targetId, triggerId, options = {} }) => {
        if (
            triggerId === popoverOptions.triggerId &&
            targetId === popoverOptions.targetId
        ) {
            popover.show()
            return
        }
        setPopoverOptions({
            targetId: targetId,
            triggerId: triggerId,
        })
        const newPopover = createPopover({
            targetId: targetId,
            triggerId: triggerId,
            options,
        })
        newPopover.show()
        setPopover(newPopover)
    }

    return { popover, triggerPopover }
}
