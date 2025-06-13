"use client"

import { useEffect } from "react"
import { X, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ToastProps {
  message: string
  type: "success" | "error"
  onClose: () => void
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed bottom-6 right-6 bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex items-center gap-3 max-w-sm z-50">
      {type === "success" ? (
        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
      )}
      <span className="text-sm font-medium flex-1">{message}</span>
      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onClose}>
        <X className="w-4 h-4" />
      </Button>
    </div>
  )
}
