export default {
  async fetch(request, env, ctx) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    // API endpoint: /api/remove-bg
    if (url.pathname === '/api/remove-bg' && request.method === 'POST') {
      try {
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

        // Check API key
        if (!env.REMOVE_BG_API_KEY) {
          return new Response(
            JSON.stringify({ error: 'SERVER_ERROR', message: '服务器配置错误' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Parse form data
        const formData = await request.formData();
        const imageFile = formData.get('image_file');

        if (!imageFile) {
          return new Response(
            JSON.stringify({ error: 'NO_FILE', message: '请选择图片文件' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Validate file type
        if (!imageFile.type.startsWith('image/')) {
          return new Response(
            JSON.stringify({ error: 'INVALID_FORMAT', message: '请上传 JPG 或 PNG 格式的图片' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Validate file size
        if (imageFile.size > MAX_FILE_SIZE) {
          return new Response(
            JSON.stringify({ error: 'FILE_TOO_LARGE', message: '图片大小不能超过 5MB' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Call Remove.bg API
        const removeBgFormData = new FormData();
        removeBgFormData.append('image_file', imageFile);
        removeBgFormData.append('size', 'auto');

        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
          method: 'POST',
          headers: {
            'X-Api-Key': env.REMOVE_BG_API_KEY,
          },
          body: removeBgFormData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Remove.bg API error:', errorData);
          
          if (response.status === 402) {
            return new Response(
              JSON.stringify({ error: 'API_LIMIT', message: 'API 调用次数已达上限，请稍后重试' }),
              { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          
          return new Response(
            JSON.stringify({ error: 'PROCESSING_FAILED', message: '图片处理失败，请重试' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Get processed image
        const processedImageBlob = await response.blob();
        
        // Return processed image
        return new Response(processedImageBlob, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'image/png',
            'Cache-Control': 'no-cache',
          },
        });

      } catch (error) {
        console.error('Error processing image:', error);
        return new Response(
          JSON.stringify({ error: 'INTERNAL_ERROR', message: '服务器内部错误' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Health check
    if (url.pathname === '/api/health') {
      return new Response(
        JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 404 for unknown paths
    return new Response(
      JSON.stringify({ error: 'NOT_FOUND', message: '接口不存在' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  },
};
