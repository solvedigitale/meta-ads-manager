export default async function handler(req, res) {
    // CORS ayarları
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { accessToken, pageId } = req.body;
        
        if (!accessToken || !pageId) {
            return res.status(400).json({ 
                success: false, 
                error: 'Access token ve page ID gerekli' 
            });
        }
        
        // Önce Instagram Business Account ID'sini al
        const pageResponse = await fetch(
            `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`
        );
        
        if (!pageResponse.ok) {
            const error = await pageResponse.json();
            return res.status(400).json({ 
                success: false, 
                error: `Page hatası: ${error.error?.message || 'Bilinmeyen hata'}` 
            });
        }
        
        const pageData = await pageResponse.json();
        const instagramAccountId = pageData.instagram_business_account?.id;
        
        if (!instagramAccountId) {
            return res.status(400).json({ 
                success: false, 
                error: 'Instagram Business Account bağlantısı bulunamadı. Lütfen sayfanızı Instagram Business hesabıyla bağlayın.' 
            });
        }
        
        // Instagram medyalarını al
        const mediaResponse = await fetch(
            `https://graph.facebook.com/v18.0/${instagramAccountId}/media?fields=id,media_type,media_url,permalink,caption,timestamp&limit=20&access_token=${accessToken}`
        );
        
        if (!mediaResponse.ok) {
            const error = await mediaResponse.json();
            return res.status(400).json({ 
                success: false, 
                error: `Medya hatası: ${error.error?.message || 'Bilinmeyen hata'}` 
            });
        }
        
        const mediaData = await mediaResponse.json();
        
        // Sadece IMAGE ve VIDEO tiplerini filtrele
        const posts = mediaData.data?.filter(post => 
            post.media_type === 'IMAGE' || post.media_type === 'VIDEO'
        ) || [];
        
        return res.status(200).json({ 
            success: true, 
            posts: posts,
            instagramAccountId: instagramAccountId
        });
        
    } catch (error) {
        console.error('Posts API Error:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Sunucu hatası' 
        });
    }
  }