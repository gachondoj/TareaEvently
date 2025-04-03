import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(_: NextRequest, { params }: any) {
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
    console.log(error)
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}