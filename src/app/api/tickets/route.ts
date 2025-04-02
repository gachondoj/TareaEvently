import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { eventId, buyerId } = await req.json();

    if (!eventId || !buyerId) {
      return NextResponse.json({ error: "EventId y BuyerId son obligatorios" }, { status: 400 });
    }

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
    }

    const buyer = await prisma.buyer.findUnique({ where: { id: buyerId } });
    if (!buyer) {
      return NextResponse.json({ error: "Buyer no encontrado" }, { status: 404 });
    }

    if (event.availableRoom <= 0) {
      return NextResponse.json({ error: "No hay boletos disponibles" }, { status: 400 });
    }

    const ticket = await prisma.ticket.create({
      data: { eventId, buyerId },
    });

    await prisma.event.update({
      where: { id: eventId },
      data: { availableRoom: event.availableRoom - 1 },
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}