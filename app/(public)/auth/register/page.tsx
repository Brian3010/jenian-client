'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { InputGroup, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { registerSchema, type RegisterValues } from '@/features/auth/schemas';
import { registerUser } from '@/features/auth/services/auth.client';
import { AppError } from '@/lib/AppError';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function RegisterPage() {
  const [error, setError] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSecretToken, setShowSecretToken] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
      secretToken: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (registerData: RegisterValues) => {
    setError('');
    setIsSuccessful(false);
    setIsLoading(true);

    try {
      await registerUser(registerData);
      setIsSuccessful(true);
      reset();
    } catch (err) {
      setError(err instanceof AppError ? err.message : 'An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccessful) {
    return (
      <Card className="w-sm:full md:w-100 max-w-full" role="status">
        <CardHeader>
          <CardTitle className="text-md font-semibold text-green-600">Registration successful</CardTitle>
          <CardDescription>Your account has been created successfully.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Use your new username and password to sign in to your account.</p>
        </CardContent>
        <CardFooter>
          <Button asChild variant="primary" className="w-full">
            <Link href="/auth/sign-in">Continue to sign in</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-sm:full md:w-100 max-w-full">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your details to create your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div>
            <InputGroup>
              <InputGroupInput placeholder="Enter your username" autoComplete="username" {...register('userName')} />
            </InputGroup>
            <p className="p-2 text-red-600">{errors.userName?.message}</p>
          </div>

          <div>
            <InputGroup>
              <InputGroupInput
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                {...register('email')}
              />
            </InputGroup>
            <p className="p-2 text-red-600">{errors.email?.message}</p>
          </div>

          <div>
            <InputGroup className="pr-3">
              <InputGroupInput
                placeholder="Enter your password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                {...register('password')}
              />
              <InputGroupButton
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
                size="icon-xs"
                onClick={() => setShowPassword(current => !current)}
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </InputGroupButton>
            </InputGroup>
            <p className="p-2 text-red-600">{errors.password?.message}</p>
          </div>

          <div>
            <InputGroup className="pr-3">
              <InputGroupInput
                placeholder="Confirm your password"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                {...register('confirmPassword')}
              />
              <InputGroupButton
                type="button"
                aria-label={showConfirmPassword ? 'Hide confirmed password' : 'Show confirmed password'}
                title={showConfirmPassword ? 'Hide confirmed password' : 'Show confirmed password'}
                size="icon-xs"
                onClick={() => setShowConfirmPassword(current => !current)}
              >
                {showConfirmPassword ? <Eye /> : <EyeOff />}
              </InputGroupButton>
            </InputGroup>
            <p className="p-2 text-red-600">{errors.confirmPassword?.message}</p>
          </div>

          <div>
            <InputGroup className="pr-3">
              <InputGroupInput
                type={showSecretToken ? 'text' : 'password'}
                placeholder="Enter your secret token"
                autoComplete="off"
                {...register('secretToken')}
              />
              <InputGroupButton
                type="button"
                aria-label={showSecretToken ? 'Hide secret token' : 'Show secret token'}
                title={showSecretToken ? 'Hide secret token' : 'Show secret token'}
                size="icon-xs"
                onClick={() => setShowSecretToken(current => !current)}
              >
                {showSecretToken ? <Eye /> : <EyeOff />}
              </InputGroupButton>
            </InputGroup>
            <p className="p-2 text-red-600">{errors.secretToken?.message}</p>
          </div>

          {error && (
            <p className="text-red-600 italic" role="alert">
              {error}
            </p>
          )}

          <Button variant="primary" type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <LoaderCircle className="animate-spin" /> : 'Sign up'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-sm pt-2">
        <p>
          Already have an account?{' '}
          <Link href="/auth/sign-in" className="font-medium underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
