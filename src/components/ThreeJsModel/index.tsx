'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface ThreeJsModelProps {
  modelPath: string;
  width?: string;
  height?: string;
  backgroundColor?: string;
  autoRotate?: boolean;
  onRotate?: (direction: 'clockwise' | 'counterclockwise', value: number) => void;
  activeInput?: 'hours' | 'minutes' | null;
  position?: 'center' | 'corner';
}

interface LoadingEvent {
  loaded: number;
  total: number;
}

// Keep track of existing renderers to reuse them
let globalRenderer: THREE.WebGLRenderer | null = null;

const ThreeJsModel: React.FC<ThreeJsModelProps> = ({
  modelPath,
  width = '100%',
  height = '500px',
  backgroundColor = 'transparent',
  autoRotate = true,
  onRotate,
  activeInput = null,
  position = 'corner'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const rotationSpeedRef = useRef(0.005);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const lastMousePosRef = useRef<{x: number, y: number} | null>(null);
  const lastRotationRef = useRef(0);
  const frameIdRef = useRef<number | null>(null);

  // Track accumulated rotation for value changes
  const accumulatedRotationRef = useRef(0);

  // Clean up resources
  const cleanupResources = () => {
    if (frameIdRef.current !== null) {
      cancelAnimationFrame(frameIdRef.current);
      frameIdRef.current = null;
    }
    
    if (modelRef.current && sceneRef.current) {
      // Remove model from scene
      sceneRef.current.remove(modelRef.current);
      
      // Properly dispose of geometries and materials
      modelRef.current.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) {
            object.geometry.dispose();
          }
          
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => {
                if (material.map) material.map.dispose();
                material.dispose();
              });
            } else {
              if (object.material.map) object.material.map.dispose();
              object.material.dispose();
            }
          }
        }
      });
      
      modelRef.current = null;
    }
    
    if (controlsRef.current) {
      controlsRef.current.dispose();
      controlsRef.current = null;
    }
    
    // Don't dispose of the renderer, as we're reusing it
    if (rendererRef.current && mountRef.current) {
      try {
        mountRef.current.removeChild(rendererRef.current.domElement);
      } catch (e) {
        console.log('Error removing renderer from mount', e);
      }
    }

    rendererRef.current = null;
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Clean up any previous resources
    cleanupResources();

    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Reuse or create renderer
    let renderer: THREE.WebGLRenderer;
    
    if (!globalRenderer) {
      renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: backgroundColor === 'transparent',
        powerPreference: 'default'
      });
      globalRenderer = renderer;
    } else {
      renderer = globalRenderer;
    }
    
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(backgroundColor === 'transparent' ? 0x000000 : backgroundColor, backgroundColor === 'transparent' ? 0 : 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    try {
      mountRef.current.appendChild(renderer.domElement);
    } catch (e) {
      console.error('Error appending renderer to mount', e);
      return;
    }
    
    rendererRef.current = renderer;

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Add a secondary directional light from below for better illumination
    const fillLight = new THREE.DirectionalLight(0x3366ff, 0.5);
    fillLight.position.set(-1, -1, -1);
    scene.add(fillLight);

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.autoRotate = autoRotate && !activeInput;
    controls.autoRotateSpeed = 2.0;
    
    // Limit rotation to y-axis only when being used as a knob
    if (activeInput) {
      controls.minPolarAngle = Math.PI / 2; // 90 degrees
      controls.maxPolarAngle = Math.PI / 2; // 90 degrees
      controls.enableZoom = false;
    }
    
    controlsRef.current = controls;

    // Handle rotation with debouncing
    let rotationTimeout: NodeJS.Timeout | null = null;
    
    const processRotationChange = () => {
      if (!modelRef.current || !activeInput) return;
      
      const currentRotation = modelRef.current.rotation.y;
      const rotationDelta = currentRotation - lastRotationRef.current;
      
      lastRotationRef.current = currentRotation;
      accumulatedRotationRef.current += rotationDelta;
      
      const threshold = Math.PI / 12;
      if (Math.abs(accumulatedRotationRef.current) >= threshold) {
        const direction = accumulatedRotationRef.current > 0 ? 'counterclockwise' : 'clockwise';
        const steps = Math.floor(Math.abs(accumulatedRotationRef.current) / threshold);
        
        accumulatedRotationRef.current = accumulatedRotationRef.current % threshold;
        
        if (onRotate) {
          try {
            onRotate(direction, steps);
          } catch (e) {
            console.error('Error in onRotate callback', e);
          }
        }
      }
    };

    const handleControlsChange = () => {
      if (rotationTimeout) {
        clearTimeout(rotationTimeout);
      }
      
      rotationTimeout = setTimeout(() => {
        processRotationChange();
      }, 10);
    };
    
    controls.addEventListener('change', handleControlsChange);

    // Mouse events for manual rotation
    const handleMouseDown = (e: MouseEvent) => {
      if (!activeInput || !modelRef.current) return;
      
      e.preventDefault();
      setIsDragging(true);
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      lastRotationRef.current = modelRef.current.rotation.y;
      
      if (controlsRef.current) {
        controlsRef.current.enabled = false;
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !lastMousePosRef.current || !modelRef.current || !activeInput) return;
      
      e.preventDefault();
      const deltaX = e.clientX - lastMousePosRef.current.x;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      
      // Invert deltaX for more natural rotation
      const rotationAmount = -deltaX * 0.01;
      modelRef.current.rotation.y += rotationAmount;
      
      // Track rotation consistently
      accumulatedRotationRef.current += rotationAmount;
      
      // Process rotation at a threshold
      const threshold = Math.PI / 12;
      if (Math.abs(accumulatedRotationRef.current) >= threshold) {
        const direction = accumulatedRotationRef.current > 0 ? 'counterclockwise' : 'clockwise';
        const steps = Math.floor(Math.abs(accumulatedRotationRef.current) / threshold);
        
        accumulatedRotationRef.current = accumulatedRotationRef.current % threshold;
        
        if (onRotate) {
          try {
            onRotate(direction, steps);
          } catch (e) {
            console.error('Error in onRotate callback', e);
          }
        }
      }
    };
    
    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      setIsDragging(false);
      lastMousePosRef.current = null;
      
      if (controlsRef.current) {
        controlsRef.current.enabled = true;
      }
    };
    
    // Add mouse events to the mountRef element directly
    const el = renderer.domElement;
    if (activeInput) {
      el.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    // Load 3D model with progress tracking
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      if (itemsTotal > 0) {
        setLoadingProgress(Math.floor((itemsLoaded / itemsTotal) * 100));
      }
    };
    
    const loader = new GLTFLoader(loadingManager);
    setModelLoaded(false);
    
    loader.load(
      modelPath,
      (gltf: GLTF) => {
        // If component has been unmounted or model changed, don't proceed
        if (!mountRef.current || !sceneRef.current) return;
        
        modelRef.current = gltf.scene;
        
        // Center the model
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        gltf.scene.position.x = -center.x;
        gltf.scene.position.y = -center.y;
        gltf.scene.position.z = -center.z;
        
        // Scale the model to fit the view
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxDim;
        gltf.scene.scale.set(scale, scale, scale);
        
        // Initial rotation
        gltf.scene.rotation.y = 0;
        lastRotationRef.current = 0;
        
        sceneRef.current.add(gltf.scene);
        setModelLoaded(true);
        setLoadingProgress(100);
      },
      (xhr: LoadingEvent) => {
        // Only update progress if total exists and is not zero
        if (xhr.total && xhr.total > 0) {
          const progress = Math.floor((xhr.loaded / xhr.total) * 100);
          setLoadingProgress(progress);
        }
      },
      (error: unknown) => {
        console.error('Error loading model:', error);
      }
    );

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      if (modelRef.current && isHovering && !activeInput) {
        // Auto-rotate when hovering but not active
        modelRef.current.rotation.y += rotationSpeedRef.current * 3;
      } else if (modelRef.current && !autoRotate && !activeInput) {
        // Manual rotation when not autoRotating or active
        modelRef.current.rotation.y += rotationSpeedRef.current;
      }
      
      if (rendererRef.current && cameraRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    frameIdRef.current = requestAnimationFrame(animate);

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup on unmount or effect rerun
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (activeInput) {
        el.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      }
      
      if (controlsRef.current) {
        controlsRef.current.removeEventListener('change', handleControlsChange);
      }
      
      if (rotationTimeout) {
        clearTimeout(rotationTimeout);
      }
      
      cleanupResources();
    };
  }, [modelPath, backgroundColor, autoRotate, isHovering, isDragging, activeInput, onRotate]);

  // CSS classes
  const positionClass = position === 'center' ? 'absolute inset-0' : '';
  const cursorStyle = activeInput ? 'cursor-ew-resize' : 'cursor-grab';

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width, 
        height, 
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '12px',
        cursor: cursorStyle,
        boxShadow: activeInput ? '0 0 20px rgba(0, 0, 255, 0.2)' : 'none',
        transition: 'box-shadow 0.3s ease'
      }}
      className={`${positionClass} ${activeInput ? 'focus:outline-none focus:ring-2 focus:ring-[#0000FF]' : ''} webgl-container`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      tabIndex={activeInput ? 0 : -1}
    >
      {(!modelLoaded || loadingProgress < 100) && (
        <div 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 10
          }}
        >
          <div>Loading 3D Model...</div>
          <div className="w-full max-w-[80%] h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {activeInput && modelLoaded && (
        <div 
          className="absolute top-0 left-0 w-full p-2 text-center text-sm font-bold bg-[#0000FF] bg-opacity-70 text-white"
        >
          Adjust {activeInput === 'hours' ? 'Hours' : 'Minutes'}
        </div>
      )}
    </div>
  );
};

export default ThreeJsModel; 