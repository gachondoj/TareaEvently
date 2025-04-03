'use client'

import { Prisma } from "@prisma/client";

import { useEffect, useState } from "react";
import { Ticket, columns } from "./columns"
import { DataTable } from "./data-table"


import { Button } from "@/components/ui/button";

type TicketWithDetails = Prisma.TicketGetPayload<{
    include: {
      event: { select: { title: true } };
      buyer: { select: { name: true; lastName: true; email: true } };
    };
  }>;

export default function Tickets() {
    const [data, setData] = useState<Ticket[]>([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
    
        const fetchEvent = async () => {
          const res = await fetch(`/api/tickets?page=${page}`);
          const data = await res.json();

          setTotalPages(data.totalPages)
        
          setData(data.tickets.map((ticket: TicketWithDetails) => ({
            id: ticket.id, 
            title: ticket.event.title, 
            purchaseDate: new Date(ticket.createdAt).toLocaleDateString(), 
            buyer: `${ticket.buyer.name} ${ticket.buyer.lastName}`,
            email: ticket.buyer.email,
        })));
        };
    
        fetchEvent();
      }, [page]);

    return (
      <div className="justify-items-center flex flex-col justify-between min-h-screen font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] p-5 items-center sm:items-start w-full">
          <div className="text-[#a855f7] font-bold">TICKETS</div>
          <div className=" flex flex-col w-full gap-y-3">
            <DataTable columns={columns} data={data} />
            <div className="flex items-center gap-x-1 justify-end w-full">
              <Button className="hover:bg-[#9378ff] bg-[#a855f7] h-6 p-0 w-6" disabled={page == 1} onClick={() => {
                setPage(page - 1)
              }}>{'<'}</Button>
              <p>Pagina {page} de {totalPages}</p>
              <Button className="hover:bg-[#9378ff] bg-[#a855f7] h-6 p-0 w-6" disabled={page == totalPages} onClick={() => {
                setPage(page + 1)
              }}>{'>'}</Button>
            </div>
          </div>
        </main>
        <footer className="w-full flex justify-end pb-5 px-5">
          <Button asChild>
            <a href="/admin">
              Volver
            </a>
          </Button>
        </footer>
      </div>
    )
}