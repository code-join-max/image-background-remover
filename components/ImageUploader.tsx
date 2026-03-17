'use client'

import { useCallback, useState } from 'react'

interface ImageUploaderProps {
  onImageSelect: (file: File) => void
}

export default function ImageUploader({ onImageSelect }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      onImageSelect(files[0])
    }
  }, [onImageSelect])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onImageSelect(files[0])
    }
  }, [onImageSelect])

  return (
    <div className="max-w-2xl mx-auto">
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative block w-full p-12 rounded-3xl border-3 border-dashed
          transition-all duration-300 cursor-pointer
          ${isDragging
            ? 'border-blue-500 bg-blue-50 scale-105 shadow-xl'
            : 'border-gray-300 bg-white/70 hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-lg'
          }
        `}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="text-center">
          {/* Upload Icon */}
          <div className={`
            w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center
            transition-all duration-300
            ${isDragging
              ? 'bg-blue-500 scale-110'
              : 'bg-gradient-to-br from-blue-100 to-purple-100'
            }
          `}>
            <svg
              className={`w-12 h-12 transition-colors duration-300 ${
                isDragging ? 'text-white' : 'text-blue-500'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          {/* Text */}
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {isDragging ? '松开以上传图片' : '拖拽图片到此处'}
          </h3>
          <p className="text-gray-500 mb-4">
            或点击选择文件
          </p>

          {/* File Info */}
          <div className="inline-flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              支持 JPG, PNG
            </span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              最大 5MB
            </span>
          </div>
        </div>
      </label>

      {/* Sample Images */}
      <div className="mt-8">
        <p className="text-center text-sm text-gray-500 mb-4">示例图片（点击快速体验）</p>
        <div className="flex justify-center gap-4">
          {[
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop'
          ].map((url, index) => (
            <button
              key={index}
              onClick={async () => {
                try {
                  const response = await fetch(url)
                  const blob = await response.blob()
                  const file = new File([blob], `sample-${index + 1}.jpg`, { type: 'image/jpeg' })
                  onImageSelect(file)
                } catch (err) {
                  console.error('Failed to load sample image:', err)
                }
              }}
              className="w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-200"
            >
              <img
                src={url}
                alt={`示例 ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
