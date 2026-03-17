import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY || ''
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: NextRequest) {
  try {
    // Check API key
    if (!REMOVE_BG_API_KEY) {
      return NextResponse.json(
        { error: 'SERVER_ERROR', message: '服务器配置错误' },
        { status: 500 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const imageFile = formData.get('image_file') as File

    if (!imageFile) {
      return NextResponse.json(
        { error: 'NO_FILE', message: '请选择图片文件' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!imageFile.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'INVALID_FORMAT', message: '请上传 JPG 或 PNG 格式的图片' },
        { status: 400 }
      )
    }

    // Validate file size
    if (imageFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'FILE_TOO_LARGE', message: '图片大小不能超过 5MB' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Call Remove.bg API
    const removeBgFormData = new FormData()
    removeBgFormData.append('image_file', new Blob([buffer], { type: imageFile.type }), imageFile.name)
    removeBgFormData.append('size', 'auto')

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': REMOVE_BG_API_KEY,
      },
      body: removeBgFormData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Remove.bg API error:', errorData)
      
      if (response.status === 402) {
        return NextResponse.json(
          { error: 'API_LIMIT', message: 'API 调用次数已达上限，请稍后重试' },
          { status: 429 }
        )
      }
      
      return NextResponse.json(
        { error: 'PROCESSING_FAILED', message: '图片处理失败，请重试' },
        { status: 500 }
      )
    }

    // Get processed image
    const processedImageBlob = await response.blob()
    
    // Return processed image
    return new NextResponse(processedImageBlob, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache',
      },
    })

  } catch (error) {
    console.error('Error processing image:', error)
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: '服务器内部错误' },
      { status: 500 }
    )
  }
}
