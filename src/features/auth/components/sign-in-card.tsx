"use client"
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { DottedSeparator } from "@/components/dotted-separator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignInFormSchema } from '@/schema';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useLogin } from '../api/use-login';
import Link from 'next/link';
import { signUpWithGithub, signUpWithGoogle } from '@/lib/oauth';

export const SignInCard = () => {
  const { mutate, isPending } =  useLogin()
  const form = useForm<z.infer<typeof SignInFormSchema>>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const onSubmit = (values: z.infer<typeof SignInFormSchema>) => {
    mutate({ json: values })
  }

  return (
    <Card className="w-full h-full md:w-[487px] border-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">
          Welcome back!
        </CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField name="email" control={form.control} render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input disabled={isPending} type="email" placeholder="Enter your email"  {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="password" control={form.control} render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input disabled={isPending} type="password" placeholder="Enter your password"  {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button disabled={isPending} size="lg" className="w-full">Login</Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="flex flex-col p-7 gap-y-4">
        <Button onClick={() => signUpWithGoogle()} disabled={isPending} variant="secondary" size="lg" className="w-full"><FcGoogle className='mr-2 size-5' />Login with Google</Button>
        <Button onClick={() => signUpWithGithub()} disabled={isPending} variant="secondary" size="lg" className="w-full"><FaGithub className='mr-2 size-5' />Login with GitHub</Button>
      </CardContent>
      <div className='px-7'>
        <DottedSeparator />
      </div>
      <CardContent className='flex items-center justify-center p-7'>
        <p>Don&apos;t have an account?</p>
        <Link href="/sign-up"><span className='text-violet-700'>&nbsp;Sign Up</span></Link>
      </CardContent>
    </Card>
  )
}
