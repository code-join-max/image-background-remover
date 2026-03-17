const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.json());

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 根路径
app.get('/', (req, res) => {
  res.json({
    message: 'Image Background Remover API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      removeBackground: '/api/remove-background (POST)'
    }
  });
});

// 去除背景接口（占位）
app.post('/api/remove-background', (req, res) => {
  res.json({
    message: 'Background removal endpoint - 待实现',
    status: 'placeholder'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
