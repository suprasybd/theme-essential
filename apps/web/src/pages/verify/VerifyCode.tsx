import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import React from 'react';
import { verifyEmailCode } from './api';

const VerifyCode = () => {
  const { code } = useParams({ strict: false }) as { code: string };

  const { isSuccess } = useQuery({
    queryKey: ['verifyEmail'],
    queryFn: () => verifyEmailCode(code),
    enabled: !!code,
  });

  return (
    <div className="w-full max-w-[1220px] min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
      {isSuccess && <div>Verified sucecss</div>}

      {!isSuccess && <div>verify fail</div>}
    </div>
  );
};

export default VerifyCode;
