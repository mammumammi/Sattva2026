"use client";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import React, { act, useEffect, useRef, useState } from 'react'
import sattva from '../../assets/sattva.png';
import cusat from '../../assets/cusatlogo.png';
import Navbar from './Navbar';

gsap.registerPlugin(ScrollTrigger);
type TimeLeft ={
  days:number;
  hours:number;
  minutes:number;
  seconds:number;
}

const TARGET_DATE = new Date("2026-03-07T00:00:00")

interface DepartmentData {
  name: string;
  shortName: string;
  artsPoints: number;
  sportsPoints: number;
  totalPoints: number;
  color: string;
}


const departmentsData: DepartmentData[] = [
  { name: "Computer Science", shortName: "CS", artsPoints: 245, sportsPoints: 189, totalPoints: 434, color: "#ce6464dd" },
  { name: "Electrical", shortName: "EE", artsPoints: 198, sportsPoints: 234, totalPoints: 432, color: "#ce6464dd" },
  { name: "Electronics", shortName: "EC", artsPoints: 223, sportsPoints: 187, totalPoints: 410, color: "#ce6464dd" },
  { name: "Mechanical", shortName: "ME", artsPoints: 176, sportsPoints: 198, totalPoints: 374, color: "#ce6464dd" },
  { name: "Civil", shortName: "CE", artsPoints: 189, sportsPoints: 165, totalPoints: 354, color: "#ce6464dd" },
  { name: "Information Technology", shortName: "IT", artsPoints: 167, sportsPoints: 156, totalPoints: 323, color: "#ce6464dd" },
];

