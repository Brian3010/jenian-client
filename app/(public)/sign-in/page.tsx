'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { InputGroup, InputGroupInput } from '@/components/ui/input-group';
import { login } from '@/features/auth/services/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader, UndoIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const signInSchema = z.object({
  email: z.email('Please enter a valid email'),
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
  const router = useRouter();

  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (signInData: SignInValues) => {
    try {
      setIsLoading(true);
      const res = await login(signInData.email, signInData.password, 'local host');
      console.log('🚀 ~ onSubmit ~ res:', res);

      // After login succeeds, cookies are set.
      if (res.ok) {
        setError('');
        router.push('/dashboard');
      }
    } catch (err) {
      console.log('🚀 ~ onSubmit ~ err:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <Card className="w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email/email to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 flex-col">
              {/* <input {...register('email')} />
              <p>{errors.email?.message}</p> */}
              <div>
                <InputGroup>
                  <InputGroupInput placeholder="Enter your email" {...register('email')} />
                </InputGroup>
                <p>{errors.email?.message}</p>
              </div>
              <div>
                <InputGroup>
                  <InputGroupInput type="password" {...register('password')} />
                </InputGroup>
                <p>{errors.password?.message}</p>
              </div>
              {error != '' && <p>{error}</p>}
              {/* <input {...register('password')} />
              <p>{errors.password?.message}</p> */}
              <div>{isLoading ? <Loader /> : <Button type="submit">Submit</Button>}</div>
            </form>
          </div>
        </CardContent>
        <CardFooter className="italic">Register route is in process</CardFooter>
      </Card>
    </div>
  );
}
