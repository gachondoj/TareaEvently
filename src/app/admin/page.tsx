import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Admin() {
    return (
      <div className="justify-items-center flex flex-col justify-between min-h-screen font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] p-5 items-center sm:items-start w-full">
          <div className="text-[#a855f7] font-bold">ADMIN</div>

          <div className="flex gap-5 w-full justify-center">
            <Button asChild className="hover:bg-[#9378ff] bg-[#a855f7]">
              <Link href="/admin/events">Agregar Evento</Link>
            </Button>
            <Button asChild className="hover:bg-[#9378ff] bg-[#a855f7]">
              <Link href="/admin/tickets">Ver Tickets</Link>
            </Button>
          </div>
        </main>
        <footer className="w-full flex justify-end pb-5 px-5">
          <Button asChild>
            <Link href="/">
              Volver
            </Link>
          </Button>
        </footer>
      </div>
    )
}