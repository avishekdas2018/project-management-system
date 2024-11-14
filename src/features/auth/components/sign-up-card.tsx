"use client"
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { DottedSeparator } from "@/components/dotted-separator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { SignUpFormSchema } from '@/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useRegister } from '../api/use-register';
import { signUpWithGithub, signUpWithGoogle } from '@/lib/oauth';

export const SignUpCard = () => {
  const { mutate, isPending } = useRegister()
  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = (values: z.infer<typeof SignUpFormSchema>) => {
    mutate({json: values})
  }
  return (
    <Card className="w-full h-full md:w-[487px] border-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">
          Sign Up
        </CardTitle>
        <CardDescription>
          By signing up, you agree to our <span className='text-violet-700'><Link href="#" className="underline">Terms of Service</Link></span>  and <span className='text-violet-700'><Link href="#" className="underline">Privacy Policy</Link></span> .
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField name="name" control={form.control} render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="text" placeholder="Enter your name"  {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="email" control={form.control} render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="email" placeholder="Enter your email"  {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="password" control={form.control} render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="password" placeholder="Enter your password"  {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button type='submit' disabled={isPending} size="lg" className="w-full">Sign Up</Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="flex flex-col p-7 gap-y-4">
        <Button onClick={() => signUpWithGoogle()} disabled={isPending} variant="secondary" size="lg" className="w-full"><FcGoogle className='mr-2 size-5' />Login with Google</Button>
        <Button onClick={() => signUpWithGithub()}disabled={isPending} variant="secondary" size="lg" className="w-full"><FaGithub className='mr-2 size-5' />Login with GitHub</Button>
      </CardContent>
      <div className='px-7'>
        <DottedSeparator />
      </div>
      <CardContent className='flex items-center justify-center p-7'>
        <p>Already have an account?</p>
        <Link href="/sign-in"><span className='text-violet-700'>&nbsp;Sign In</span></Link>
      </CardContent>
    </Card>
  )
}