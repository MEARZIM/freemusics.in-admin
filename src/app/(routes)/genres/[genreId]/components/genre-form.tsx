"use client"

import * as z from "zod";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash } from "lucide-react"
import { Genre } from "@prisma/client"
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
import instance from "@/lib/axios";


interface GenreFormProps {
    initialData: Genre | null
}

const formSchema = z.object({
    name: z.string().min(1),
})

type GenreFormValues = z.infer<typeof formSchema>

export const GenreForm = ({ initialData }: GenreFormProps) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit genre" : "Create genre";
    const description = initialData ? "Edit a genre" : "Add a new genre";
    const toastMsg = initialData ? "genre updated." : "genre created.";
    const action = initialData ? "Save Changes" : "Create";

    const [isClient, setIsClient] = useState(false)




    const form = useForm<GenreFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
        }
    });

    const onSubmit = async (data: GenreFormValues) => {
        try {

            setLoading(true);
            if (initialData) {
                await instance.patch(`/genres/${params.genreId}`, data);
            } else {
                await instance.post(`/genres`, data);
            }
            router.push(`/genres`);
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
            await instance.delete(`/genres/${params.genreId}`);
            router.push(`/genres`);
            router.refresh();
            toast.success("genre Deleted.");

        } catch (error) {
            toast.error("Make sure you remove all Products using this genre first.");
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
                                        <Input placeholder="genre Name" disabled={loading} {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display genre Name.
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