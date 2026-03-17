import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Image Background Remover - 智能图片背景移除',
  description: '简单、快速的在线图片背景移除工具，上传图片即可获得透明背景',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
