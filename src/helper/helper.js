import { GRID_SIZE, MIN_HEIGHT, MIN_WIDTH } from "../utils/constants"
import { loader } from "../components/UI/Loader"
import BlockService from "../services/blockService"
import customToast from "../utils/toast"

export function extractValues(str) {
    const [first, last] = str.split("x")
    return [Number(first), Number(last)]
}

export const convertCoordinates = (startPoint, endPoint) => {
    const x = Math.min(startPoint.x, endPoint.x)
    const y = Math.min(startPoint.y, endPoint.y)
    const width = Math.round(Math.abs(endPoint.x - startPoint.x) / GRID_SIZE)
    const height = Math.round(Math.abs(endPoint.y - startPoint.y) / GRID_SIZE)

    const attributeBlock = {
        x: Math.round(x / GRID_SIZE),
        y: Math.round(y / GRID_SIZE),
        w: width <= MIN_WIDTH ? MIN_WIDTH : width,
        h: height <= MIN_HEIGHT ? MIN_HEIGHT : height,
    }

    return attributeBlock
}

export const handleUpdateBlock = async (oldItem, newItem) => {
    const updateBlock = oldItem.find((item) => item.i === newItem.i)

    loader.emit("start")
    const response = await BlockService.updateBlock(updateBlock.i, {
        position: String(`${updateBlock.x}x${updateBlock.y}`),
        size: String(`${updateBlock.w}x${updateBlock.h}`),
    })
    loader.emit("stop")
    if (response.error) {
        const {
            error: { message },
        } = response
        customToast.error(message)
        return
    }
}
