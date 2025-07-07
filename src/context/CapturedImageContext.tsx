import React, { createContext, useContext, useState } from 'react'

interface CapturedImageContextType {
  capturedImage: string | null
  setCapturedImage: (img: string | null) => void
}

const CapturedImageContext = createContext<CapturedImageContextType | undefined>(undefined)

export const CapturedImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  return (
    <CapturedImageContext.Provider value={{ capturedImage, setCapturedImage }}>
      {children}
    </CapturedImageContext.Provider>
  )
}

export function useCapturedImage() {
  const context = useContext(CapturedImageContext)
  if (!context) {
    throw new Error('useCapturedImage must be used within a CapturedImageProvider')
  }
  return context
} 