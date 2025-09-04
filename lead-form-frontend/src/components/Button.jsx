import React from 'react'

const Button = ({ 
  className = "", 
  divClassName = "", 
  property1 = "default", 
  text = "Join now",
  onClick,
  ...props 
}) => {
  return (
    <button
      className={`
        flex items-center justify-center px-6 py-2 
        bg-white text-black rounded-full font-bold 
        hover:bg-gray-100 transition-colors cursor-pointer
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      <div className={`text-lg font-bold tracking-[0] leading-[27px] ${divClassName}`}>
        {text}
      </div>
    </button>
  )
}

export default Button
