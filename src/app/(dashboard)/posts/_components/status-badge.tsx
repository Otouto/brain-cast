interface StatusBadgeProps {
  status: 'draft' | 'pending' | 'published'
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <div className={`inline-flex rounded-full px-2 py-1 text-xs ${
      status === 'published' 
        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
        : status === 'pending'
        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' 
        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  )
} 