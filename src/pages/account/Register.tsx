import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
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
} from '@/components/ui';
import { useMutation } from '@tanstack/react-query';
import { register } from '../../api/account';
import { ReloadIcon } from '@radix-ui/react-icons';

// import logo from '../login/assets/lg-full-blacks.png';

import { Turnstile } from '@marsidev/react-turnstile';
import useTurnStileHook from '@/hooks/turnstile';

export const registerSchema = z.object({
  FullName: z.string().min(1),

  Email: z.string().email(),
  Password: z
    .string()
    .min(8)
    .refine((val) => /.*[0-9].*/.test(val ?? ''), 'At least put one number!'),
});

const Register: React.FC = () => {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { Password: '', Email: '' },
  });

  const { toast } = useToast();
  const formErrors = form.formState;

  const {
    mutate: registerMutation,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      toast({
        title: 'Registration succecssfull',
        description: 'We have sent you an verification email!',
        variant: 'default',
      });
    },
    onError: (response: {
      response: { data: { Message: string }; status: number };
    }) => {
      if (response.response.status === 400) {
        resetTurnstile();
      }
      toast({
        title: 'Register',
        description: response.response.data.Message,
        variant: 'destructive',
      });
    },
  });

  function onSubmit(
    values: z.infer<typeof registerSchema>,
    turnstileResponse: string | null
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    registerMutation({
      ...values,
      'cf-turnstile-response': turnstileResponse,
    } as any);
  }

  const usersEmail = form.watch('Email');

  const [siteKey, turnstileLoaded, resetTurnstile] = useTurnStileHook();

  const handleFormWrapper = (e: any) => {
    e.preventDefault();
    try {
      const tRes = e.target['cf-turnstile-response'].value;
      if (!tRes) return;

      form.handleSubmit((values: z.infer<typeof registerSchema>) =>
        onSubmit(values, tRes)
      )(e);
    } catch (error) {
      resetTurnstile();
    }
  };

  return (
    <div className="flex min-h-full mt-20 md:mt-0 flex-col justify-center px-6 py-3 lg:px-8">
      <div className="bg-white p-4 md:p-20  rounded-2xl">
        {!isSuccess && (
          <div>
            <div className="sm:mx-auto sm:w-full text-center sm:max-w-sm">
              <h2 className="mt-10  text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Create an account
              </h2>
              <p>Register an account by filling the form bellow. </p>
            </div>

            <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
              <Form {...form}>
                <form onSubmit={handleFormWrapper} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="FullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            className="h-14"
                            FormError={!!formErrors.errors.FullName}
                            placeholder="Full Name"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="Email"
                    render={({ field }) => (
                      <FormItem className="space-y-0 !mt-3">
                        <FormLabel>Email</FormLabel>
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
                      <FormItem className="space-y-0 !mt-3">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            className="h-14"
                            FormError={!!formErrors.errors.Password}
                            type="password"
                            placeholder="***********"
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
                    className="w-full h-11"
                    variant={'green'}
                    disabled={!turnstileLoaded}
                  >
                    {!turnstileLoaded && (
                      <>
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        wait a few moment..
                      </>
                    )}

                    {turnstileLoaded && (
                      <>
                        {isPending && (
                          <>
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                            Registering..
                          </>
                        )}
                        {!isPending && <>Register</>}
                      </>
                    )}
                  </Button>

                  <p className="mt-10 text-center text-sm text-gray-500 ">
                    Already registred?
                    <a
                      href="/login"
                      className="font-semibold leading-6 text-black pl-2"
                    >
                      Click here to signin
                    </a>
                  </p>
                </form>
              </Form>
            </div>
          </div>
        )}
        {isSuccess && (
          <div className="relative flex flex-col items-center justify-center overflow-hidden py-6 sm:py-12 bg-white">
            <div className="max-w-xl px-5 text-center">
              <h2 className="mb-2 text-[42px] font-bold text-zinc-800">
                Verification Email Sent
              </h2>
              <p className="mb-2 text-lg text-zinc-500">
                We are glad, that you’re with us ? We’ve sent you a verification
                link to the email address{' '}
                <span className="font-medium text-indigo-500">
                  {usersEmail}
                </span>
                .
              </p>

              <a
                href="/login"
                className="mt-3 inline-block w-96 rounded bg-green-600 px-5 py-3 font-medium text-white shadow-md shadow-green-500/20 hover:bg-green-700"
              >
                Continue →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
