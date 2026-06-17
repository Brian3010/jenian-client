'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { InputGroup, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import ContactMeAlertDialog from '@/features/auth/components/ContactMeAlertDialog';
import { loginUser } from '@/features/auth/services/auth.service';
import { AppError } from '@/lib/AppError';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const signInSchema = z.object({
  userName: z.string('Please enter a valid userName'),
  password: z
    .string()
    .trim()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters')
    .refine(v => !/\s/.test(v), 'Password must not contain spaces')
    .refine(v => /[a-z]/.test(v), 'Password must include a lowercase letter')
    .refine(v => /[A-Z]/.test(v), 'Password must include an uppercase letter')
    .refine(v => /\d/.test(v), 'Password must include a number')
    .refine(v => /[^\w\s]/.test(v), 'Password must include a symbol'),
  // password: z.string(),s
});
type SignInValues = z.infer<typeof signInSchema>;

export default function SignIn() {
  // const { addUser } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    console.log('🚀 ~ onSubmit ~ signInData:', signInData);
    try {
      setIsLoading(true);
      await loginUser(signInData.userName, signInData.password);
      // addUser(user);
      router.replace('/dashboard');
    } catch (err) {
      console.error('🚀 ~ onSubmit ~ err:', err);
      if (err instanceof AppError && err.code === 'INVALID_CREDENTIALS') {
        setError('Invalid username or password');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center p-4">
      <Card className="w-sm=full md:w-[400px]">
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
                  {isLoading ? <LoaderCircle className="animate-spin" /> : 'Sign in'}
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-baseline text-sm gap-1">
          <p>
            Please contact <ContactMeAlertDialog /> to create an account.
          </p>
          <p>Access is restricted to authorized users.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
