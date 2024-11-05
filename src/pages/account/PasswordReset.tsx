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
} from '@/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { resetPassword } from '@/api/auth';
import { Turnstile } from '@marsidev/react-turnstile';
import useTurnStileHook from '@/hooks/turnstile';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';

const formSchema = z
  .object({
    Password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(32, 'Password must not exceed 32 characters')
      .regex(/^(?=.*\d).{8,}$/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.Password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const PasswordReset = () => {
  const { code } = useParams({ strict: false }) as { code: string };
  const navigate = useNavigate();
  const [siteKey, turnstileLoaded, resetTurnstile] = useTurnStileHook();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { mutate: handleResetPassword, isPending } = useMutation({
    mutationFn: (data: { Password: string; 'cf-turnstile-response': string }) =>
      resetPassword({
        Code: code,
        Password: data.Password,
        'cf-turnstile-response': data['cf-turnstile-response'],
      }),
    onSuccess: () => {
      toast.success('Password has been reset successfully');
      navigate({ to: '/login' });
    },
    onError: (error: any) => {
      if (error?.response?.status === 400) {
        resetTurnstile();
      }
      toast.error(error?.response?.data?.Message || 'Something went wrong');
    },
  });

  const handleFormWrapper = (e: any) => {
    e.preventDefault();
    try {
      const tRes = e.target['cf-turnstile-response'].value;
      if (!tRes) return;

      form.handleSubmit((values) =>
        handleResetPassword({
          Password: values.Password,
          'cf-turnstile-response': tRes,
        })
      )(e);
    } catch (error) {
      resetTurnstile();
    }
  };

  return (
    <div className="container mx-auto max-w-[400px] py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your new password</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={handleFormWrapper}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="Password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm new password"
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
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>
              <Link
                to="/login"
                className="text-sm text-center text-muted-foreground hover:underline"
              >
                Back to login
              </Link>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default PasswordReset;
