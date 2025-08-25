import React from 'react'
import LogoFocus from '../assets/LogoFocus2.png'

export const Logo = ({ size = 'small', light = false }) => {
  return (
    <div className="flex items-center">
      <div className={`${size === 'small' ? 'h-64 w-64' : 'h-80 w-80'} relative`}>
        <img 
          src={LogoFocus} 
          alt="Focus Technology Solutions" 
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  )
}
