'use client'

interface ImagePreviewProps {
  originalImage: string
  processedImage: string | null
  isProcessing: boolean
}

export default function ImagePreview({ originalImage, processedImage, isProcessing }: ImagePreviewProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {/* Original Image */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">原始图片</span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">原图</span>
        </div>
        <div className="p-4 bg-gray-50">
          <div className="relative aspect-square rounded-xl overflow-hidden bg-white shadow-inner">
            <img
              src={originalImage}
              alt="原始图片"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* Processed Image */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">处理后</span>          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">透明背景</span>
        </div>
        <div className="p-4 bg-gray-50">
          <div 
            className="relative aspect-square rounded-xl overflow-hidden shadow-inner"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #e5e7eb 25%, transparent 25%),
                linear-gradient(-45deg, #e5e7eb 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #e5e7eb 75%),
                linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)
              `,
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              backgroundColor: '#f9fafb'
            }}
          >
            {processedImage ? (
              <img
                src={processedImage}
                alt="处理后图片"
                className="w-full h-full object-contain animate-fade-in"
              />
            ) : isProcessing ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin"></div>
                  <p className="text-gray-500 text-sm">AI 正在处理...⏎