import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;

  const totalTickets = await prisma.ticket.count();

  const tickets = await prisma.ticket.findMany({
    skip,
    take: limit,
    include: {
      event: {
        select: { title: true },
      },
      buyer: {
        select: { name: true, lastName: true, email: true },
      },
    },
    orderBy: {
      id: "asc",
    },
  });

  return NextResponse.json({
    page,
    limit,
    totalPages: Math.ceil(totalTickets / limit),
    totalTickets,
    tickets,
  });
}

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
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error:  "Error en el servidor" }, { status: 500 });
  }
}