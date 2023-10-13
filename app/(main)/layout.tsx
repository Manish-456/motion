"use client";

import { Spinner } from '@/components/spinner';
import { useConvexAuth } from 'convex/react';
import { redirect } from 'next/navigation';
import React from 'react'
import { Navigation } from './_components/navigation';

export default function MainLayout({children} : {
    children : React.ReactNode
}) {
   const {isLoading, isAuthenticated} = useConvexAuth()
   
   if(isLoading){
    return (
        <div className='flex h-full flex-col justify-center items-center'>
            <Spinner size={"icon"} />
        </div>
    )
   }

   if(!isAuthenticated){
    return redirect('/');
   }

   return (
    <div className='flex h-full dark:bg-[#1F1F1F]'>
        <Navigation />
        <main className='flex-1 h-full overflow-y-auto'>
        {children}      
        </main>

    </div>
  )
}
