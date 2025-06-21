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
        const { accessToken, adAccountId, pageId } = req.body;
        
        if (!accessToken || !adAccountId || !pageId) {
            return res.status(400).json({ 
                success: false, 
                error: 'Eksik parametreler' 
            });
        }
        
        // Ad Account'u test et
        const accountResponse = await fetch(
            `https://graph.facebook.com/v19.0/${adAccountId}?access_token=${accessToken}`
        );
        
        if (!accountResponse.ok) {
            const error = await accountResponse.json();
            return res.status(400).json({ 
                success: false, 
                error: `Ad Account hatası: ${error.error?.message || 'Bilinmeyen hata'}` 
            });
        }
        
        // Page'i test et
        const pageResponse = await fetch(
            `https://graph.facebook.com/v19.0/${pageId}?access_token=${accessToken}`
        );
        
        if (!pageResponse.ok) {
            const error = await pageResponse.json();
            return res.status(400).json({ 
                success: false, 
                error: `Sayfa hatası: ${error.error?.message || 'Bilinmeyen hata'}` 
            });
        }
        
        return res.status(200).json({ 
            success: true, 
            message: 'API bağlantısı başarılı' 
        });
        
    } catch (error) {
        console.error('Connect API Error:', error);
        return res.status(500).json({ 
            success: false, 
            error: error.message || 'Sunucu hatası'
        });
    }
}