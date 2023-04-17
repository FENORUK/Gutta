import { BLOCK_EXPAND, IMAGE_HEIGHT } from "../../../utils/constants"

import { extractBlockId } from "../../../helper/helper"
import RealtimeService from "../../../services/realtimeService"

export const addContent = (
    prevContents,
    { id, name, type, store_url, checked }
) => {
    return [
        ...prevContents,
        {
            id: id,
            name: name,
            position: prevContents.length,
            type: type,
            store_url: store_url,
            checked: checked,
        },
    ]
}

export const updateContent = (
    prevContents,
    { contentId, newName, newChecked, newUrl }
) => {
    return prevContents.map((content) => {
        if (content.id === contentId) {
            return {
                ...content,
                name: newName,
                checked: newChecked,
                store_url: newUrl,
            }
        }
        return content
    })
}

export const getCurrentMaxHeightBlock = ({ contentsCount, imagesCount }) => {
    return contentsCount + BLOCK_EXPAND + imagesCount * IMAGE_HEIGHT
}

export async function realTimeCreateContent({
    docId,
    socketId,
    blockId,
    listContents,
    height,
}) {
    await RealtimeService.sendData("createContent", docId, {
        socketId: socketId,
        blockId: extractBlockId(blockId),
        listContents: listContents,
        height: height,
    })
}
