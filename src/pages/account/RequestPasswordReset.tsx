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
import { Link, useNavigate } from '@tanstack/react-router';
import { requestPasswordReset } from '@/api/auth';
import { Turnstile } from '@marsidev/react-turnstile';
import useTurnStileHook from '@/hooks/turnstile';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';

const formSchema = z.object({
  email: z.string().email(),
});

const RequestPasswordReset = () => {
  const navigate = useNavigate();
  const [siteKey, turnstileLoaded, resetTurnstile] = useTurnStileHook();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { mutate: handleRequestReset, isPending } = useMutation({
    mutationFn: (data: { email: string; 'cf-turnstile-response': string }) =>
      requestPasswordReset(data),
    onSuccess: () => {
      toast.success('Password reset link has been sent to your email');
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
        handleRequestReset({
          email: values.email,
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
          <CardDescription>
            Enter your email address and we'll send you a password reset link
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={handleFormWrapper}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email"
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
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
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

export default RequestPasswordReset;
