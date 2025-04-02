'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"

import { type Event } from "@prisma/client";
import { useEffect, useState } from "react";

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");
  

  useEffect(() => {
    fetch(`/api/events?title=${search}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          setEvents([]);
        }
      })
      .catch(() => setEvents([]));
  }, [search]); 

    return (
      <div className="justify-items-center flex flex-col justify-between min-h-screen font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] p-5 items-center sm:items-start w-full">
            <div className="text-[#a855f7] font-bold">EVENTOS</div>

            <div className="w-full justify-end flex gap-x-1">
              <Label htmlFor="filter">Buscar por título:</Label>
              <Input id='filter' className="w-[25rem]" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-5 gap-x-5">
              {events && events.map((event) => (
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