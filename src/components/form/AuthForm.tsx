'use client'

import { z } from 'zod'
import React from 'react'
import { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '../ui/form'
import { auth, AuthResponse } from '@/lib/authClient'

interface AuthFormProps {
  pageName: string
}

const formSchema = z.object({
  email: z.email({ message: 'Enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
})

const AuthForm = ({ pageName }: AuthFormProps) => {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {

    const action = pageName.toLowerCase().replace(" ", "");

    try {
      let res: AuthResponse;

      if (action === "signup") {
        res = await auth.signUp(values.email, values.password) as AuthResponse;
        
        if (res.error) {
          form.setError("email", { message: res.error || "Signup failed" });
          return;
        }

        router.push("/signin");

      } else if (action === "signin") {
        res = await auth.signIn(values.email, values.password) as AuthResponse;

        if (!res.success) {
          form.setError("password", { message: res.error || "Signin failed" });
          return;
        }

        router.push("/");

      } else {
        form.setError("root", { message: "Unknown action. Redirecting..." });
        router.push("/signin");
      }

    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.error || "Authentication failed.";
        form.setError("root", { message }); 
      } else if (error instanceof Error) {
        form.setError("root", { message: error.message });
      } else {
        form.setError("root", { message: "An unknown error occurred." });
      }
    }
  };

  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  We will never share your email.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Must be at least 6 characters long.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <Button type="submit" className="w-full">
            {pageName}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default AuthForm
