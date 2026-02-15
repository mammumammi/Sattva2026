"use client";
import React, { useEffect, useState } from 'react'
const Navbar = () => {
    const [width, setWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 768);


    useEffect(()=>{
        setWidth(window.innerWidth);
    },[])
  return (
    <div className='fixed bottom-[7.5vh] md:bottom-[7vh] flex items-center  left-1/2 -translate-x-1/2 z-50'>
        <div className='rounded-[45px] text-[#fef9ef] md:rounded-[30px]   flex flex-row items-center justify-center space-x-[10px] p-[20px] h-[5vh] bg-white/10
  backdrop-blur-xl
  border border-white/20
  shadow-lg scale-105 md:scale-100' style={{fontFamily:'textfont'}}>
            <a href="#Arts" className='hover:text-[#590d22] transition-colors duration-400'>Arts</a>
            <a href="#points">Points</a>
            <a href="#Sports">Sports</a>
            {width > 768 && <a href="#brochure">Brochure</a>}
            {width > 768 && <a href="#gallery">Gallery</a>}
        </div>
    </div>
  )
}

export default Navbar