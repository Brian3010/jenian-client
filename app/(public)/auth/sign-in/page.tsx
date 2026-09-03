'use client';
import { BackendWakeLoading } from '@/components/BackendWakeLoading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { InputGroup, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { signInSchema, type SignInValues } from '@/features/auth/schemas';
import { loginUser } from '@/features/auth/services/auth.client';
import { AppError } from '@/lib/AppError';
import { BackendWakeError, wakeBackend } from '@/lib/backend-health.client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function SignIn() {
  // const { addUser } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'waking' | 'signing-in'>('idle');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      userName: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (signInData: SignInValues) => {
    setError('');
    setSubmitStatus('waking');

    try {
      await wakeBackend();
      setSubmitStatus('signing-in');
      await loginUser(signInData.userName, signInData.password);
      router.replace('/dashboard');
    } catch (err) {
      if (err instanceof BackendWakeError) {
        setError('Jenian could not connect. Please try again shortly.');
      } else if (err instanceof AppError && err.code === 'INVALID_CREDENTIALS') {
        setError('Invalid username or password');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
      setSubmitStatus('idle');
    }
  };

  if (submitStatus === 'waking') {
    return <BackendWakeLoading />;
  }

  const isLoading = submitStatus !== 'idle';

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center min-h-screen">
        <div className="mx-auto flex items-center text-2xl">
          <span className="flex-1 text-center font-semibold italic tracking-wide">
            <Link href="/">Jenian</Link>
          </span>
        </div>
        <div className="w-sm:full md:w-100 max-w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 flex-col">
                  <div>
                    <InputGroup>
                      <InputGroupInput className="" placeholder="Enter your username" {...register('userName')} />
                    </InputGroup>
                    <p>{errors.userName?.message}</p>
                  </div>
                  <div>
                    <InputGroup className="pr-3 ">
                      <InputGroupInput
                        placeholder="Enter your password"
                        type={showPassword ? 'text' : 'password'}
                        {...register('password')}
                      />
                      <InputGroupButton
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        title={showPassword ? 'Hide password' : 'Show password'}
                        size="icon-xs"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <Eye /> : <EyeOff />}
                      </InputGroupButton>
                    </InputGroup>
                    <p className="p-2 text-red-600">{errors.password?.message}</p>
                  </div>
                  {error && <p className="text-red-600 italic">{error}</p>}
                  <div>
                    <Button variant="primary" type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <LoaderCircle className="animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        'Sign in'
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </CardContent>
            <CardFooter className="text-sm pt-2">
              <p>
                Don&apos;t have an account?{' '}
                <Link href="/auth/register" className="font-medium underline underline-offset-4">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </Card>
          <div className="float-right pt-2 text-sm text-gray-600">
            <Link href="/demo-account?returnTo=/dashboard" className="font-medium underline underline-offset-4">
              Try demo account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
