"use client"

import { Button } from "@/components/ui/button"
import { Image as ImageIcon, X, Upload } from "lucide-react"
import { RefObject } from "react"

interface ImageUploadProps {
  image: string | null
  fileInputRef: RefObject<HTMLInputElement | null>
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onTriggerFileInput: () => void
  onRemoveImage: () => void
}

export function ImageUpload({
  image,
  fileInputRef,
  onImageUpload,
  onTriggerFileInput,
  onRemoveImage
}: ImageUploadProps) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <h2 className="text-lg font-semibold mb-3">Add Image</h2>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={onImageUpload}
      />
      
      {image ? (
        <div className="relative">
          <img 
            src={image} 
            alt="Uploaded preview" 
            className="max-h-[200px] mx-auto rounded-md" 
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={onRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div 
          className="flex items-center justify-center h-[120px] rounded-md border border-dashed bg-muted/50 cursor-pointer"
          onClick={onTriggerFileInput}
        >
          <div className="text-center flex flex-col items-center">
            <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag & drop or click to upload
            </p>
            <Button variant="outline" size="sm" onClick={(e) => {
              e.stopPropagation();
              onTriggerFileInput();
            }}>
              <Upload className="mr-2 h-3 w-3" />
              Upload
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 