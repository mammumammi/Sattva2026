"use client";

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import React, { useEffect, useState } from 'react'

import sattvalogo from '../../assets/images/sattva.png'
import cusatlogo from '../../assets/images/cusatlogo.png'
import Image from 'next/image';


gsap.registerPlugin(ScrollTrigger);
type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const TARGET_DATE = new Date("2026-03-07T00:00:00")


const Hero = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [width, setWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 768);

  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date().getTime();

    const difference = TARGET_DATE.getTime() - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeBox = ({ label, value }: { label: string; value: number }) => (
    <div className="text-[40px] " style={{ fontFamily: 'Astila-Regular' }}>
      {value}
    </div>
  );

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    if (!mounted) return;

    if (menuOpen) {
      // Prevent scrolling when menu is open
      document.body.style.overflow = 'hidden';

      // Animate menu overlay
      gsap.to('.fullpage-menu-overlay', {
        clipPath: 'circle(150% at 50% 50%)',
        duration: 0.8,
        ease: "power4.inOut"
      });

      // Animate close button
      gsap.to('.fullpage-menu-close', {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
        delay: 0.4
      });

      // Animate menu items
      gsap.to('.fullpage-menu-item', {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.out",
        delay: 0.3
      });

      // Animate hamburger to X
      gsap.to('.hamburger-line-1', {
        rotation: 45,
        y: 8,
        backgroundColor: '#000000',
        duration: 0.3,
        ease: "power2.inOut"
      });
      gsap.to('.hamburger-line-2', {
        opacity: 0,
        duration: 0.2,
        ease: "power2.inOut"
      });
      gsap.to('.hamburger-line-3', {
        rotation: -45,
        y: -8,
        backgroundColor: '#000000',
        duration: 0.3,
        ease: "power2.inOut"
      });
    } else {
      // Re-enable scrolling
      document.body.style.overflow = '';

      // Animate close button out
      gsap.to('.fullpage-menu-close', {
        y: 50,
        opacity: 0,
        duration: 0.3,
        ease: "power3.in"
      });

      // Animate menu items out
      gsap.to('.fullpage-menu-item', {
        y: 50,
        opacity: 0,
        stagger: 0.05,
        duration: 0.4,
        ease: "power3.in"
      });

      // Animate menu overlay out
      gsap.to('.fullpage-menu-overlay', {
        clipPath: 'circle(0% at 50% 50%)',
        duration: 0.8,
        ease: "power4.inOut",
        delay: 0.2
      });

      // Animate hamburger back
      gsap.to('.hamburger-line-1', {
        rotation: 0,
        y: 0,
        backgroundColor: '#ffffff',
        duration: 0.3,
        ease: "power2.inOut"
      });
      gsap.to('.hamburger-line-2', {
        opacity: 1,
        duration: 0.2,
        ease: "power2.inOut",
        delay: 0.1
      });
      gsap.to('.hamburger-line-3', {
        rotation: 0,
        y: 0,
        backgroundColor: '#ffffff',
        duration: 0.3,
        ease: "power2.inOut"
      });
    }
  }, [menuOpen, mounted]);


  useEffect(() => {
    if (!mounted) return;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".inner-hero-wrapper",
        pin: '.inner-hero-wrapper',
        start: "top top",
        end: "+=200%",
        scrub: 0.6,
      },
    });

    gsap.set(".inner-hero", {
      transformOrigin: "center center",
      position: "absolute",
      top: "50%",
      left: "50%",
      x: "-50%",
      y: "-50%",
    });

    tl.fromTo(
      [".inner-hero", ".hero-bg"],
      {
        height: '80vh',
        width: '90vw',
        borderRadius: '20px',
      },
      {
        height: '100vh',
        width: '100vw',
        borderRadius: '0px',
        ease: "none",
      },
      0
    )

    tl.to('.hero-fore', {
      scale: width > 768 ? 0.85 : 1.5,
      y: width > 768 ? "-30%" : '-10%',
      ease: "sine.in"
    }, 0)

    // Fade out CUCEK and Tradition Reimagined text on scroll
    gsap.to('.cucek-text h1', {
      opacity: 0,
      y: -20,
      color: '#ffffff',
      scrollTrigger: {
        trigger: '.inner-hero-wrapper',
        start: 'top top',
        end: '+=30%',
        scrub: 1
      }
    });

    gsap.to('.tradition-text p', {
      opacity: 0,
      y: 20,
      color: '#ffffff',
      scrollTrigger: {
        trigger: '.inner-hero-wrapper',
        start: 'top top',
        end: '+=30%',
        scrub: 1
      }
    });

    gsap.to('.hero-fore', {
      opacity: 0,
      scrollTrigger: {
        trigger: 'hero-fore',
        start: width > 768 ? '40% top' : '30% top',
        scrub: 1
      },
      duration: 3,
    })

    tl.to(
      ".hero-text",
      {
        color: '#fef9ef',
        ease: "none",
        duration: 0.5
      },
      0
    );

    tl.to(
      ".hero-overlay",
      {
        opacity: 1,
        ease: "none",
        duration: 0.5
      },
      0
    );

    tl.to(
      ".hero-text",
      {
        position: "fixed",
        top: "50%",
        left: "50%",
        x: "-50%",
        y: "-50%",
        marginLeft: 0,
        scale: width > 768 ? 4 : 1.5,
        ease: "power2.inOut",
        duration: 0.5
      },
      0.3
    );

    tl.to(
      ".hero-navbar",
      {
        opacity: 1,
        y: 0,
        ease: "power2.out",
        duration: 0.3
      },
      0.5
    );

    tl.to(
      ".hamburger-btn",
      {
        opacity: 1,
        y: 0,
        ease: "power2.out",
        duration: 0.3
      },
      0.5
    );

    gsap.set('.cusat-logo', {
      opacity: 0,
      x: -30,
    });
    tl.to(
      ".cusat-logo",
      {
        opacity: 1,
        x: 5,
        ease: "power2.out",
        duration: 0.4
      },
      0.3
    );

    tl.set('.hero-fore', {
      display: "fixed"
    }, 1.4)

    // Curtain transition animation - similar to hamburger menu
    gsap.set('.curtain-left', {
      xPercent: -100,
    });

    gsap.set('.curtain-right', {
      xPercent: 100,
    });

    // Curtains close (come together)
    gsap.to('.curtain-left', {
      xPercent: 0,
      ease: "power4.inOut",
      scrollTrigger: {
        trigger: '.about-content',
        start: 'top 100%',
        end: 'top 70%',
        scrub: 1,
      }
    });

    gsap.to('.curtain-right', {
      xPercent: 0,
      ease: "power4.inOut",
      scrollTrigger: {
        trigger: '.about-content',
        start: 'top 100%',
        end: 'top 70%',
        scrub: 1,
      }
    });

    // Curtains open (separate)
    gsap.to('.curtain-left', {
      xPercent: -100,
      ease: "power4.inOut",
      scrollTrigger: {
        trigger: '.about-content',
        start: 'top 70%',
        end: 'top 40%',
        scrub: 1,
      }
    });

    gsap.to('.curtain-right', {
      xPercent: 100,
      ease: "power4.inOut",
      scrollTrigger: {
        trigger: '.about-content',
        start: 'top 70%',
        end: 'top 40%',
        scrub: 1,
      }
    });

    // Move Sattva logo back to top-left
    gsap.to(".hero-text", {
      top: "20px",
      left: "20px",
      x: "0",
      y: "0",
      scale: 1,
      marginLeft: "5vw",
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: '.about-content',
        start: 'top 100%',
        end: 'top 70%',
        scrub: 1,
      }
    });

    // Move navbar from bottom to top
    gsap.to(".hero-navbar", {
      bottom: "auto",
      top: "20px",
      ease: "power3.inOut",
      scrollTrigger: {
        trigger: '.about-content',
        start: 'top 100%',
        end: 'top 70%',
        scrub: 1,
      }
    });

    gsap.to(".hamburger-btn", {
      bottom: "auto",
      top: "12px",
      ease: "power3.inOut",
      scrollTrigger: {
        trigger: '.about-content',
        start: 'top 100%',
        end: 'top 70%',
        scrub: 1,
      }
    });

    // Fade out CUSAT logo
    gsap.to(".cusat-logo", {
      opacity: 0,
      scale: 0.9,
      y: -10,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: '.about-content',
        start: 'top 100%',
        end: 'top 70%',
        scrub: 1,
      }
    });

    // Fade out 2026 text
    gsap.to(".year-2026", {
      opacity: 0,
      scale: 0.95,
      y: -10,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: '.about-content',
        start: 'top 100%',
        end: 'top 70%',
        scrub: 1,
      }
    });

    // Fade out CUCEK and Tradition texts
    gsap.to(".cucek-text", {
      opacity: 0,
      y: -10,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: '.about-content',
        start: 'top 100%',
        end: 'top 70%',
        scrub: 1,
      }
    });

    gsap.to(".tradition-text", {
      opacity: 0,
      y: 10,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: '.about-content',
        start: 'top 100%',
        end: 'top 70%',
        scrub: 1,
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [mounted, width]);

  useEffect(() => {
    setWidth(window.innerWidth);
  }, [])

  const handleMenuClick = () => {
    toggleMenu();
  };

  return (
    <div>
      {/* Full Page Menu Overlay */}
      <div
        className='fullpage-menu-overlay fixed inset-0 bg-white z-[100] flex items-center justify-center'
        style={{ clipPath: 'circle(0% at 50% 50%)' }}
      >
        {/* Close Button */}
        <button
          onClick={handleMenuClick}
          className='fullpage-menu-close absolute top-8 right-8 md:top-12 md:right-12 w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-black hover:bg-black transition-all duration-300 flex items-center justify-center opacity-0 translate-y-12 group'
        >
          <div className='relative w-6 h-6 md:w-8 md:h-8'>
            <div className='absolute top-1/2 left-1/2 w-full h-[2px] bg-black group-hover:bg-white -translate-x-1/2 -translate-y-1/2 rotate-45 transition-colors duration-300'></div>
            <div className='absolute top-1/2 left-1/2 w-full h-[2px] bg-black group-hover:bg-white -translate-x-1/2 -translate-y-1/2 -rotate-45 transition-colors duration-300'></div>
          </div>
        </button>

        {/* Menu Tagline - Bottom Left */}
        <div className='fullpage-menu-item absolute bottom-8 left-8 md:bottom-12 md:left-12 text-black opacity-0 translate-y-12'>
          <p className='text-sm md:text-base italic' style={{ fontFamily: 'Astila-Regular' }}>
            Beyond Boundaries
          </p>
          <p className='text-sm md:text-base italic' style={{ fontFamily: 'Astila-Regular' }}>
            Now. Here. SATTVA.
          </p>
        </div>

        <nav className='flex flex-col items-center justify-center gap-8 md:gap-12'>
          <a
            href="#brochure"
            className='fullpage-menu-item text-black text-4xl md:text-6xl lg:text-7xl font-bold hover:text-gray-600 transition-colors opacity-0 translate-y-12'
            style={{ fontFamily: 'Astila-Regular' }}
            onClick={handleMenuClick}
          >
            Brochure
          </a>
          <a
            href="#total-points"
            className='fullpage-menu-item text-black text-4xl md:text-6xl lg:text-7xl font-bold hover:text-gray-600 transition-colors opacity-0 translate-y-12'
            style={{ fontFamily: 'Astila-Regular' }}
            onClick={handleMenuClick}
          >
            Total Points
          </a>
          <a
            href="#individual-points"
            className='fullpage-menu-item text-black text-4xl md:text-6xl lg:text-7xl font-bold hover:text-gray-600 transition-colors opacity-0 translate-y-12'
            style={{ fontFamily: 'Astila-Regular' }}
            onClick={handleMenuClick}
          >
            Individual Points
          </a>
          <a
            href="#gallery"
            className='fullpage-menu-item text-black text-4xl md:text-6xl lg:text-7xl font-bold hover:text-gray-600 transition-colors opacity-0 translate-y-12'
            style={{ fontFamily: 'Astila-Regular' }}
            onClick={handleMenuClick}
          >
            Gallery
          </a>
        </nav>
      </div>

      {/* Curtain Transition - Left Panel */}
      <div className='curtain-left fixed top-0 left-0 w-1/2 h-screen bg-white z-[60] pointer-events-none'></div>

      {/* Curtain Transition - Right Panel */}
      <div className='curtain-right fixed top-0 right-0 w-1/2 h-screen bg-white z-[60] pointer-events-none'></div>

      <div className='min-h-[300vh] overflow-hidden'>
        <div className="max-w-none flex flex-col justify-center">
          <div className='hero-text text-[70px] ml-[5vw] z-50 fixed top-[-2vh] left-0 font-bold'>
            <Image src={sattvalogo} width={120} height={100} alt="sattva" />
          </div>
          <div className='cusat-logo z-50 fixed top-6 left-6 font-bold'>
            <Image src={cusatlogo} width={100} height={100} alt="cusat" />
          </div>

          {/* CUCEK Text - Top Right */}
          <div className='cucek-text z-10 fixed top-8 mr-[2vw] md:right-12'>
            <h1 className='text-xs md:text-lg uppercase tracking-[0.3em] text-black font-light' style={{ fontFamily: 'textfont', letterSpacing: '0.2em' }}>CUCEK</h1>
          </div>

          {/* Tradition Reimagined - Bottom Left */}
          <div className='tradition-text z-10 fixed bottom-8 ml-[2vw] md:left-12'>
            <p className='text-xs md:text-sm uppercase tracking-[0.3em] text-black font-light' style={{ fontFamily: 'textfont', letterSpacing: '0.25em' }}>
              Tradition Reimagined
            </p>
          </div>

          <div className='fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4'>
            <nav className='hero-navbar opacity-0 translate-y-10'>
              <div className='flex items-center gap-6 md:gap-8 bg-white/10 backdrop-blur-md px-6 md:px-10 py-4 rounded-full border border-white/20'>
                <a href="#brochure" className='text-white hover:text-gray-300 transition-colors text-sm md:text-sm' style={{ fontFamily: 'textfont' }}>
                  Brochure
                </a>
                <a href="#total-points" className='text-white hover:text-gray-300 transition-colors text-sm md:text-sm' style={{ fontFamily: 'textfont' }} >
                  Total Points
                </a>
                <a href="#individual-points" className='text-white hover:text-gray-300 transition-colors text-sm md:text-sm' style={{ fontFamily: 'textfont' }}>
                  Individual Points
                </a>
                <a href="#gallery" className='text-white hover:text-gray-300 transition-colors text-sm md:text-sm' style={{ fontFamily: 'textfont' }}>
                  Gallery
                </a>
              </div>
            </nav>

            <button
              onClick={toggleMenu}
              className='hamburger-btn opacity-0 translate-y-10 bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 z-[101] relative'
            >
              <div className='flex flex-col gap-[6px] w-6'>
                <div className='hamburger-line-1 h-[2px] w-full bg-white rounded-full'></div>
                <div className='hamburger-line-2 h-[2px] w-full bg-white rounded-full'></div>
                <div className='hamburger-line-3 h-[2px] w-full bg-white rounded-full'></div>
              </div>
            </button>
          </div>

          <div className="inner-hero-wrapper relative h-screen">
            <div className="inner-hero rounded-[20px] h-[80vh] w-[90vw] overflow-hidden relative">
              <div className='h-[80vh] hero-bg overflow-hidden rounded-[20px] bg-[#0b090a]'>
              </div>

              <div className="absolute top-[37.5%] md:top-[50.5%] md:left-[10%] h-[50vh] z-30 ">
                <img src="/nbg2.png" className='hero-fore brightness-110 scale-190 translate-y-[6vh] translate-x-8 md:translate-x-0 md:scale-150' alt="" />
              </div>

              <div className='hero-overlay absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 pointer-events-none z-40'></div>
            </div>
          </div>

          <div className='year-2026 w-screen flex justify-end fixed bottom-7 mr-[2vw] md:right-12 z-10'>
            <h1 className='text-3xl' style={{ fontFamily: 'textfont' }}>2026</h1>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero