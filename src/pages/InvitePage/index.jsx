import { useEffect } from "react"
import { generatePath, useNavigate, useSearchParams } from "react-router-dom"
import DocumentService from "../../services/documentService"
import { loader } from "../../components/UI/Loader"
import { PATH } from "../../utils/constants"
import { pusher } from "../../lib"
import RealtimeService from "../../services/realtimeService"

export const InvitePage = () => {
    const [query] = useSearchParams()
    const navigate = useNavigate()

    useEffect(() => {
        const processInvite = async () => {
            const token = query.get("token")
            if (token === null) {
                navigate(PATH.NOT_FOUND)
                return
            }
            loader.emit("start")
            const response = await DocumentService.acceptShareDocument({
                token: token,
            })
            loader.emit("stop")
            if (response.error) {
                navigate(PATH.NOT_FOUND)
                return
            }
            const {
                results: { document_id },
            } = response

            pusher.subscribe(`channel-${document_id}`)
            const socketId = pusher.connection.socket_id
            await RealtimeService.sendData("userJoined", document_id, {
                socketId: socketId,
                action: "reload",
            })

            navigate(
                generatePath(PATH.DOCUMENT.DEFAULT, { docId: document_id })
            )
            return
        }
        processInvite()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return <></>
}
