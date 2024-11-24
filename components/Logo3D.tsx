import { Canvas, useFrame } from '@react-three/fiber'
import { Text3D, OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

function AnimatedText() {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    meshRef.current.rotation.x = Math.sin(time / 4)
    meshRef.current.rotation.y = Math.sin(time / 2)
  })

  return (
    <mesh ref={meshRef}>
      <Text3D 
        font="/fonts/helvetiker_bold.typeface.json"
        size={0.5}
        height={0.2}
        curveSegments={12}
      >
        AMT IA
        <meshNormalMaterial />
      </Text3D>
    </mesh>
  )
}

export default function Logo3D() {
  return (
    <Canvas camera={{ position: [0, 0, 2] }}>
      <OrbitControls enableZoom={false} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <AnimatedText />
    </Canvas>
  )
}

