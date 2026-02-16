"use client";
import { useState, useEffect } from "react";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import axios from 'axios';
import Navbar from "../components/Navbar";
import artsmain from "../../public/artmain.png";

gsap.registerPlugin(ScrollTrigger);

interface Event {
  cat: string;
  events: [string, string][];
}

interface SelectedEvent {
  code: string;
  name: string;
}

interface ResultItem {
  position: number;
  participant_code: string;
  name: string;
  mark: number;
}

const events: Event[] = [
  {
    'cat': 'LITERARY EVENTS',
    'events': [['EWM', 'ESSAY WRITING MALAYALAM'], ['EWE', 'ESSAY WRITING ENGLISH'], ['EWH', 'ESSAY WRITING HINDI'], ['PWM', 'POETRY WRITING MALAYALAM'], ['PWE', 'POETRY WRITING ENGLISH'], ['PWH', 'POETRY WRITING HINDI'], ['SSM', 'SHORT STORY MALAYALAM'], ['SSE', 'SHORT STORY ENGLISH'], ['SSH', 'SHORT STORY HINDI'], ['EM', 'ELOCUTION MALAYALAM'], ['EH', 'ELOCUTION HINDI'], ['EE', 'ELOCUTION ENGLISH'], ['RM', 'RECITATION MALAYALAM'], ['RE', 'RECITATION ENGLISH'], ['RH', 'RECITATION HINDI'], ['QZ', 'QUIZ'], ['FRM', 'FILM REVIEW MALAYALAM'], ['FRE', 'FILM REVIEW ENGLISH'], ['DE', 'DEBATE ENGLISH'], ['DM', 'DEBATE MALAYALAM'], ['DH', 'DEBATE HINDI']]
  },
  {
    'cat': 'FINE ARTS',
    'events': [['POC', 'PAINTING OIL COLOR'], ['PWC', 'PAINTING WATERCOLOR'], ['PND', 'PENCIL DRAWING'], ['POD', 'POSTER DESIGN'], ['COO', 'CARTOONING'], ['PG', 'PHOTOGRAPHY'], ['CRC', 'CARICATURE'], ['RG', 'RANGOLI'], ['CLG', 'COLLAGE'], ['MH', 'MEHNDI'], ['FP', 'FACE PAINTING'],]
  },
  {
    'cat': 'MUSIC',
    'events': [['LM', 'LIGHT MUSIC MALE'], ['LF', 'LIGHT MUSIC FEMALE'], ['CM', 'CLASSICAL MUSIC'], ['WSS', 'WESTERN SONG SOLO'], ['PE', 'INSTRUMENTAL PERCUSSION EASTERN'], ['PW', 'INSTRUMENTAL PERCUSSION WESTERN'], ['EW', 'INSTRUMENTAL NON PERCUSSION WIND EASTERN'], ['WW', 'INSTRUMENTAL NON PERCUSSION WIND WESTERN'], ['ES', 'INSTRUMENTAL NON PERCUSSION STRING EASTERN'], ['WS', 'INSTRUMENTAL NON PERCUSSION STRING WESTERN'], ['GM', 'EASTERN GROUP MUSIC'], ['WG', 'WESTERN GROUP SONG'], ['GA', 'GANAMELA'], ['MA', 'MAPPILAPATTU'], ['NA', 'NADANPATTU'], ['PS', 'PATRIOTIC SONG'], ['VAN', 'VANJIPATTU'],]
  },
  {
    'cat': 'DANCE',
    'events': [['SD', 'SOLO DANCE FOLK'], ['AT', 'ADAPT TUNE'], ['VP', 'VATTAPPATU'], ['OF', 'OPPANA FEMALE'], ['KK', 'KOLKALI'], ['TH', 'THIRUVATHIRA'], ['SS', 'STEP IN SYNCHRO'], ['VC', 'VIDEO CHOREOGRAPHY'], ['NO', 'NOSTALGIA'], ['WD', 'WESTERN GROUP DANCE'], ['GD', 'EASTERN GROUP DANCE'], ['MOH', 'MOHINIYATTAM'], ['BM', 'BHARATHANATTYAM (M)'], ['BF', 'BHARATHANATTYAM (F)'], ['KPF', 'KUCHIPPUDI (F)'], ['KPM', 'KUCHIPPUDI (M)'], ['MGK', 'MARGAMKALI'], ['FU', 'FUSION'], ['DFF', 'DUFFMUTTU']]
  },
  {
    'cat': 'THEATRE',
    'events': [['MT', 'MONO ACT'], ['MY', 'MIMICRY'], ['MI', 'MIME'], ['SK', 'SKIT'], ['KP', 'KATHAPRASANGM'], ['D', 'DRAMA'], ['FAD', 'FANCY DRESS'], ['R', 'RAMP']]
  }
];

