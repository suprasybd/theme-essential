import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from '@tanstack/react-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useToast,
} from '@frontend.suprasy.com/ui';
import { useMutation } from '@tanstack/react-query';
// import { login } from './api';
import { ReloadIcon, SizeIcon } from '@radix-ui/react-icons';

// import logo from './assets/lg-full-blacks.png';

import { Turnstile } from '@marsidev/react-turnstile';
import useTurnStileHook from '@web/hooks/turnstile';
import { login } from './api';

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

  const [siteKey, turnstileLoaded] = useTurnStileHook();

  const navigate = useNavigate();

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      navigate({
        to: '/',
      });
    },
    onError: (data) => {
      toast({
        title: 'Login Failed',
        description: 'Incorrect credintial provided!',
        variant: 'destructive',
      });
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    const turnstileResponse = localStorage.getItem('cf-turnstile-in-storage');
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

      localStorage.setItem('cf-turnstile-in-storage', tRes);

      form.handleSubmit(onSubmit)(e);
    } catch (error) {
      forceUpdate();
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center md:px-6  lg:px-8 ">
      <div className="bg-white p-4 md:p-20  rounded-2xl">
        <div className="sm:mx-auto sm:w-full text-center sm:max-w-sm">
          <h2 className="mt-10 mb-2 text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          <p>And access your order history and others. </p>
        </div>

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
          <Form {...form}>
            <form onSubmit={handleFormWrapper} className="space-y-8">
              <FormField
                control={form.control}
                name="Email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Email</FormLabel>
                    <FormControl>
                      <Input
                        className="h-14"
                        FormError={!!formErrors.errors.Email}
                        placeholder="Enter Email"
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
                  <FormItem className="space-y-0 !mt-5">
                    <FormLabel className="font-bold">Password</FormLabel>
                    <FormControl>
                      <Input
                        className="h-14"
                        FormError={!!formErrors.errors.Password}
                        type="password"
                        placeholder="Enter Password"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {siteKey && (
                <Turnstile options={{ size: 'auto' }} siteKey={siteKey} />
              )}

              <Button
                type="submit"
                className="w-full h-14 font-xl font-bold"
                disabled={!turnstileLoaded}
                variant={'green'}
              >
                {!turnstileLoaded && (
                  <>
                    <ReloadIcon className="mr-2 h-7 w-7 animate-spin" />
                    wait a few moment..
                  </>
                )}

                {turnstileLoaded && (
                  <>
                    {isPending && (
                      <>
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        Loging In..
                      </>
                    )}
                    {!isPending && <>Sign In</>}
                  </>
                )}
              </Button>

              <p className="mt-10 text-center text-sm text-gray-500 ">
                Not a member?
                <Link
                  to="/register"
                  className="font-semibold leading-6 text-black pl-2"
                >
                  Click here to signup
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
