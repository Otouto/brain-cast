interface PlatformIconsProps {
  formattedContent: {
    linkedin?: string
    twitter?: string
  }
}

export function PlatformIcons({ formattedContent }: PlatformIconsProps) {
  return (
    <div className="flex space-x-1">
      {formattedContent.linkedin && (
        <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
          in
        </div>
      )}
      {formattedContent.twitter && (
        <div className="h-6 w-6 rounded-full bg-blue-400 flex items-center justify-center text-white text-xs font-bold">
          X
        </div>
      )}
    </div>
  )
} 