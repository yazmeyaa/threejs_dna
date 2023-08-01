import { useEffect, useRef, useState } from "react"
import { DNA } from "./three/dna";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [DNAInstance, setDNAInstance] = useState<DNA | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return;
    setDNAInstance(new DNA(canvasRef.current))
  }, [])

  useEffect(() => {
    console.log(DNAInstance)
  }, [DNAInstance])
  return (
    <main>
      <canvas id="renderer" ref={canvasRef}>
        Enable JS to view project
      </canvas>
    </main>
  )
}

export default App
