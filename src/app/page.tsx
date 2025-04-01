import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="justify-items-center flex flex-col justify-center min-h-screen font-[family-name:var(--font-geist-sans)]">
        <main className="flex gap-5 p-5 items-center justify-center w-full">
        <Button asChild className="hover:bg-[#9378ff] bg-[#a855f7]">
          <a href="/admin">Admin</a>
        </Button>
        <Button asChild className="hover:bg-[#9378ff] bg-[#a855f7]">
          <a href="/events">Eventos</a>
        </Button>
      </main>
    </div>
  );
}
