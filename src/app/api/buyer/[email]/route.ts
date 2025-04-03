import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { email: string } }) {
  try {
    const email = decodeURIComponent(params.email); // Decodifica el email de la URL

    const buyer = await prisma.buyer.findUnique({
      where: { email },
    });

    if (!buyer) {
      return NextResponse.json({ error: "Buyer no encontrado" }, { status: 404 });
    }

    return NextResponse.json(buyer);
  } catch (error) {
    return NextResponse.json({ error: `Error en el servidor: ${error}` }, { status: 500 });
  }
}