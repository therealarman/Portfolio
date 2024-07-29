import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import ParticleBackground from './ParticleBackground';


const App = () => {

  return (
    <div className="relative">
      <div className="h-screen flex bg-neutral-900 justify-center place-items-center">
        <ParticleBackground/>
        <h1 className="absolute text-9xl font-bold text-gray-100 mix-blend-exclusion">Arman Alexis</h1>
      </div>
    </div>
  )
}

export default App