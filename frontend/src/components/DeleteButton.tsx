import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { deleteEventById, revokeEventForUser } from "@/lib/api";
import { useEvents } from "@/hooks/useEvents";
import { useToast } from "@/hooks/use-toast";
import { DatabaseEvents } from "@/lib/types";

//TODO: Put this in useEvents

export default function DeleteButton({ Id, currentMonth, resetSelection, revokingShareEvent,resetReveoke }: { Id: number, resetSelection: () => void, currentMonth: Date, revokingShareEvent: DatabaseEvents,resetReveoke:any }) {
    const queryClient = useQueryClient();
    const { toast } = useToast()
    const month = currentMonth.getMonth();
    const year = currentMonth.getFullYear();
    const { getAllEventQueryKey } = useEvents(month, year);
    const mutation = useMutation({
        mutationFn: deleteEventById,
        onSuccess: () => {
            queryClient.setQueryData(getAllEventQueryKey,
                (event) => ({
                    ...event,
                    events: event!.events?.filter((e) => e.id !== Id),
                }))
            resetSelection()
            toast({
                title: "Deleted Event successfully",
            })
        },
        onError: () => {
            alert("Errore durante l'eliminazione dell'evento")
            resetSelection()
        }
    })

    const revokeShare = async (Id: number, currentMonth: Date) => {
        const { success } = await revokeEventForUser(Id, currentMonth.getMonth(), currentMonth.getFullYear())
        if (success) {
            toast({
                title: "Event revoked successfully",
            })
            resetReveoke()
        } else {
            alert("Error Try again")
        }


    }

    return (
        <Button
            variant="destructive"
            onClick={() => revokingShareEvent ? revokeShare(revokingShareEvent.id, new Date(revokingShareEvent?.date)) 
                : mutation.mutate({ Id, currentMonth: month, year})}
            disabled={mutation.isPending}
        >Elimina Evento
        </Button>

    )

}