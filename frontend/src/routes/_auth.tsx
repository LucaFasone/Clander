import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router'
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/toaster'
import { Mail, MailOpen } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getNotifyOptions } from '@/lib/api'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useState } from 'react'
import { useNotifications } from '@/hooks/useNotifications'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const Component = () => {
  const { user } = Route.useRouteContext()
  const { data, error } = useQuery(getNotifyOptions)
  const { rejectNotify, acceptNotify } = useNotifications(user.id)
  const [isOpen, setIsOpen] = useState(false)
  if (user.picture == null || user.picture?.substring(0, 16) === "https://gravatar") {
    user.picture = 'https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png?fit=500%2C500&ssl=1'
  }
  return (
    <>
      <Navbar>
        <Button variant='link' className="text-sm font-medium hover:underline underline-offset-4" onClick={
          (e) => {
            e.preventDefault();
            window.location.href = '/api/logout';
          }
        } >
          Logout
        </Button>
        <Button variant='ghost'>
          {!error && <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <div className="relative h-5 w-5">
                {data && data?.length > 0 ? <MailOpen className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
                {data && data?.length > 0 && (
                  <span className="absolute -top-[4px] -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {data && data?.length > 99 ? '99+' : data?.length}
                  </span>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <h3 className="font-medium leading-none">Notifiche</h3>
                <div className="grid gap-2">
                  {data && data?.length > 0 ? data.map((notification) => (
                    <div key={notification.notification.id} className={`p-2 rounded-lg bg-gray-100`}>
                      <h4 className="font-semibold">{notification.User.name} Vuole condividre con te {notification.Event.title}</h4>
                      <p className="text-sm text-gray-500">{notification.Event.description}</p>
                      <p className='text-sm text-gray-500'>{notification.Event.dateEnd ? new Date(notification.Event.date).toLocaleDateString() + ' - ' + new Date(notification.Event.dateEnd) : new Date(notification.Event.date).toLocaleDateString()}</p>
                      <p className='text-sm text-gray-500'>Permissions: {notification.notification.permissions}</p>
                      <div className='flex justify-end'>
                        <Button variant='link' className='text-xs font-medium text-red-600' onClick={(e) => rejectNotify(notification.notification.id).catch((e) => { alert(e) })}>Rifiuta</Button>
                        <Button variant='link' className='text-xs font-medium text-green-600' onClick={(e) => acceptNotify(notification.notification.id).catch((e) => { alert(e) })}>Accetta</Button>
                      </div>
                    </div>
                  )) : "Nessuna notifica"}
                </div>
                <Button onClick={() => {
                  setIsOpen(false)
                }}>
                  Chiudi
                </Button>
              </div>
            </PopoverContent>
          </Popover>}
        </Button>
        <Popover >
          <PopoverTrigger asChild>
             <Avatar className="h-8 w-8">
              <AvatarImage src={user.picture} alt={user.family_name} />
              <AvatarFallback>{user.family_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-black text-white p-4 rounded-lg">
            <div className="flex items-center space-x-4 mb-4">
              <div>
                <h2 className="text-xl font-semibold">{user.given_name}</h2>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-sm">{user.email}</p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </Navbar >
      <Outlet />
      <Toaster />
    </>
  )
}

export const Route = createFileRoute('/_auth')({
  beforeLoad: async ({ context }) => {
    try {
      const { user } = await context.authentication
      if (!user) {
        throw redirect({ to: '/LandingPage' })
      }
      return { user }

    } catch (err) {
      throw redirect({ to: '/LandingPage' })

    }
  },
  component: Component
})


