"use client"

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Group } from 'three'

interface Model3DProps {
  modelPath: string
}

function Model({ modelPath }: Model3DProps) {
  const { scene } = useGLTF(modelPath)
  const modelRef = useRef<Group>(null)

  useFrame((state) => {
    if (modelRef.current) {
      // Rotación suave automática
      modelRef.current.rotation.y += 0.005
    }
  })

  return (
    <group ref={modelRef}>
      <primitive object={scene} scale={[2.5, 2.5, 2.5]} position={[0, -0.2, 0]} />
    </group>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
    </div>
  )
}

export default function Model3DViewer({ modelPath }: Model3DProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={1.2} color="#ffffff" />
        <directionalLight position={[0, 0, 10]} intensity={2.5} color="#ffffff" />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-10, 5, 5]} intensity={1.2} color="#f0f8ff" />
        <pointLight position={[0, 5, 8]} intensity={1.5} color="#ffffff" />
        <pointLight position={[5, 5, 5]} intensity={1.0} color="#fff8dc" />
        <pointLight position={[-5, -5, 5]} intensity={0.8} color="#e6f3ff" />
        <hemisphereLight args={["#ffffff", "#ffffff", 1.0]} />
        
        <Suspense fallback={null}>
          <Model modelPath={modelPath} />
        </Suspense>
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1.5}
          maxDistance={8}
          autoRotate={false}
        />
      </Canvas>
    </div>
  )
}

// Preload the model
useGLTF.preload('/oxwin3d.glb')