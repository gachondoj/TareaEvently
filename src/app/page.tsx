import { Button } from "@/components/ui/button"
import Link from "next/link";

export default function Home() {
  return (
    <div className="justify-items-center flex flex-col justify-center min-h-screen font-[family-name:var(--font-geist-sans)]">
        <main className="flex gap-5 p-5 items-center justify-center w-full">
        <Button asChild className="hover:bg-[#9378ff] bg-[#a855f7]">
          <Link href="/admin">Admin</Link>
        </Button>
        <Button asChild className="hover:bg-[#9378ff] bg-[#a855f7]">
          <Link href="/events">Eventos</Link>
        </Button>
      </main>
    </div>
  );
}
