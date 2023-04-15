import { Popover } from "flowbite"
import { useMenuHOC } from "./useMenuHOC"

export const usePopover = () => {
    const defaultOptions = {
        placement: "bottom",
        triggerType: "none",
        offset: 3,
    }

    const { menu: popover, trigger: triggerPopover } = useMenuHOC({
        Menu: Popover,
        defaultOptions,
    })

    return { popover, triggerPopover }
}
