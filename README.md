# Image Background Remover

一个用于去除图片背景的自动化工具。

## 功能特性

- 自动识别并去除图片背景
- 支持批量处理
- 支持多种图片格式（PNG, JPG, WEBP）
- 简单易用的 API 接口

## 技术栈

- Node.js
- Express.js
- 图像处理库（待确定）

## 快速开始

```bash
# 克隆项目
git clone https://github.com/yourusername/image-background-remover.git
cd image-background-remover

# 安装依赖
npm install

# 启动服务
npm start
```

## API 接口

### 上传图片并去除背景

```http
POST /api/remove-background
Content-Type: multipart/form-data

file: <图片文件>
```

## 许可证

MIT
