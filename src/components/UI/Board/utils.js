import { MIN_HEIGHT, MIN_WIDTH } from "../../../utils/constants"

const BLOCKS = [
    {
        id: "block1",
        x: 0,
        y: 0,
        width: 8,
        height: 8,
    },
    {
        id: "block2",
        x: 0,
        y: 10,
        width: 18,
        height: 8,
    },
    {
        id: "block3",
        x: 10,
        y: 0,
        width: 8,
        height: 10,
    },
]

export const getGridElements = () => {
    return BLOCKS.map(({ id, x, y, width, height }) => {
        return {
            i: id,
            x: x,
            y: y,
            w: width,
            h: height,
            minW: MIN_WIDTH,
            minH: MIN_HEIGHT,
        }
    })
}
