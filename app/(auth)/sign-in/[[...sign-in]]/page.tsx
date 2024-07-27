import { SignIn } from '@clerk/nextjs'
import React from 'react'

const Signin = () => {
  return (
    <div className='flex h-screen'>
      <div className='m-auto'>
      <SignIn signUpForceRedirectUrl="/onboarding"/>

      </div>
    </div>
  )
}

export default Signin