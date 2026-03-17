# Image Background Remover

基于 Next.js + Tailwind CSS 的智能图片背景移除工具。

## 功能特性

- ✨ **拖拽上传** - 支持拖拽上传和点击选择图片
- 🤖 **AI 驱动** - 使用 Remove.bg API 自动移除背景
- 👀 **实时预览** - 处理前后对比展示
- 💾 **一键下载** - 下载透明背景 PNG 图片
- 📱 **响应式设计** - 支持桌面和移动设备
- ⚡ **快速处理** - 几秒内完成背景移除

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **部署**: Vercel / 任何支持 Edge Runtime 的平台
- **API**: Remove.bg API

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/code-join-max/image-background-remover.git
cd image-background-remover
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

创建 `.env.local` 文件：

```env
REMOVE_BG_API_KEY=your_remove_bg_api_key_here
```

获取 API Key: https://www.remove.bg/api

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 5. 构建生产版本

```bash
npm run build
```

## 项目结构

```
image-background-remover/
├── app/
│   ├── api/
│   │   └── remove-bg/
│   │       └── route.ts      # API 路由
│   ├── globals.css           # 全局样式
│   ├── layout.tsx            # 根布局
│   └── page.tsx              # 主页面
├── components/
│   ├── ImageUploader.tsx     # 图片上传组件
│   ├── ImagePreview.tsx      # 图片预览组件
│   └── ProcessingStatus.tsx  # 处理状态组件
├── public/                   # 静态资源
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## API 接口

### POST /api/remove-bg

移除图片背景

**请求**
```http
POST /api/remove-bg
Content-Type: multipart/form-data

image_file: <binary_image_data>
```

**参数**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| image_file | File | 是 | 图片文件，JPG/PNG，最大5MB |

**成功响应**
```http
HTTP/1.1 200 OK
Content-Type: image/png

<binary_png_data>
```

**错误响应**
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "FILE_TOO_LARGE",
  "message": "图片大小不能超过 5MB"
}
```

## 部署

### 部署到 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/code-join-max/image-background-remover)

### 环境变量

在部署平台设置以下环境变量：

- `REMOVE_BG_API_KEY` - Remove.bg API Key

## 成本估算

### Remove.bg API 定价

| 套餐 | 价格 | 月调用量 |
|------|------|----------|
| 免费 | $0 | 50张 |
| 基础 | $9/月 | 200张 |
| 标准 | $39/月 | 1,000张 |

### Vercel 成本

- 免费额度：100GB 带宽/月
- 对于大多数个人项目足够使用

## 许可证

MIT

## 相关链接

- [Remove.bg API 文档](https://www.remove.bg/api)
- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
