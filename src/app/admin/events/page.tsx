"use client";

import { format } from "date-fns"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"

const schema = z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date().refine(date => date >= new Date(), {
        message: "La fecha debe ser futura",
      }),
    price: z.coerce.number().min(1, "Debe ser mayor a 999"),
    room: z.coerce.number().min(1, "Debe ser mayor a 0"),
})

export default function CreateEvent() {

  const router = useRouter();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
        title: undefined,
        description: undefined,
        date: undefined,
        price: undefined,
        room: undefined,
    },
  })
 
  const onSubmit = async (values: z.infer<typeof schema>) => {
    const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, availableRoom: values.room }),
      });
  
      if (res.ok) {
        router.push("/events");
      } else {
        alert("Error al crear el evento");
      }
  }


    return (
    <div className="justify-items-center flex flex-col justify-center min-h-screen font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-5 p-5 items-center justify-center w-full">
            <div className="text-[#a855f7] font-bold">CREAR EVENTO</div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Título</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descripción</FormLabel>
                                <FormControl>
                                    <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fecha</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[240px] pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                        date < new Date()
                                        }
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Precio</FormLabel>
                                <FormControl>
                                    <Input type='number' min={1000} step={100} {...field}/>
                                </FormControl>
                                <FormDescription>{}</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="room"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cupos</FormLabel>
                                <FormControl>
                                    <Input type='number' min={1} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
            <Button type="submit" className="hover:bg-[#9378ff] bg-[#a855f7]">Crear</Button>
        </form>
            </Form>
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