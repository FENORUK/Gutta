import { BLOCK_EXPAND, IMAGE_HEIGHT } from "../../../utils/constants"

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
