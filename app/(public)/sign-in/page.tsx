'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { InputGroup, InputGroupInput } from '@/components/ui/input-group';
import { login } from '@/features/auth/services/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import ContactMeAlertDialog from './components/ContactMeAlertDialog';

const signInSchema = z.object({
  userName: z.string('Please enter a valid userName'),
  // password: z.regex(/^(?=.{8,128}$)(?!.\s)(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[^\w\s]).$/),
  password: z
    .string()
    .trim() // blocks leading/trailing spaces; if you want to allow them, remove this
    .min(8, 'Password must be at least 12 characters')
    .max(128, 'Password must be at most 128 characters')
    .refine(v => !/\s/.test(v), 'Password must not contain spaces')
    .refine(v => /[a-z]/.test(v), 'Password must include a lowercase letter')
    .refine(v => /[A-Z]/.test(v), 'Password must include an uppercase letter')
    .refine(v => /\d/.test(v), 'Password must include a number')
    .refine(v => /[^\w\s]/.test(v), 'Password must include a symbol'),
  // password: z.string(),
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
      userName: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (signInData: SignInValues) => {
    console.log('🚀 ~ onSubmit ~ signInData:', signInData);
    try {
      setIsLoading(true);
      const res = await login(signInData.userName, signInData.password);
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
    <div className="flex justify-center p-10">
      <Card className="w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your username/email to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 flex-col">
              {/* <input {...register('userName')} />
              <p>{errors.userName?.message}</p> */}
              <div>
                <InputGroup>
                  <InputGroupInput placeholder="Enter your username" {...register('userName')} />
                </InputGroup>
                <p>{errors.userName?.message}</p>
              </div>
              <div>
                <InputGroup>
                  <InputGroupInput type="password" {...register('password')} />
                </InputGroup>
                <p className="p-2 text-red-600">{errors.password?.message}</p>
              </div>
              {error != '' && <p className="text-red-600 italic">{error}</p>}
              {/* <input {...register('password')} />
              <p>{errors.password?.message}</p> */}
              <div>
                {/* {!isLoading ? <LoaderCircle className="animate-spin" /> : <Button type="submit">Submit</Button>} */}
                <Button type="submit" className="w-25">
                  {isLoading ? <LoaderCircle className="animate-spin" /> : 'Sign in'}
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
        <CardFooter className="">
          <p>
            Please contact <ContactMeAlertDialog /> to create an account as this is intended user only.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
