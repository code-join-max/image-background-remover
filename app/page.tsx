'use client'

import { useState, useRef, useCallback } from 'react'
import ImageUploader from '@/components/ImageUploader'
import ImagePreview from '@/components/ImagePreview'
import ProcessingStatus from '@/components/ProcessingStatus'

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const handleImageSelect = useCallback(async (file: File) => {
    // 重置状态
    setError(null)
    setProcessedImage(null)
    setProgress(0)

    // 验证文件
    if (!file.type.startsWith('image/')) {
      setError('请上传图片文件（JPG 或 PNG）')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('图片大小不能超过 5MB')
      return
    }

    // 显示原图预览
    const reader = new FileReader()
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // 开始处理
    setIsProcessing(true)
    setProgress(30)

    try {
      const formData = new FormData()
      formData.append('image_file', file)

      setProgress(60)

      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      })

      setProgress(90)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || '处理失败，请重试')
      }

      // 获取处理后的图片 blob
      const blob = await response.blob()
      const processedUrl = URL.createObjectURL(blob)
      setProcessedImage(processedUrl)
      setProgress(100)
    } catch (err) {
      setError(err instanceof Error ? err.message : '处理失败，请重试')
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const handleReset = useCallback(() => {
    setOriginalImage(null)
    setProcessedImage(null)
    setError(null)
    setProgress(0)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Image Background Remover
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            智能去除图片背景
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            无需注册，打开即用。几秒内获得透明背景的专业图片。
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-md mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 text-sm">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Upload or Preview Section */}
        {!originalImage ? (
          <ImageUploader onImageSelect={handleImageSelect} />
        ) : (
          <div className="space-y-6">
            <ImagePreview
              originalImage={originalImage}
              processedImage={processedImage}
              isProcessing={isProcessing}
            />

            {isProcessing && <ProcessingStatus progress={progress} />}

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              {processedImage && (
                <a
                  href={processedImage}
                  download="removed-bg.png"
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  下载透明背景图片
                </a>
              )}

              <button
                onClick={handleReset}
                disabled={isProcessing}
                className="px-8 py-3 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                处理新图片
              </button>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '⚡',
              title: '快速处理',
              desc: '几秒内完成背景移除，无需等待'
            },
            {
              icon: '🎨',
              title: 'AI 驱动',
              desc: '使用先进的 AI 技术，边缘识别精准'
            },
            {
              icon: '🔒',
              title: '隐私安全',
              desc: '图片仅临时处理，不保存到服务器'
            }
          ].map((feature, index) => (
            <div key={index} className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-100 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <p className="text-center text-gray-500 text-sm">
            © 2024 Image Background Remover | 免费使用
          </p>
        </div>
      </footer>
    </main>
  )
}
