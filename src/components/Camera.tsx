import { useCamera } from '../hooks/useCamera'
import { Button } from './ui/button'

export function Camera() {
  const {
    cameraState,
    videoRef,
    capturedImage,
    error,
    requestCamera,
    captureImage,
    reset,
  } = useCamera()

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-red-500">Error: {error.message}</p>
        <Button onClick={reset} variant="destructive">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {cameraState === 'idle' && (
        <Button onClick={requestCamera}>Enable Camera</Button>
      )}

      {cameraState === 'requesting' && <p>Requesting camera access...</p>}

      {cameraState === 'streaming' && (
        <>
          <div className="relative w-full max-w-md">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              onLoadedMetadata={() => {
                console.log('Video metadata loaded')
              }}
              className="w-full rounded-lg shadow-lg bg-black"
              style={{ minHeight: '300px' }}
            />
          </div>
          <Button onClick={captureImage}>Take Picture</Button>
        </>
      )}

      {cameraState === 'captured' && capturedImage && (
        <>
          <div className="relative w-full max-w-md">
            <img
              src={capturedImage}
              alt="Captured food"
              className="w-full rounded-lg shadow-lg"
              onError={(e) => {
                console.error('Image failed to load', e)
              }}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={reset}>Take Another Picture</Button>
          </div>
        </>
      )}
    </div>
  )
} 