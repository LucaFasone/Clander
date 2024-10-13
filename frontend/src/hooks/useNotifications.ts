import { addToSharedEvent, api, deleteNotify, getEventById } from "@/lib/api"
import { useQueryClient } from "@tanstack/react-query"

export const useNotifications = (userId: string) => {
    const queryClient = useQueryClient()
    const rejectNotify = async (Id: number) => {
        try {
            await deleteNotify(Id)
            queryClient.invalidateQueries({ queryKey: ['get-notification'] })
        } catch (err) {
            alert('Error')
            queryClient.invalidateQueries({ queryKey: ['get-notification'] })
        }
    }
    const acceptNotify = async (Id: number) => {
        try {
            const {success} = await addToSharedEvent(Id, userId)
            if (!success) {
                alert("Error sharing event")
                throw new Error("Error sharing event")
            }
            queryClient.invalidateQueries({ queryKey: ['get-notification'] })

        } catch (err) {
            alert(err)
            queryClient.invalidateQueries({ queryKey: ['get-notification'] })

        }

    }

    return { rejectNotify, acceptNotify }
}