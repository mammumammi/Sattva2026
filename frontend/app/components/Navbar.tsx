"use client";
import gsap from 'gsap';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'

interface NavbarProps {
  currentPage: string;
}

const Navbar = ({ currentPage }: NavbarProps) => {
  const [width, setWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 768);
  const router = useRouter();

  const extrasRef = useRef<HTMLDivElement>(null);

  const [toggle,setToggle] = useState(false);

  const toggleClick = () => {
    setToggle(!toggle);
  }



  const handleClick = (path: string) => {
    const overlay = document.getElementById('transition-overlay');
    if (!overlay) return;

    // Bring to front and fade in
    overlay.style.zIndex = '9999';

    gsap.to(overlay, {
      opacity: 1,
      duration: 0.5,
      onComplete: () => {
        router.push(path);
      }
    });
  }

  const handlePointsClick = () => {
    const overlay = document.getElementById('transition-overlay');
    if (!overlay) return;

    overlay.style.zIndex = '9999';

    gsap.to(overlay, {
      opacity: 1,
      duration: 0.5,
      onComplete: () => {
        if (currentPage === 'home') {
          // Same page - just scroll
          const element = document.getElementById('point-table');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
          // Fade out overlay
          gsap.to(overlay, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
              overlay.style.zIndex = '-1';
            }
          });
        } else {
          // Different page - navigate to home with hash
          router.push('/#point-table');
        }
      }
    });
  }

  useEffect(() => {
    setWidth(window.innerWidth);
  }, [])

  useEffect(() => {
    if (!extrasRef.current) return;
  
    if (toggle) {
      // Expand
      gsap.to(extrasRef.current, {
        width: '100%', // Adjust based on content
        duration: 1.5,
        ease: "power2.out"
      });
  
      
    } else {
      // Collapse
      
  
      gsap.to(extrasRef.current, {
        width: '100%', // Initial width
        duration: 1.4,
        ease: "power2.in",
        delay: 0.1
      });
    }
  }, [toggle]);

  return (
    <div>
    
    
    <div className='fixed bottom-[7.5vh] md:bottom-[7vh] flex items-center left-1/2 -translate-x-1/2 z-50'>
      <div className='rounded-[45px] text-[#fef9ef] md:rounded-[30px] flex flex-row items-center justify-center space-x-[10px] p-[20px] h-[5vh] bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg scale-105 md:scale-100' style={{ fontFamily: 'textfont',maxWidth: '400px' } } ref={extrasRef} >
        {width > 768 && <div className='extra-item hover:text-[#b98795] transition-colors duration-400 cursor-pointer' onClick={() => handleClick('/arts')}>Arts</div>}
        <div className='hover:text-[#b98795] transition-colors duration-400 cursor-pointer' onClick={handlePointsClick}>Points</div>
        <div className='hover:text-[#b98795] transition-colors duration-400 cursor-pointer' onClick={() => handleClick("/sports")}>Sports</div>
        {width > 768 && <a className='hover:text-[#b98795] transition-colors duration-400 cursor-pointer' href="#brochure">Brochure</a>}
        {width > 768 && <a href="https://cucekphotographyclub.club/" target='_blank'className='hover:text-[#b98795] transition-colors duration-400 cursor-pointer'>Gallery</a>}
        {toggle && <div className='extra-item hover:text-[#b98795] transition-colors duration-400 cursor-pointer' onClick={() => handleClick('/arts')}>Arts</div>}
        {toggle && <a href="https://cucekphotographyclub.club/" target='_blank' className='hover:text-[#b98795]  extra-item transition-colors duration-400 cursor-pointer'>Gallery</a>}
        {toggle && <a className='extra-item hover:text-[#b98795] transition-colors duration-400 cursor-pointer' href="#brochure">Brochure</a>}
        {width < 768 && <div onClick={toggleClick}>Extras</div>}

      </div>
      
    </div>
    </div>
  )
}

export default Navbar