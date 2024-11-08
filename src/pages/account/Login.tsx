import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useToast,
} from '@/components/ui';
import { useMutation } from '@tanstack/react-query';
// import { login } from './api';
import { ReloadIcon, SizeIcon } from '@radix-ui/react-icons';

// import logo from './assets/lg-full-blacks.png';

import { Turnstile } from '@marsidev/react-turnstile';
import useTurnStileHook from '@/hooks/turnstile';
import { login } from '../../api/account';

export const loginSchema = z.object({
  Email: z.string().email(),
  Password: z.string().min(3),
});

const Login: React.FC = () => {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { Password: '', Email: '' },
  });

  const { toast } = useToast();
  const formErrors = form.formState;

  const [siteKey, turnstileLoaded, resetTurnstile] = useTurnStileHook();
  const navigate = useNavigate();
  const search = useSearch({ from: '/login' });

  const {
    mutate: loginMutation,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // After successful login, redirect back to checkout if that's where user came from
      if (search && 'redirect' in search && search.redirect === '/checkout') {
        navigate({ to: '/checkout' });
      } else {
        navigate({ to: '/' });
      }
    },
    onError: (response: {
      response: { data: { Message: string }; status: number };
    }) => {
      if (response.response.status === 400) {
        resetTurnstile();
      }
      toast({
        title: 'Login',
        description: response.response.data.Message,
        variant: 'destructive',
      });
    },
  });

  function onSubmit(
    values: z.infer<typeof loginSchema>,
    turnstileResponse: string | null
  ) {
    loginMutation({
      ...values,
      'cf-turnstile-response': turnstileResponse,
    } as z.infer<typeof loginSchema>);
  }

  const forceUpdate = () => {
    window.location.reload();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormWrapper = (e: any) => {
    e.preventDefault();
    try {
      const tRes = e.target['cf-turnstile-response'].value;

      if (!tRes) return;

      form.handleSubmit((values: z.infer<typeof loginSchema>) =>
        onSubmit(values, tRes)
      )(e);
    } catch (error) {
      resetTurnstile();
    }
  };

  return (
    <div className="container mx-auto max-w-[400px] py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your email and password to sign in
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={handleFormWrapper}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="Email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Password"
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              {siteKey && (
                <Turnstile siteKey={siteKey} options={{ size: 'normal' }} />
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={!turnstileLoaded || isPending}
              >
                {isPending ? (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Logging In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
              <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                <Link to="/request-password-reset" className="hover:underline">
                  Forgot Password?
                </Link>
                <Link to="/register" className="hover:underline">
                  Don't have an account? Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