const baseUrl = "YOUR_API_BASE_URL"; 

export default function IndividualArtsPoints() {
  const [selectedCategory, setSelectedCategory] = useState<Event>(events[0]);
  const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [result, setResult] = useState<ResultItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const overlay = document.getElementById('transition-overlay');
    if (overlay && overlay.style.opacity !== '0') {
      gsap.to(overlay, {
        opacity: 0,
        onComplete: () => {
          overlay.style.zIndex = '-1';
        }
      });
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const artstl = gsap.timeline({ease:"none"});

    gsap.set(['.arts-title','.arts-title1','.arts-img'],{
        opacity:0,
    });

    artstl.to('.arts-title',{
        opacity:1,
        duration:1.5
    })

    artstl.fromTo(['.arts-title1'],{
        x:'-100%',
        scale:0.9
    },{
        x:'0',
        scale:0.92,
        opacity:1,
        duration:1,
        ease:"power4",
        stagger:0.5
    },0)

    artstl.fromTo(
      '.category-card',
      {
        y: 30,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.out",
      }
    ,0.5);

    artstl.fromTo(
      '.event-card',
      {
        y: 20,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        stagger: 0.05,
        duration: 0.5,
        ease: "power2.out",
        delay: 0.3
      }
    ,0.6);

    artstl.to(['.cat','.events'],{
        opacity:1,
        y:'-15px',
        duration:1
    },0.5)
    
    gsap.to('.arts-img',{
        opacity:1,
        scale:1.0,
        y:'-2vh',
        scrollTrigger:{
            trigger:'.arts',
            start:'center 70%',
            end:'100%',
            scrub:3.9,
            
        },
        duration:2,
    })

  }, [mounted, selectedCategory]);

  async function fetchData(code: string) {
    try {
      const response = await axios.get(`${baseUrl}/getIndividualArts?code=${code}`);
      const sortedData = response.data.sort((a: ResultItem, b: ResultItem) => a.position - b.position);
      setResult(sortedData);
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  }

  return (
    <div className="min-h-screen md:h-[160vh]  arts overflow-hidden bg-[#0b090a] text-white" id="individual-points">
        <div className="arts-title text-[80px]  md:text-[150px] text-center relative " style={{fontFamily:'Astila-Regular'}}><p className="top-[8vh] md:top-[12vh] absolute rotate-270 -left-[8%] md:-left-[5%]">ARTS</p>
            <img src={artsmain.src} alt=""  className="absolute top-[35vh] scale-200 md:top-0 md:-mt-[35vh] md:scale-90 brightness-50 md:brightness-70 arts-img"/>
        </div>
      <div className="pt-[28vh] md:pt-[20vh] pb-12 px-4 md:px-8 arts-title1">
        <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-[#ce6464dd] text-center mb-4" style={{ fontFamily: 'var(--font-text)' }}>
          Performance Breakdown
        </p>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center text-[#fef9ef]" style={{ fontFamily: 'Astila-Regular' }}>
          Individual Arts
        </h1>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center text-[#fef9ef]" style={{ fontFamily: 'Astila-Regular' }}>
          Results
        </h1>
      </div>

      <div className="max-w-7xl cat mt-8 opacity-0 mx-auto px-4 md:px-8 mb-8">
        <div className="relative inline-block w-full md:w-auto">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full md:w-80 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4 text-left flex items-center justify-between hover:bg-white/10 transition-all duration-300"
          >
            <span className="text-lg font-semibold text-[#fef9ef]" style={{ fontFamily: 'var(--font-text)' }}>
              {selectedCategory.cat}
            </span>
            <svg
              className={`w-5 h-5 text-[#ce6464dd] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute z-50 mt-2 w-full md:w-80 bg-[#1a1a1a] backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              {events.map((category, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-6 py-4 hover:bg-white/5 transition-colors duration-200 border-b border-white/5 last:border-b-0"
                  style={{ fontFamily: 'var(--font-text)' }}
                >
                  <span className="text-[#fef9ef]">{category.cat}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl events opacity-0 mx-auto px-4 md:px-8 pb-20">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#ce6464dd] mb-6" style={{ fontFamily: 'Astila-Regular' }}>
          {selectedCategory.cat}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedCategory.events.map(([code, name], i) => (
            <div
              key={i}
              className="event-card bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 cursor-pointer hover:bg-white/10 hover:border-[#ce6464dd]/50 transition-all duration-300 group"
              onClick={() => {
                setSelectedEvent({ code, name });
                fetchData(code);
                setIsModalOpen(true);
              }}
            >
              <div className="flex items-start gap-3">
                <span className="text-[#ce6464dd] font-bold text-sm px-3 py-1 bg-[#ce6464dd]/10 rounded-full" style={{ fontFamily: 'var(--font-text)' }}>
                  {code}
                </span>
                <span className="flex-1 text-[#fef9ef] group-hover:text-white transition-colors" style={{ fontFamily: 'var(--font-text)' }}>
                  {name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50 px-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#ce6464dd] font-bold text-sm px-3 py-1 bg-[#ce6464dd]/10 rounded-full" style={{ fontFamily: 'var(--font-text)' }}>
                  {selectedEvent.code}
                </span>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#fef9ef]" style={{ fontFamily: 'Astila-Regular' }}>
                {selectedEvent.name}
              </h2>
              <p className="text-sm text-white/50 mt-1" style={{ fontFamily: 'var(--font-text)' }}>
                Results & Rankings
              </p>
            </div>

            <div className="flex-1 overflow-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-[#1a1a1a] border-b border-white/10">
                  <tr>
                    <th className="text-left p-3 text-white/70 font-semibold" style={{ fontFamily: 'var(--font-text)' }}>Rank</th>
                    <th className="text-left p-3 text-white/70 font-semibold" style={{ fontFamily: 'var(--font-text)' }}>Code</th>
                    <th className="text-left p-3 text-white/70 font-semibold" style={{ fontFamily: 'var(--font-text)' }}>Name</th>
                    <th className="text-right p-3 text-white/70 font-semibold" style={{ fontFamily: 'var(--font-text)' }}>Mark</th>
                  </tr>
                </thead>
                <tbody>
                  {result.map((res, index) => (
                    <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${res.position === 1 ? 'bg-yellow-500/20 text-yellow-500' :
                            res.position === 2 ? 'bg-gray-400/20 text-gray-400' :
                              res.position === 3 ? 'bg-orange-500/20 text-orange-500' :
                                'bg-white/5 text-white/50'
                          }`} style={{ fontFamily: 'var(--font-text)' }}>
                          {res.position}
                        </div>
                      </td>
                      <td className="p-3 text-[#ce6464dd] font-semibold uppercase" style={{ fontFamily: 'var(--font-text)' }}>
                        {res.participant_code}
                      </td>
                      <td className="p-3 text-[#fef9ef]" style={{ fontFamily: 'var(--font-text)' }}>
                        {res.name}
                      </td>
                      <td className="p-3 text-right font-bold text-[#fef9ef]" style={{ fontFamily: 'var(--font-text)' }}>
                        {res.mark}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-[#ce6464dd] hover:bg-[#ce6464dd]/80 text-white font-semibold py-3 rounded-xl transition-colors"
                style={{ fontFamily: 'var(--font-text)' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed top-1/2 -left-[10%]  -translate-y-1/2 opacity-5 pointer-events-none">
        <p className="text-[15vw] font-bold -rotate-270 origin-center text-[#ce6464dd]" style={{ fontFamily: 'Astila-Regular' }}>
          ARTS
        </p>
      </div>
      <Navbar currentPage="arts" />
    </div>
  );
}