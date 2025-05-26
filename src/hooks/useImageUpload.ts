import { useState, useRef } from "react"

export function useImageUpload() {
  const [image, setImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImage(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }
  
  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }
  
  const handleRemoveImage = () => {
    setImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return {
    image,
    fileInputRef,
    handleImageUpload,
    triggerFileInput,
    handleRemoveImage
  }
} 