"use client";

import Image from 'next/image';
import Link from 'next/link';

import {Button} from '@/components/ui/button';

export default function error() {
  return (
    <div className='h-full flex-col flex items-center space-y-4 justify-center'>
      <Image src={"/error.png"} height={"300"} width={"300"} alt='error' className='dark:hidden' />
      <Image src={"/error-dark.png"} height={"300"} width={"300"} alt='error' className='dark:block hidden' />
      <h2 className='text-xl font-medium'>
        Something went wrong!
      </h2>
      <Button asChild>
        <Link href={'/documents'}>Go back</Link>
      </Button>
    </div>
  )
}
