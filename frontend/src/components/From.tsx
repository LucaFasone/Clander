
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodValidator } from '@tanstack/zod-form-adapter'
import { createEvent, formType, shareEvent } from './../../../sharedTypes.ts'
import { Field, useForm } from '@tanstack/react-form';
import { Button } from './ui/button.tsx';
import { useEvents } from '@/hooks/useEvents.ts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { sendNotifyForShare } from '@/lib/api.ts';
import { CalendarIcon, PlusCircle } from 'lucide-react';
import { Textarea } from './ui/textarea.tsx';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover.tsx';
import { format, isEqual } from 'date-fns';
import { Calendar } from './ui/calendar.tsx';
import { useEffect, useState } from 'react';
import { Event } from '@/lib/types.ts';
import { useToast } from '@/hooks/use-toast.ts';

type FromProps = formType & {
  isSharing?: boolean;
  reset: any
};

function Form({ date, dateEnd, reset, currentMonth, title, description, activeReminder, eventId, isSharing, currentYear }: FromProps) {
  //const { addEvent, updateEventAndRefreshData } = useEvents(currentMonth || new Date().getMonth());

  const [dateForm, setDate] = useState<{ from: Date; to?: Date }>()
  const [userEmail, setUserEmail] = useState<boolean>(false)
  const { addEvent, updateEventMutation } = useEvents(currentMonth || new Date().getMonth(), currentYear || new Date().getFullYear());
  const { toast } = useToast()

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      date: dateForm,
      activeReminder: false,
      userSharedEvent: "",
      permissions: ""
    },
    async onSubmit({ value }) {
      const Event: Event = {
        title: value.title,
        description: value.description,
        date: value.date?.from || dateForm?.from!,
        dateEnd: value.date?.to || dateForm?.to,
        activeReminder: value.activeReminder,
      }
      try {
        if (isSharing && eventId) {
          await sendNotifyForShare(eventId, value.userSharedEvent, value.permissions)
          toast({
            title: "Message sent successfully",
          })
        }
        if (!eventId) {
          await addEvent(Event)
          toast({
            title: "Added Event successfully",
          })
        }
        if (!isSharing && eventId) {
          updateEventMutation(eventId, Event)
          toast({
            title: "Updated Event successfully",
          })
        }

      } catch (err) {
        alert(err);
      }
      window.scrollTo(0, 0)
      form.reset()
      reset()
      setDate(undefined)
      setUserEmail(false)
    }
  });

  useEffect(() => {
    if (eventId && !isSharing) {
      setDate({ from: date!, to: dateEnd || undefined });
      form.setFieldValue('title', title || "");
      form.setFieldValue('description', description || "");
      form.setFieldValue('activeReminder', activeReminder || false);
    }
  }, [])



  return (
    <form className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}>
      {!isSharing &&
        <>
          <div className="space-y-2">
            <Label htmlFor="title">Titolo Evento</Label>
            <form.Field
              name='title'
              validatorAdapter={zodValidator()}
              validators={{
                onChange: createEvent.shape.title
              }}
              children={(field) => {
                return (
                  <div>
                    <Input id="title" placeholder="Inserisci il titolo dell'evento" onChange={(e) => field.handleChange(e.target.value)} value={form.getFieldValue('title')} />
                    {field.state.meta.errors ? (
                      <em role="alert">{field.state.meta.errors.join(', ')}</em>
                    ) : null}
                  </div>
                )
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Intervallo Date Evento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={`w-full justify-start text-left font-normal ${!dateForm && "text-muted-foreground"}`}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateForm?.from ? (
                    dateForm.to ? (
                      <>
                        {format(dateForm.from, "d MMMM yyyy")} - {format(dateForm.to, "d MMMM yyyy")}
                      </>
                    ) : (
                      format(dateForm.from, "d MMMM yyyy")
                    )
                  ) : (
                    <span>Seleziona una data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <form.Field
                  name='date'
                  children={(field) => {
                    return (
                      <Calendar
                        initialFocus
                        mode="range"
                        selected={dateForm}
                        onSelect={(value) => { field.handleChange(value); setDate(value) }}
                        numberOfMonths={2}
                      />
                    )
                  }}
                />

              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrizione Evento</Label>
            <form.Field
              name='description'
              children={(field) => {
                return (
                  <Textarea id="description" placeholder="Inserisci la descrizione dell'evento" onChange={(e) => { field.handleChange(e.target.value) }} value={form.getFieldValue('description')} />
                )
              }}
            />
          </div>
          <div className="space-y-2 flex items-center">
            <form.Field
              name="activeReminder"
              children={(field) => (
                <input
                  type="checkbox"
                  id="reminder"
                  className="rounded border-gray-300 text-primary focus:ring-primary mr-2 "
                  onChange={(e) => field.handleChange(e.target.checked)}
                  checked={form.getFieldValue('activeReminder')}
                />
              )}
            />
            <Label htmlFor='reminder' className='!mt-0'>
              Reminder
            </Label>
          </div>
        </>
      }

      {isSharing && <div className="space-y-0.5">
        <Label htmlFor="sharedWith">Condividi con (email)</Label>
        <form.Field
          name='userSharedEvent'
          validatorAdapter={zodValidator()}
          validators={{
            onChange: ({ value }) => {
              if (value === "") {
                return undefined;
              }
              return shareEvent.shape.sharedToEmail.safeParse(value).success
                ? undefined
                : 'Email non valida';
            },
          }}
          children={(field) => {
            return (
              <div>
                <Input id="sharedWith" type="email" placeholder="Inserisci l'email con cui condividere" onChange={(e) => { field.handleChange(e.target.value); e.target.value ? setUserEmail(true) : setUserEmail(false) }} />
                {field.state.meta.errors ? (
                  <em role="alert">{field.state.meta.errors.join(', ')}</em>
                ) : null}
              </div>
            )
          }}
        />
      </div>}

      {userEmail && isSharing && <div className="space-y-0.5">
        <Label>
          Permessi
        </Label>
        <form.Field
          name="permissions"
          validatorAdapter={zodValidator()}
          validators={
            {
              onChange: ({ value }) => value == "" ? 'scegli un permesso' : undefined
            }
          }
          children={(field) => (
            <div>
              <Select
                onValueChange={(e) => field.handleChange(e)}>
                <SelectTrigger className="w-[180px] mb-3">
                  <SelectValue placeholder="Permissions" />
                </SelectTrigger>
                <SelectContent >
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="view">Only view</SelectItem>
                  <SelectItem value="modify">Modify</SelectItem>
                  <SelectItem value="sharable">Share</SelectItem>
                </SelectContent>
              </Select>
              {field.state.meta.errors ? (
                <em role="alert">{field.state.meta.errors.join(', ')}</em>
              ) : null}
            </div>
          )}
        />
      </div>}

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <Button type="submit" className='w-full' disabled={!canSubmit}>
            {isSharing? <PlusCircle className="w-4 h-4 mr-2" /> : ""}
            {isSubmitting ? '...' : eventId ? isSharing ? 'Invia richiesta di condivisione' : 'Modifica evento' : 'Crea Evento'}
          </Button>

        )}
      />

    </form>
  )
}

export default Form           