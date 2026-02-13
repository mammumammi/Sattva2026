"use client";
import { div } from 'framer-motion/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import React, { useEffect, useState } from 'react'
import sattva from '../../assets/sattva.png';
import cusat from '../../assets/cusatlogo.png';

gsap.registerPlugin(ScrollTrigger);
type TimeLeft ={
  days:number;
  hours:number;
  minutes:number;
  seconds:number;
}

const TARGET_DATE = new Date("2026-03-07T00:00:00")


const Hero = () => {  
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

    const [width,setWidth] = useState<number | null>(null);

    const calculateTimeLeft = (): TimeLeft => {
      const now = new Date().getTime();

      const difference = TARGET_DATE.getTime() - now;

      if (difference <=0){
          return { days:0,hours:0,minutes:0,seconds:0};
      }

      return{
          days:Math.floor(difference/(1000*60*60*24)),
          hours:Math.floor((difference/(1000*60*60)) % 24),
          minutes:Math.floor((difference/(1000*60)) % 60),
          seconds:Math.floor((difference/1000) % 60),
      };
  }

  const [timeLeft,setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect( () => {
    setMounted(true);
      const timer = setInterval( () => {
          setTimeLeft(calculateTimeLeft())
      },1000);

      
      return () => clearInterval(timer);
  },[]);


  
  

  const TimeBox = ({ label, value }: { label: string; value: number }) => (
      <div className="text-[40px] " style={{fontFamily:'Astila-Regular'}}>
        {value}
      </div>
    );

  
    useEffect(() => {
      if (!mounted) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".inner-hero-wrapper",
          pin: '.inner-hero-wrapper',
          start: "top top",
          end: "+=200%", // Extended pin duration for future content
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
    
      // Animate container expansion (no scale on image)
      tl.fromTo(
        [".inner-hero",".hero-bg"],
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
        0 // Start at timeline position 0,
      )



      tl.to('.hero-fore',{
        scale: width > 768 ? 0.85 : 1.5,
        y:width >768 ? "-30%" : '-10%',
        ease:"sine.in"
      },0)


      tl.to('.about-text',{
        opacity: 1,
        scale:1.2,
        duration:1,
        // y:'-40vh',
        y:'-10vh',
        scrollTrigger:{
          srub:1.2
        },
        zIndex:30
      },0.7);

      gsap.to('.hero-fore',{
        opacity:0,
        scrollTrigger:{
          trigger:'hero-fore',
          start: width > 768 ? '20% top' : '30% top',
          scrub:1
        },
        duration:3,
        
      })

      // Animate text color to white
      tl.to(
        ".hero-text",
        {
          filter: "brightness(0) invert(1)",
          duration: 1,
          ease: "power2.out",
          
        },
        0.35 // Start at same time as container expansion
      );

    
      
      tl.set('.hero-fore',{
        display:"fixed"
      },1.4)


      const atl = gsap.timeline({scrollTrigger:{
        trigger:'.about-content',
        scrub: 0.5,
        start: width > 768 ? 'top 30%' : 'top 40%',
        end:'+=100%',
        markers:true
      }})

      gsap.set(".about-img", {
        transformOrigin: "center center",
        position: "absolute",
        top: (i) => i * 450,
        left: "50%",
        x: "-50%",
      });

      atl.to('.about-img',{
        height: width > 768 ? '350px' : '300px',
        width: width > 768 ? '60vw' : '80vw',
        y:"20%",
        duration:4,
      },0)

      atl.to('.about1',{
        opacity:1,
        color:'#fef9ef',
        y:"-10%",
        duration:2
      },0.9)

      atl.to('.about2',{
        opacity:1,
  
        y:"-10%",
        duration:2
      },1.2)



    
      return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    }, [mounted]);

    useEffect(() => {
        setWidth(window.innerWidth);
    },[])

    // useEffect(() => {
    //   if (!mounted) return;
    
    //   const handleMouseMove = (e: MouseEvent) => {
    //     const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
    //     const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
        
    //     gsap.to('.hero-fore', {
    //       x: -x*4 , // Move opposite direction, adjust 50 for intensity
    //       y: -y*2 ,
    //       duration: 0.5,
    //       ease: "power2.out"
    //     });
    //   };
    
    //   window.addEventListener('mousemove', handleMouseMove);
    
    //   return () => {
    //     window.removeEventListener('mousemove', handleMouseMove);
    //   };
    // }, [mounted]);

    // useEffect(() => {
    //   if (!mounted || typeof window === 'undefined') return;
    
    //   const handleOrientation = (e: any) => { // Changed to 'any' to avoid type issues
    //     const x = (e.gamma || 0) / 45;
    //     const y = (e.beta || 0) / 90;
        
    //     console.log('Tilt:', x, y); // Debug log
        
    //     gsap.to('.hero-fore', {
    //       x: -x * 40,
    //       y: -y * 20,
    //       duration: 0.5,
    //       ease: "power2.out"
    //     });
    //   };
    
    //   // Check if DeviceOrientationEvent exists
    //   if (typeof window.DeviceOrientationEvent !== 'undefined') {
    //     // For iOS 13+
    //     if (typeof (window.DeviceOrientationEvent as any).requestPermission === 'function') {
    //       (window.DeviceOrientationEvent as any).requestPermission()
    //         .then((response: string) => {
    //           if (response === 'granted') {
    //             window.addEventListener('deviceorientation', handleOrientation);
    //           }
    //         })
    //         .catch((error: any) => console.error('Permission denied', error));
    //     } else {
    //       // Android and other devices
    //       window.addEventListener('deviceorientation', handleOrientation);
    //     }
    //   } else {
    //     console.log('DeviceOrientation not supported');
    //   }
    
    //   return () => {
    //     window.removeEventListener('deviceorientation', handleOrientation);
    //   };
    // }, [mounted]);
    // if (!mounted) return null;

  return (
    <div>
    <div className='min-h-[300vh] overflow-hidden'> {/* Increased height for extended pin */}
      <div className="max-w-none flex flex-col justify-center">
        <img src={cusat.src} className='hero-text w-[50px] ml-[5vw] z-10 fixed top-[1vh] left-0' style={{fontFamily:'hisyam'}}></img>
        
        <div className="inner-hero-wrapper  relative h-screen"> {/* Changed to h-screen */}
          <div className="inner-hero rounded-[20px] h-[80vh] w-[90vw] overflow-hidden relative">
            {/* <div className="hero-img relative h-full w-full overflow-hidden rounded-[20px]">
              <img 
                src="/sattva2.jpg" 
                className="h-[100vh] scale-150 w-[100vw] object-cover" 
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
                alt="" 
              />
            </div> */}
              <div className='h-[80vh] hero-bg  overflow-hidden rounded-[20px] bg-[#0b090a]'>
                
              </div>

              <div className="absolute  top-[37.5%]   md:top-[50.5%] md:left-[10%]  h-[50vh] z-50 ">
                <img src="/nbg2.png" className='hero-fore brightness-110 scale-190 translate-y-[6vh] translate-x-8 md:translate-x-0  md:scale-150' alt="" />
              </div>


              <div className=' about-text left-1/2 -translate-x-1/2   space-x-5 text-[150px] md:text-[250px] text-[white] absolute top-[50%] z-0 opacity-0 ' style={{fontFamily:'Astila-Regular'}} >
                {/* <img src={sattva.src} alt="" /> */}
                <p>SATTVA</p>
              </div>

              
          </div>
        </div>
        
        <div className='w-screen flex justify-end fixed top-[89vh] right-[4vw]  z-10'>
          <h1 className='hero-text text-[70px] ' style={{fontFamily:'Astila-Regular'}}>2026</h1>
        </div>

        {/* Future content area - will be visible after pin ends */}
        
      </div>
      
    </div>
    <div className='bg-[#0b090a] h-[200vh] flex flex-col about-content md:text-[30px] text-[20px] text-[#495057] text-center  w-screen relative p-[20px] md:p-[5vw]' style={{fontFamily:'Astila-Regular'}} >
    <div className='about-img  bg-white rounded-[20px] w-screen h-[200px] md:h-[300px]'>IMage 1</div>
    <div className='about-img  bg-white rounded-[20px] w-screen h-[200px] md:h-[300px]'>IMage 1</div>
    <div className='about-img  bg-white rounded-[20px] w-screen h-[200px] md:h-[300px]'>IMage 1</div>
    <div className='about-img  bg-white rounded-[20px] w-screen h-[200px] md:h-[300px]'>IMage 1</div>
    <div className='about-img  bg-white rounded-[20px] w-screen h-[200px] md:h-[300px]'>IMage 1</div>
    <div className='about-img  bg-white rounded-[20px] w-screen h-[200px] md:h-[300px]'>IMage 1</div>
      
    </div>
    </div>
  )
}

export default Hero