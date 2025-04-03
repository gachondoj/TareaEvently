"use client"
 
import { ColumnDef } from "@tanstack/react-table"
 
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Ticket = {
  id: string
  title: string
  purchaseDate: string,
  buyer: string,
  email: string
}
 
export const columns: ColumnDef<Ticket>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Evento",
  },
  {
    accessorKey: "purchaseDate",
    header: "Fecha de compra",
  },
  {
    accessorKey: "buyer",
    header: "Comprador",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
]