import React from 'react'

export default function PublicLayout({children} : {children : React.ReactNode}) {
  return (
    <div className='min-h-screen bg-[#1F1F1F]'>
      {children}
    </div>
  )
}