const Hero = () => {  
  const [activeView, setActiveView] = useState<'total' | 'arts' | 'sports'>('total');

  const pointRef = useRef<HTMLDivElement>(null);
const pointCardRef = useRef<HTMLDivElement>(null);

  const [sortedDepts, setSortedDepts] = useState(departmentsData);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  const [width, setWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 768);

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

  useEffect(() => {
    const overlay = document.getElementById('transition-overlay');
    if (overlay && overlay.style.opacity !== '0') {
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          overlay.style.zIndex = '-1';
        }
      });
      
      // Don't proceed with GSAP setup until overlay is done
      setTimeout(() => {
        const isMobile = window.innerWidth <= 768;
        gsap.set('.hero-fore', {
          x: 0,
          transformOrigin: "center center",
          force3D: true // Force GPU acceleration
        });
      }, 600); // Wait for overlay animation to complete
    }
  }, []);

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
      const handleResize = () => {
        setWidth(window.innerWidth);
      };
      
      // Set initial width
      handleResize();
      
      // Add resize listener
      window.addEventListener('resize', handleResize);
      
      return () => window.removeEventListener('resize', handleResize);
    }, []);

  
    useEffect(() => {
      if (!mounted) return;

      gsap.set('.hero-fore', {
        x:  width > 768 ? 0 : "100px",
        transformOrigin: "center center"
      });

      gsap.set(".about-text", {
        clearProps: "all",
        position: "absolute",
        top: "60%",
        left: "50%",
        y: "-50%",
        opacity: 0
      });

      

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".inner-hero-wrapper",
          pin: '.inner-hero-wrapper',
          start: "top top",
          end: width > 768 ? "+=200%" : "+=100%", // Extended pin duration for future content
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
        scale: width > 768 ? 0.95 : 1.5,
        y:width >768 ? "-30%" : '-10%',
        x:0,
        ease:"sine.in"
      },0)

     

      tl.to('.about-text',{
        opacity: 1,
        scale: width > 768 ? 1.2 : 1.3,
        duration:1,
        yPercent: width > 768 ? -40 : -10, 
        
        // y:'-10vh',
        scrollTrigger:{
          scrub:1.2
        },
        zIndex:width > 768 ? 30 : 60
      },0.5);

      gsap.to('.hero-fore',{
        opacity:0,
        scrollTrigger:{
          trigger:'.hero-fore',
          start: width > 768 ? '50% top' : '30% top',
          end:'center 40%',
          scrub:1
        },
        duration:1,
        
      })

      // Animate text color to white
      tl.to(
        [".hero-text",".tradition"],
        {
          filter: "brightness(0) invert(1)",
          duration: 1,
          ease: "power2.out",
          
        },
        0.35 // Start at same time as container expansion
      );

    
      
     

      tl.set('.hero-text',{
        opacity:0,
        duration:1,
        ease:"circ.in"
      })


      const atl = gsap.timeline({scrollTrigger:{
        trigger:'.about-content',
        scrub: 0.5,
        start: width > 768 ? 'top 30%' : 'top 40%',
        end:'+=100%',
        
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


      const ptl = gsap.timeline({scrollTrigger:{
        trigger:'.point-content',
        start:width > 768 ? "top 80%" : "top 90%",
        end: "+=100%",
        toggleActions: "play reverse play reverse",
        scrub:0.6,
      },
    ease:"none"})

      ptl.to('.point-title',{
        opacity:1,
        color:'#fef9ef',
        y:"-20%",
        scale:1.2,
        duration:0.5,
        
      })

    //   const pointtl = gsap.timeline({scrollTrigger:{
    //     trigger:'.point-content',
    //     start:width > 768 ? "top 70%" : "bottom 90%",
    //     end: "+=100%",
    //     toggleActions: "play reverse play reverse",
    //     scrub:1.5,
    //     pin:pointRef.current,
        
    //     markers:true,
    // }})

    // pointtl.to(pointCardRef.current,{
    //   x:'-100px',
    //   duration:5,
      
    // })

    // pointtl.to(pointCardRef.current,{
    //   scale:1.2,
    //   duration:2
    // },0.2)
    
      return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    }, [mounted,width]);

    useEffect(() => {
      if (!mounted || !pointRef.current) return;
    
      const ctx = gsap.context(() => {
    
        const container = pointRef.current;
        if (!container) return; // Add this null check
    
    
        const totalWidth = container.scrollWidth;
        const viewportWidth = window.innerWidth;

        gsap.set(".point-card", { scale: 0.6,opacity:0 });

    
        const horizontalTween = gsap.to(container, {
          x: () => width > 768 ? -(totalWidth - viewportWidth) - 600 :  -(totalWidth - viewportWidth) - 200,
          opacity:1,
          ease: "none",
          scrollTrigger: {
            trigger: ".point-content",
            start: "top top",
            end: () => `+=${totalWidth}`,
            scrub: 1.2,
            pin: true,
            anticipatePin: 1,
          }
        });
        

        gsap.utils.toArray(".point-card").forEach((card: any) => {
          gsap.fromTo(card,
            { scale: 0.5 },
            {
              scale: 1.0,
              opacity:1,
              scrollTrigger: {
                trigger: card,
                containerAnimation: horizontalTween,
                start: "center 80%",
                end: "center 20%",
                scrub: true,
              }
            }
          );
        });
        
    
      });
    
      return () => ctx.revert();
    }, [mounted,width]);
    

    useEffect(() => {
        setWidth(window.innerWidth);
    },[])

    useEffect( () => {
      const sorted = [...departmentsData].sort((a, b) => {
        if (activeView === 'total') return b.totalPoints - a.totalPoints;
        if (activeView === 'arts') return b.artsPoints - a.artsPoints;
        return b.sportsPoints - a.sportsPoints;
      });
      setSortedDepts(sorted);
  
    },[activeView]);

    const maxPoints = Math.max(...sortedDepts.map(d =>
      activeView === 'total' ? d.totalPoints :
        activeView === 'arts' ? d.artsPoints : d.sportsPoints
    ));

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
    <div className='overflow-hidden w-screen '>
    <div className='min-h-[200vh] md:min-h-[300vh] relative '> {/* Increased height for extended pin */}
      <div className="max-w-none flex flex-col justify-center ">
        <img src={cusat.src} className='hero-text w-[50px] ml-[5vw] z-10 fixed top-[1vh] left-0' style={{fontFamily:'hisyam'}}></img>
        
        <div className="inner-hero-wrapper  relative h-screen"> {/* Changed to h-screen */}
          <div className="inner-hero rounded-[20px] h-[60vh] md:h-[80vh] w-[90vw] overflow-hidden relative">
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
              <div className='h-[30vh] md:h-[80vh] hero-bg  overflow-hidden rounded-[20px] bg-[#0b090a]'>
                
              </div>

              <div className="absolute  top-[37.5%]   md:top-[50.5%] md:left-[10%] h-[30vh] md:h-[50vh] z-50 ">
                <img src="/nbg2.png" className='hero-fore brightness-110 scale-190 translate-y-[6vh] translate-x-8 md:translate-x-0  md:scale-150' alt="" />
              </div>


              <div className='about-text absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0 opacity-0' style={{fontFamily:'Astila-Regular'}}>
  <img src={sattva.src} alt="" />
</div>          
          </div>
        </div>
        <div className='top-[93vh] tradition left-[6vw] fixed text-amber-950'>
          <p className='text-[10px] md:text-[16px]'  style={{ fontFamily: 'textfont', letterSpacing: '0.25em' }}>TRADITION REIMAGINED</p>
        </div>
        <div className='w-screen flex justify-end fixed top-[91vh] md:top-[89vh] right-[4vw]  z-10'>
          <h1 className='hero-text text-[50px] md:text-[70px]  ' style={{fontFamily:'Astila-Regular'}}>2026</h1>
        </div>

        

        {/* Future content area - will be visible after pin ends */}
        
      </div>
      
    </div>


    {/* Total Point Board */}
    <div className='bg-[#0b090a]   min-h-screen flex flex-col point-content md:text-[30px] text-[20px] text-[#d24b4b57]   w-screen relative p-[20px] md:p-[5vw]' style={{fontFamily:'Astila-Regular'}} >

    <div className='text-[30px] md:text-[80px] opacity-0 mt-[10vh] scale-120 md:scale-100 md:mt-[0vh] point-title text-center md:space-y-[-50px] space-y-[-16px]' >

    
    <p className=''>Department</p>
    <p className='text-[#ce6464dd]'>Standings</p>
    </div>
    <div id='point-table'
  className='point-table flex md:flex-row gap-x-[50px] h-[60dvh] md:h-[400px] pr-[80vw] mt-[15vh] md:mt-[50px]'
  ref={pointRef}
>
    {sortedDepts.map((dept,index) => {
      const currentPoints =
      activeView === 'total' ? dept.totalPoints :
        activeView === 'arts' ? dept.artsPoints : dept.sportsPoints;

    const percentage = (currentPoints / maxPoints) * 100;

    return(
      <div
  key={dept.shortName}
  className="point-card min-w-[250px] md:min-w-[400px] h-[120px] md:h-[300px] bg-white/5  rounded-[20px]  p-[20px]"
>
  {/* Rank Badge */}
  <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-[#ce6464dd] flex items-center justify-center">
                <span className="text-white font-bold text-lg" style={{ fontFamily: 'textfont' }}>
                  {index + 1}
                </span>
              </div>

              {/* Department Short Name - Large Background */}
              <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                <h2 className="text-9xl font-bold" style={{ fontFamily: 'textfont', color: dept.color }}>
                  {dept.shortName}
                </h2>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-[25px] font-extrabold text-[#fef9ef] mb-2 tracking-wider" style={{ fontFamily: 'textfont' }}>
                  {dept.name}
                </h3>
                <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-6" style={{ fontFamily: 'textfont' }}>
                  {dept.shortName}
                </p>

                {/* Points Display */}
                <div className="mb-6">
                  <div className="flex items-end gap-2 mb-2">
                    <p className="text-3xl md:text-4xl font-bold text-[#fef9ef]" style={{ fontFamily: 'Astila-Regular' }}>
                      {currentPoints}
                    </p>
                    <span className="text-sm text-white/50 pb-2" style={{ fontFamily: 'textfont' }}>
                      points
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: dept.color,
                      }}
                    />
                  </div>
                </div>

                {/* Breakdown - Only show when total view is active */}
                {activeView === 'total' && (
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-white/40 mb-1" style={{ fontFamily: 'textfont' }}>
                        Arts
                      </p>
                      <p className="text-2xl font-bold text-[#fef9ef]" style={{ fontFamily: 'Astila-Regular' }}>
                        {dept.artsPoints}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-white/40 mb-1" style={{ fontFamily: 'textfont' }}>
                        Sports
                      </p>
                      <p className="text-2xl font-bold text-[#fef9ef]" style={{ fontFamily: 'Astila-Regular' }}>
                        {dept.sportsPoints}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Decorative Corner Element */}
              <div className="absolute bottom-0 left-0 w-24 h-24 opacity-10">
                <div
                  className="absolute bottom-0 left-0 w-full h-full rounded-tr-full"
                  style={{ backgroundColor: dept.color }}
                />
              </div>
</div>

    )
    })}
    </div>
    {/* <div className='about-img  bg-white rounded-[20px] w-screen h-[200px] md:h-[300px]'>IMage 1</div>
    <div className='about-img  bg-white rounded-[20px] w-screen h-[200px] md:h-[300px]'>IMage 1</div>
    <div className='about-img  bg-white rounded-[20px] w-screen h-[200px] md:h-[300px]'>IMage 1</div>
    <div className='about-img  bg-white rounded-[20px] w-screen h-[200px] md:h-[300px]'>IMage 1</div>
    <div className='about-img  bg-white rounded-[20px] w-screen h-[200px] md:h-[300px]'>IMage 1</div>
    <div className='about-img  bg-white rounded-[20px] w-screen h-[200px] md:h-[300px]'>IMage 1</div> */}
      
    </div>
    </div>
  )
}

export default Hero