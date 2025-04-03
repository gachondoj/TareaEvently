import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, lastName, email } = await req.json();

    if (!name || !lastName || !email) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    const existingBuyer = await prisma.buyer.findUnique({ where: { email } });

    if (existingBuyer) {
      return NextResponse.json({ error: "El email ya está registrado" }, { status: 409 });
    }

    const newBuyer = await prisma.buyer.create({
      data: { name, lastName, email },
    });

    return NextResponse.json(newBuyer, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}