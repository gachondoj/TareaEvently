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