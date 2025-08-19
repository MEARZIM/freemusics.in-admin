"use client"

import * as z from "zod";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash } from "lucide-react"
import { Mood } from "@prisma/client"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";

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
import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import AlertModal from "@/components/modals/AlertModal";


interface MoodFormProps {
    initialData: Mood | null
}

const formSchema = z.object({
    name: z.string().min(1),
})

type MoodFormValues = z.infer<typeof formSchema>

export const MoodForm = ({ initialData }: MoodFormProps) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit mood" : "Create mood";
    const description = initialData ? "Edit a mood" : "Add a new mood";
    const toastMsg = initialData ? "mood updated." : "mood created.";
    const action = initialData ? "Save Changes" : "Create";

    const [isClient, setIsClient] = useState(false)




    const form = useForm<MoodFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
        }
    });

    const onSubmit = async (data: MoodFormValues) => {
        try {

            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/moods/${params.moodId}`, data);
            } else {
                await axios.post(`/api/moods`, data);
            }
            router.push(`/moods`);
            router.refresh();
            toast.success(toastMsg);

        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }

    }

    const onDelete = async () => {
        try {

            setLoading(true);
            await axios.delete(`/api/moods/${params.moodId}`);
            router.push(`/moods`);
            router.refresh();
            toast.success("mood Deleted.");

        } catch (error) {
            toast.error("Make sure you remove all Products using this mood first.");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient)
        return null;

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex justify-between items-center">
                <Heading
                    title={title}
                    description={description}
                />
                {initialData && (
                    <Button
                        disabled={loading}
                        variant="destructive"
                        size="icon"
                        onClick={() => { setOpen(true) }}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Separator />

            {/* Form */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">

                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Mood Name" disabled={loading} {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display mood Name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="ml-auto"
                    >
                        {action}
                    </Button>
                </form>
            </Form>
            <Separator />


        </>
    )
}