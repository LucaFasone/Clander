import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, deleteEventById, getAllSingleDayEvent, updateEvent, ws } from '@/lib/api';
import type { Event } from '@/lib/types';

export function useEvents(month: number, year: number) {
  const queryClient = useQueryClient();
  const getAllEventQueryOptions = (month: number, year: number) => queryOptions({
    queryKey: ['get-all-single-day-event', month, year],
    queryFn: () => getAllSingleDayEvent(month, year),
    staleTime: Infinity
  })
  const query = useQuery(getAllEventQueryOptions(month, year))
  const getAllEventQueryKey = getAllEventQueryOptions(month, year).queryKey;

  const sortEventsByDate = (events: any[]) => {
    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };
  const updateMutation = useMutation({
    //in all of this code is intedent to not use queryClient.invalidateQuery/refetchQueries bc i just wanted to update the Cache and not refetch the data from the server
    //this should be faster but the code is more verbose and harder to read/maintain
    mutationFn: updateEvent,
    onSuccess: (data, variables) => {
      const updatedMonth = variables.Event.date.getMonth();
      const updatedYear = variables.Event.date.getFullYear();
      queryClient.setQueryData(['get-all-single-day-event', month, year], (oldData: any) => {
        if (!oldData) return oldData;
        const currentMonth = new Date(oldData.events[0]?.date).getMonth();
        const currentYear = new Date(oldData.events[0]?.date).getFullYear();

        if (updatedMonth !== currentMonth || updatedYear !== currentYear) {
          const updatedEvents = oldData.events.filter((event: any) => event.id !== variables.Id);
          return {
            ...oldData,
            events: sortEventsByDate(updatedEvents)
          };
        }
        const updatedEvents = oldData.events.map((event: any) => {
          if (event.id === variables.Id) {
            return {
              ...event,
              date: variables.Event.date,
              dateEnd: variables.Event.dateEnd ?? null,
              title: variables.Event.title,
              activeReminder: variables.Event.activeReminder,
              description: variables.Event.description,
            };
          }
          return event;
        })
        return {
          ...oldData,
          events: sortEventsByDate(updatedEvents)
        }
      });

      if (updatedMonth !== month || updatedYear !== year) {
        queryClient.setQueryData(['get-all-single-day-event', updatedMonth, updatedYear], (oldNewMonthData: any) => {
          if (!oldNewMonthData) return oldNewMonthData;
          return {
            ...oldNewMonthData,
            events: sortEventsByDate([
              ...oldNewMonthData.events,
              {
                id: variables.Id,
                date: variables.Event.date,
                dateEnd: variables.Event.dateEnd ?? null,
                title: variables.Event.title,
                activeReminder: variables.Event.activeReminder,
                description: variables.Event.description,
              },
            ]),
          };
        });
      }
      const wsMessage = JSON.stringify(
        {
          type: "update",
          eventId: variables.Id,
          event: Event,
          month: new Date(variables.Event.date).getMonth(),
          year: new Date(variables.Event.date).getFullYear()
        }
      );

      ws.send(wsMessage);
    },
    onError: (error) => {
      console.error("Failed to update event:", error);
      alert("Errore durante l'aggiornamento dell'evento. Riprova.");
    },
  });


  const addEvent = async (event: Event) => {
    const res = await api.calendar.event.$post({ json: event });
    if (!res.ok) {
      throw new Error('Evento non aggiunto');
    }
    const data = await res.json()
    const existingEvent = await queryClient.ensureQueryData(getAllEventQueryOptions(event.date.getMonth(), event.date.getFullYear()));
    queryClient.setQueryData(getAllEventQueryOptions(event.date.getMonth(), event.date.getFullYear()).queryKey, ({
      ...existingEvent,
      events: [...existingEvent.events, data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }));

  };
  const updateEventMutation = (Id: number, Event: Event) => {
    updateMutation.mutate({ Id: Id, Event: Event });

  };

  return { query, addEvent, getAllEventQueryKey, updateEventMutation, getAllEventQueryOptions };
}
