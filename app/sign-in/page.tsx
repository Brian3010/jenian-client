'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { InputGroup, InputGroupInput } from '@/components/ui/input-group';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const signInSchema = z.object({
  username: z.email('Please enter a valid email'),
  // password: z.regex(/^(?=.{8,128}$)(?!.\s)(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[^\w\s]).$/),
  // password: z
  //   .string()
  //   .trim() // blocks leading/trailing spaces; if you want to allow them, remove this
  //   .min(8, 'Password must be at least 12 characters')
  //   .max(128, 'Password must be at most 128 characters')
  //   .refine(v => !/\s/.test(v), 'Password must not contain spaces')
  //   .refine(v => /[a-z]/.test(v), 'Password must include a lowercase letter')
  //   .refine(v => /[A-Z]/.test(v), 'Password must include an uppercase letter')
  //   .refine(v => /\d/.test(v), 'Password must include a number')
  //   .refine(v => /[^\w\s]/.test(v), 'Password must include a symbol'),
  password: z.string(),
});
type SignInValues = z.infer<typeof signInSchema>;

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = (signInData: SignInValues) => console.log(signInData);

  //TODO: create a form

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your username/email to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 flex-col">
              {/* <input {...register('username')} />
              <p>{errors.username?.message}</p> */}
              <div>
                <InputGroup>
                  <InputGroupInput placeholder="Enter your username" {...register('username')} />
                </InputGroup>
                <p>{errors.username?.message}</p>
              </div>

              <div>
                <InputGroup>
                  <InputGroupInput type="password" {...register('password')} />
                </InputGroup>
                <p>{errors.password?.message}</p>
              </div>

              {/* <input {...register('password')} />
              <p>{errors.password?.message}</p> */}
              <div>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </div>
        </CardContent>
        <CardFooter className="italic">Register route is in process</CardFooter>
      </Card>
    </div>
  );
}
