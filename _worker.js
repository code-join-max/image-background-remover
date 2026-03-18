// Cloudflare Pages Worker - API Route Handler
// REMOVE_BG_API_KEY should be set in Cloudflare Dashboard Environment Variables

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle API requests
    if (url.pathname === '/api/remove-bg' && request.method === 'POST') {
      return handleRemoveBg(request, env);
    }
    
    if (url.pathname === '/api/health') {
      const keyConfigured = !!env.REMOVE_BG_API_KEY;
      return new Response(JSON.stringify({ 
        status: 'ok', 
        api_key_configured: keyConfigured,
        api_key_preview: keyConfigured ? env.REMOVE_BG_API_KEY.substring(0, 5) + '...' : null
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Serve static files from dist
    return env.ASSETS.fetch(request);
  }
};

async function handleRemoveBg(request, env) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    const REMOVE_BG_API_KEY = env.REMOVE_BG_API_KEY;

    if (!REMOVE_BG_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'SERVER_ERROR', message: '服务器配置错误：缺少 API Key，请在 Cloudflare Dashboard 中设置 REMOVE_BG_API_KEY 环境变量' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const formData = await request.formData();
    const imageFile = formData.get('image_file');

    if (!imageFile) {
      return new Response(
        JSON.stringify({ error: 'NO_FILE', message: '请选择图片文件' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!imageFile.type.startsWith('image/')) {
      return new Response(
        JSON.stringify({ error: 'INVALID_FORMAT', message: '请上传 JPG 或 PNG 格式的图片' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
        'X-Api-Key': REMOVE_BG_API_KEY,
      },
      body: removeBgFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Remove.bg API error:', errorData);
      
      if (response.status === 403) {
        return new Response(
          JSON.stringify({ error: 'API_KEY_INVALID', message: 'Remove.bg API Key 无效，请在 Cloudflare Dashboard 中更新' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'API_LIMIT', message: 'API 调用次数已达上限，请稍后重试' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'PROCESSING_FAILED', message: '图片处理失败：' + (errorData.errors?.[0]?.title || '未知错误') }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const processedImageBlob = await response.blob();
    
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
      JSON.stringify({ error: 'INTERNAL_ERROR', message: '服务器内部错误：' + error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
