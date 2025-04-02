import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") || "";
    const today = new Date();
    today.setHours(0, 0, 0, 0)
  
    const events = await prisma.event.findMany({
      where: {
        title: {
          contains: title,
          mode: "insensitive",
        },
        date: {
          gt: today, // Filtra eventos con fecha mayor a hoy
        },
        availableRoom: {
          gt: 0, // Solo eventos con cupos disponibles
        },
      },
      orderBy: {
        date: "asc", // Ordenar por fecha ascendente
      },
    });
  
    return NextResponse.json(events);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al obtener los eventos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, date, price, room, availableRoom, state } = body;

    if (!title || !description || !date || !price || !room || !availableRoom) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    }
    const newEvent = await prisma.event.create({
      data: { title, description, date: new Date(date), price, room, availableRoom, state },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al crear el evento" }, { status: 500 });
  }
}