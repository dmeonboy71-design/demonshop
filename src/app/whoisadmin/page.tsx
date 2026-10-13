'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DemonAdminPage from '../demon/admin/page';

export default function WhoIsAdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/demon/admin');
  }, [router]);

  return <DemonAdminPage />;
}
