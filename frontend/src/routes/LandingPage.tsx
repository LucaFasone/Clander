import { createFileRoute, redirect } from '@tanstack/react-router'
import { Button } from "@/components/ui/button"
import { CalendarIcon, Users, Clock, Share2} from "lucide-react"


export const Route = createFileRoute('/LandingPage')({
  async beforeLoad({ context }) {
    const { user } = await context.authentication;
    if (user) {
      throw redirect({ to: '/' })
    }

  },
  component: LandingPage
})

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Gestisci i tuoi eventi con facilità
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Pianifica, organizza e condividi i tuoi eventi in un unico posto. Semplice, intuitivo e potente.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Button onClick={(e) =>{
                  e.preventDefault();
                  window.location.href = '/api/login';
                }}className='mr-2'>Login</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Caratteristiche principali
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-start">
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <CalendarIcon className="w-12 h-12 text-primary" />
                <h3 className="text-xl font-bold">Gestione Eventi</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Crea e gestisci facilmente eventi di qualsiasi tipo e dimensione.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Users className="w-12 h-12 text-primary" />
                <h3 className="text-xl font-bold">Collaborazione</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Condividi e collabora con il tuo team in tempo reale.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Clock className="w-12 h-12 text-primary" />
                <h3 className="text-xl font-bold">Promemoria [WIP]</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Ricevi notifiche e promemoria per non perdere mai un evento importante.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Share2 className="w-12 h-12 text-primary" />
                <h3 className="text-xl font-bold">Condivisione</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Condividi facilmente i tuoi eventi con partecipanti e ospiti.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 items-center">
              <div className="flex flex-col justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Inizia a gestire i tuoi eventi oggi stesso
                  </h2>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 mx-auto">
                    Unisciti a migliaia di organizzatori che hanno semplificato la loro gestione degli eventi.
                  </p>
                </div>
                <div className="w-full max-w-sm space-y-2 mx-auto">
                  <Button onClick={(e) => {
                    e.preventDefault();
                    window.location.href = '/api/register';
                  }}>Register</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Cosa dicono i nostri clienti
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-start">
              <div className="flex flex-col items-center space-y-2 border-gray-200 border p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  "Questo strumento ha rivoluzionato il modo in cui organizziamo i nostri eventi aziendali. Non potremmo farne a meno!"
                </p>
                <p className="font-semibold">Maria Bianchi</p>
                <p className="text-sm text-gray-500">CEO, TechCorp</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-200 border p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  "Facile da usare e ricco di funzionalità. Ha reso la pianificazione del nostro matrimonio un gioco da ragazzi."
                </p>
                <p className="font-semibold">Luca Rossi</p>
                <p className="text-sm text-gray-500">Cliente soddisfatto</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-200 border p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  "La collaborazione in tempo reale è fantastica. Il nostro team è più coordinato che mai."
                </p>
                <p className="font-semibold">Giulia Verdi</p>
                <p className="text-sm text-gray-500">Project Manager, EventPro</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 MIAO Clander Nessun diritto riservato.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Button variant={'link'} className="text-xs hover:underline underline-offset-4" >
            Termini di Servizio
          </Button>
          <Button variant={'link'} className="text-xs hover:underline underline-offset-4">
            Privacy
          </Button>
        </nav>
      </footer>
    </div>
  )
}

