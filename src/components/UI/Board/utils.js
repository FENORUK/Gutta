import { GRID_SIZE } from "../../../utils/constants"

const BLOCKS = [
    {
        id: "block1",
        position: "0x0",
        size: "3x3",
    },
    {
        id: "block2",
        position: "7x7",
        size: "6x3",
    },
    {
        id: "block3",
        position: "10x0",
        size: "3x6",
    },
]

const getPosition = (position) => {
    const [x, y] = position.split("x")
    return [x * GRID_SIZE, y * GRID_SIZE]
}

export const getElements = () =>
    BLOCKS.reduce((accumulator, currentValue) => {
        let [x, y] = getPosition(currentValue.position)
        let [height, width] = getPosition(currentValue.size)
        accumulator[currentValue.id] = {
            position: { x: x, y: y },
            size: { width: width, height: height },
        }
        return accumulator
    }, {})

const convertToGrid = (data, delta_data) => {
    return Math.round(delta_data / GRID_SIZE) * GRID_SIZE + data
}

export const calculateCoordinate = ({
    position,
    delta,
    itemSize,
    min,
    max,
}) => {
    let newPosition = convertToGrid(position, delta)
    if (newPosition < min) return min
    if (newPosition + itemSize > max) return max - itemSize
    return newPosition
}
