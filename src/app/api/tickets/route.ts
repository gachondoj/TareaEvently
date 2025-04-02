import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { tickets } = await req.json();
    if (!Array.isArray(tickets) || tickets.length === 0) {
      return NextResponse.json({ error: "Se requiere una lista de tickets" }, { status: 400 });
    }

    const createdTickets = await prisma.$transaction(async (tx) => {
      return Promise.all(
        tickets.map(async ({ eventId, buyerId }) => {
          const event = await tx.event.findUnique({ where: { id: eventId } });

          if (!event) throw new Error(`Evento con ID ${eventId} no encontrado`);
          if (event.availableRoom <= 0) throw new Error(`Evento ${event.title} agotado`);

          const ticket = await tx.ticket.create({
            data: { eventId, buyerId },
          });

          await tx.event.update({
            where: { id: eventId },
            data: { availableRoom: event.availableRoom - 1 },
          });

          return ticket;
        })
      );
    });

    return NextResponse.json(createdTickets, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error en el servidor" }, { status: 500 });
  }
}