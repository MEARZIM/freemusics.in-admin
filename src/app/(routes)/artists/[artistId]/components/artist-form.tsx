"use client"

import * as z from "zod";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash } from "lucide-react"
import { Artist } from "@prisma/client"
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


interface ArtistsFormProps {
    initialData: Partial<Artist | null>
}

const formSchema = z.object({
    name: z.string().min(1),
    email: z.email().max(100, "Lenghth exceede"),
    password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
})

type ArtistsFormValues = z.infer<typeof formSchema>

export const ArtistsForm = ({ initialData }: ArtistsFormProps) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit artist" : "Create artist";
    const description = initialData ? "Edit a artist" : "Add a new artist";
    const toastMsg = initialData ? "artist updated." : "artist created.";
    const action = initialData ? "Save Changes" : "Create";

    const [isClient, setIsClient] = useState(false)


    const form = useForm<ArtistsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            email: '',
            password: ''
        }
    });

    const onSubmit = async (data: ArtistsFormValues) => {
        try {

            setLoading(true);
            if (initialData) {
                await instance.patch(`/artists/${params.artistId}`, data);
            } else {
                await instance.post(`/artists`, data);
            }
            router.push(`/artists`);
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
            await instance.delete(`/artists/${params.artistId}`);
            router.push(`/artists`);
            router.refresh();
            toast.success("artist Deleted.");

        } catch (error) {
            toast.error("Make sure you remove all Products using this artist first.");
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
                                        <Input placeholder="Artists Name" disabled={loading} {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display artist Name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email" disabled={loading} {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your artist email.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Password" disabled={loading} {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Leave blank to keep the same password.
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