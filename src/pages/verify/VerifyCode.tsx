import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from '@tanstack/react-router';
import React from 'react';
import { verifyEmailCode } from '../../api/verify';
import { Button } from '@/components/ui';

const VerifyCode = () => {
  const { code } = useParams({ strict: false }) as { code: string };

  const { isSuccess } = useQuery({
    queryKey: ['verifyEmail'],
    queryFn: () => verifyEmailCode(code),
    enabled: !!code,
  });

  return (
    <div className="w-full max-w-[1220px] min-h-full mx-auto gap-6 py-40 px-4 sm:px-8 ">
      <div className="bg-white shadow-md rounded-lg px-6 py-4 ">
        {isSuccess ? (
          <div className="text-green-600 w-full flex justify-center items-center">
            <div className="flex justify-center flex-col">
              <div>
                <svg
                  className="h-6 w-6 inline-block mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Verified successfully!
              </div>

              <Button className="my-3" variant={'green'}>
                <Link to="/login">Click here to login</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-red-600">
            <svg
              className="h-6 w-6 inline-block mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Verification failed. Please try again.
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyCode;
