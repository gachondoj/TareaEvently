import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

export default async function Events() {

  const events = await prisma.event.findMany();

    return (
      <div className="justify-items-center flex flex-col justify-between min-h-screen font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] p-5 items-center sm:items-start w-full">
            <div className="text-[#a855f7] font-bold">EVENTOS</div>

            <div className="grid grid-cols-3 gap-y-5 gap-x-5">
              {events.map((event) => (
                <Button key={event.id} asChild disabled={event.availableRoom == 0} className="h-[5rem] w-[25rem] hover:bg-[#9378ff] bg-[#a855f7]">
                    <a href={`/events/${event.id}`} className="flex flex-col items-start">
                      <h2>{event.title}</h2>
                      <div className="flex justify-between w-full">
                        <p>📅 {new Date(event.date).toLocaleDateString()}</p>
                        <p>💰 Precio: ${event.price}</p>
                      </div>
                  </a>
                </Button>
              ))}
            </div>
        </main>
        <footer className="w-full flex justify-end pb-5 px-5">
          <Button asChild>
            <a href="/">
              Volver
            </a>
          </Button>
        </footer>
      </div>
    )
}