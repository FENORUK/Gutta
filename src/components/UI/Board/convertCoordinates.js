import { GRID_SIZE, MIN_HEIGHT, MIN_WIDTH } from "../../../utils/constants"
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
