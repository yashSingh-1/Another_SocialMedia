import { SignUp } from '@clerk/nextjs'
import React from 'react'

const Page = () => {
  return (
    <div className='flex m-auto h-screen'>
      <div className='m-auto'>
      <SignUp/>
      </div>
    </div>
  )
}

export default Page