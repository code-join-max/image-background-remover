'use client'

interface ProcessingStatusProps {
  progress: number
}

export default function ProcessingStatus({ progress }: ProcessingStatusProps) {
  const getStatusText = () => {
    if (progress < 30) return '正在上传图片...'
    if (progress < 60) return '正在分析图片...'
    if (progress < 90) return 'AI 正在去除背景...'
    if (progress < 100) return '正在生成结果...'
    return '处理完成！'
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">{getStatusText()}</span>
          <span className="text-sm font-bold text-blue-600">{progress}%</span>
        </div>

        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          >
            <div className="w-full h-full bg-white/30 animate-pulse"></div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>预计剩余时间：{progress < 100 ? '10-20 秒' : '已完成'}</span>
        </div>
      </div>
    </div>
  )
}
