import { Dropdown } from "flowbite"
import { useMenuHOC } from "./useMenuHOC"

export const useDropdown = () => {
    const defaultOptions = {
        placement: "bottom",
        offsetSkidding: 0,
        offsetDistance: 10,
        delay: 300,
    }
    const { menu: dropdown, trigger: triggerDropdown } = useMenuHOC({
        Menu: Dropdown,
        defaultOptions,
    })
    return { dropdown, triggerDropdown }
}
