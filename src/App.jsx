import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ParticleBackground from './ParticleBackground';
import Lenis from 'lenis'

gsap.registerPlugin(ScrollToPlugin);
gsap.registerPlugin(ScrollTrigger);


const App = () => {

  const comp = useRef(null)
  const particleBgRef = useRef(null);
  const lenis = new Lenis()

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const introTL = gsap.timeline()
      introTL
        .to(window, {scrollTo: {y: 0, autoKill: false}, duration: 0})  // Scroll to top
        .set(document.body, {overflow: "hidden"})
        .to("#hello1", {opacity: "1", duration: 0.5, delay: 0.3,})
        .set("#hello1", {opacity: "0"}, "+=0.3")
        .set("#hello2", {opacity: "1"})
        .set("#hello2", {opacity: "0"}, "+=0.1")
        .set("#hello3", {opacity: "1"})
        .set("#hello3", {opacity: "0"}, "+=0.1")
        .set("#hello4", {opacity: "1"})
        .set("#hello4", {opacity: "0"}, "+=0.1")
        .set("#hello5", {opacity: "1"})
        .set("#hello5", {opacity: "0"}, "+=0.1")
        .set("#hello6", {opacity: "1"})
        .set(document.body, {overflow: "auto"}, "+=0.3")
        .to("#hello-slider", {yPercent: -100, duration: 1}, "+=0.3")

      lenis.on('scroll', (e) => {
        console.log(e)
      })
      
      lenis.on('scroll', ScrollTrigger.update)
      
      gsap.ticker.add((time)=>{
        lenis.raf(time * 1000)
      })
      
      gsap.ticker.lagSmoothing(0)

      gsap.set("#particleCanvas", { filter: "blur(0px)" });
      gsap.to("#particleCanvas", {
        filter: "blur(10px)",
        scrollTrigger: {
          trigger: particleBgRef.current,
          start: "center",
          end: "bottom",
          scrub: true,
          markers: true
        }
      });

    }, comp)

    return () => ctx.revert()
  }, [])

  return (
    <div className="relative" ref={comp}>

      <div
        id="hello-slider"
        className="h-screen flex fixed bg-gray-950 justify-center place-items-center z-10 w-full pl-scrollbar-padding"
        // className="flex justify-center items-center h-screen bg-black"
      >
        <h1
          id="hello1"
          className="absolute text-5xl text-gray-100 opacity-0">Hello</h1>
        <h1
          id="hello2"
          className="absolute text-5xl text-gray-100 opacity-0">Բարեւ</h1>
        <h1
          id="hello3"
          className="absolute text-5xl text-gray-100 opacity-0">Bonjou</h1>
        <h1
          id="hello4"
          className="absolute text-5xl text-gray-100 opacity-0">おはよ</h1>
        <h1
          id="hello5"
          className="absolute text-5xl text-gray-100 opacity-0">Guten Tag</h1>
        <h1
          id="hello6"
          className="absolute text-5xl text-gray-100 opacity-0">مرحبا</h1>
      </div>

       <div ref={particleBgRef} className="h-screen flex bg-black justify-center place-items-center">
         <ParticleBackground/>
         <h1 className="text-9xl font-bold text-white mix-blend-exclusion">Arman Alexis</h1>
       </div>

      <div className="h-screen flex bg-gray-800 justify-center place-items-center"></div>
      <div className="h-screen flex bg-gray-800 justify-center place-items-center"></div>


    </div>
  )
}

export default App