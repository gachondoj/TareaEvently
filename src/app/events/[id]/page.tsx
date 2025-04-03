'use client'

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { zodResolver } from "@hookform/resolvers/zod";

import { type Event } from "@prisma/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const firstStepSchema = z.object({
    amount: z.coerce.number().min(1),
})

const secondStepSchema = z.object({
    amount: z.coerce.number().min(1),
    email: z.string().email(),
})

const thirdStepSchema = z.object({
  name: z.string().min(1),
  lastName: z.string().min(1),
  amount: z.coerce.number().min(1),
  email: z.string().email(),
})

export default function Event() {
    const { id } = useParams();
    const [event, setEvent] = useState<Event>();
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState<'tickets' | 'email' | 'buyerData' | 'success' | 'error'>('tickets')

    const firstStepform = useForm<z.infer<typeof firstStepSchema>>({
      resolver: zodResolver(firstStepSchema),
      defaultValues: {
          amount: 0,
      },
    })

      const secondStepForm = useForm<z.infer<typeof secondStepSchema>>({
        resolver: zodResolver(secondStepSchema),
        defaultValues: {
            email: '',
        },
      })

      const thirdStepForm = useForm<z.infer<typeof thirdStepSchema>>({
        resolver: zodResolver(thirdStepSchema),
        defaultValues: {
            name: '',
            lastName: '',
        },
      })

    const onSubmitFirstStep = async (values: z.infer<typeof firstStepSchema>) => {
      secondStepForm.setValue('amount', values.amount)
      setStep('email')
    }

    const onSubmitSecondStep = async (values: z.infer<typeof secondStepSchema>) => {

      const buyerRes = await fetch(`/api/buyer/${encodeURIComponent(values.email)}`);
      
      if (buyerRes.status == 404) {
        setStep('buyerData')
        thirdStepForm.setValue('email', values.email)
        thirdStepForm.setValue('amount', values.amount)

      } else {
        if (!event) return

        const buyerData = await buyerRes.json()

        const tickets = Array.from({length: values.amount}, () => ({ eventId: event.id, buyerId: parseInt(buyerData.id) }))

        const ticketRes = await fetch("/api/tickets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tickets }),
        });

        if (ticketRes.ok) {
          setStep('success')
        } else {
          setStep('error')
        }
      }
    }

    const onSubmitThirdStepForm = async (values: z.infer<typeof thirdStepSchema>) => {
      if (!event) return
      
      const {name, lastName, email } = values

      const buyerRes = await fetch("/api/buyers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, lastName, email }),
      });

      const buyerData = await buyerRes.json()

      const tickets = Array.from({length: values.amount}, () => ({ eventId: event.id, buyerId: parseInt(buyerData.id) }))

      const ticketRes = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tickets }),
      });

      
      if (ticketRes.ok) {
        setStep('success')
      } else {
        setStep('error')
      }

    }

    useEffect(() => {
        if (!id) return;
    
        const fetchEvent = async () => {
          const res = await fetch(`/api/events/${id}`);
          const data = await res.json();
          setEvent(data);
          setLoading(false);
        };
    
        fetchEvent();
      }, [id]);

    if (loading) return <p>Cargando...</p>;
    if (!event) return <p>Evento no encontrado</p>;

    return (
        <div className="justify-items-center flex flex-col justify-between min-h-screen font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-5 p-5 items-center justify-center w-full">
          <div className="text-[#a855f7] font-bold">Evento: {event.title}</div>
            {step == 'tickets' && 
            <Form {...firstStepform}>
                <form onSubmit={firstStepform.handleSubmit(onSubmitFirstStep)} className="space-y-8">
                    <FormField
                        control={firstStepform.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tickets</FormLabel>
                                <FormControl>
                                    <Input type='number' min={0} max={event.availableRoom} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="hover:bg-[#9378ff] bg-[#a855f7]">
                      Submit
                    </Button>
                </form>
            </Form>
            }

            {step == 'email' && 
            <Form {...secondStepForm}>
            <form onSubmit={secondStepForm.handleSubmit(onSubmitSecondStep)} className="space-y-8">
                <FormField
                    control={secondStepForm.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="hover:bg-[#9378ff] bg-[#a855f7]">
                  Submit
                </Button>
            </form>
            </Form>
            }

            {step == 'buyerData' && 
            <Form {...thirdStepForm}>
              <form onSubmit={thirdStepForm.handleSubmit(onSubmitThirdStepForm)} className="space-y-8">
                <FormField
                    control={thirdStepForm.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={thirdStepForm.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Apellido</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="hover:bg-[#9378ff] bg-[#a855f7]">
                  Submit
                </Button>
            </form>
            </Form>
            }

            {
              step == 'success' &&
              <div>La compra se ha completado con éxito.</div>
            }

            {
              step == 'error' &&
              <div>Hubo un error realizando tu compra. Por favor intenta denuevo más tarde.</div>
            }
            
        </main>
        <footer className="w-full flex justify-end pb-5 px-5">
          <Button asChild>
            <Link href="/events">
              Volver
            </Link>
          </Button>
        </footer>
        </div>
    )
}