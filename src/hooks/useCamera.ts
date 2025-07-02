import { useState, useRef, useCallback, useEffect } from 'react'

type CameraState = 'idle' | 'requesting' | 'streaming' | 'captured' | 'error'

export function useCamera() {
  const [cameraState, setCameraState] = useState<CameraState>('idle')
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Effect to handle video stream attachment
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
      // Ensure video plays after stream is attached
      videoRef.current.play().catch(err => {
        console.error('Error playing video:', err)
      })
    }
  }, [stream])

  const requestCamera = useCallback(async () => {
    setCameraState('requesting')
    setError(null)
    setCapturedImage(null)
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not available on this browser.')
      }
      
      // Request camera with more specific constraints
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      })
      
      setStream(mediaStream)
      setCameraState('streaming')
    } catch (err) {
      console.error('Camera error:', err)
      setError(err instanceof Error ? err : new Error(String(err)))
      setCameraState('error')
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setCameraState('idle')
    setCapturedImage(null)
  }, [stream])

  const captureImage = useCallback(() => {
    if (videoRef.current && stream) {
      const video = videoRef.current
      const canvas = document.createElement('canvas')
      
      // Use actual video dimensions
      canvas.width = video.videoWidth || video.clientWidth
      canvas.height = video.videoHeight || video.clientHeight
      
      const context = canvas.getContext('2d')
      if (context && canvas.width > 0 && canvas.height > 0) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9)
        setCapturedImage(imageDataUrl)
        setCameraState('captured')
        
        // Stop stream after capturing
        stream.getTracks().forEach((track) => track.stop())
        setStream(null)
        if (videoRef.current) {
          videoRef.current.srcObject = null
        }
      } else {
        console.error('Canvas context not available or invalid dimensions')
      }
    }
  }, [stream])

  return {
    cameraState,
    videoRef,
    capturedImage,
    error,
    requestCamera,
    captureImage,
    reset: stopCamera,
  }
} 