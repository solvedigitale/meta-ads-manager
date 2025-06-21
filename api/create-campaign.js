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
        const { 
            accessToken, 
            adAccountId, 
            pageId, 
            campaignName, 
            dailyBudget, 
            selectedPost 
        } = req.body;
        
        if (!accessToken || !adAccountId || !pageId || !campaignName || !dailyBudget || !selectedPost) {
            return res.status(400).json({ 
                success: false, 
                error: 'Eksik parametreler' 
            });
        }
        
        // 1. Kampanya oluştur - OUTCOME_ENGAGEMENT objective
        const campaignData = new URLSearchParams({
            name: campaignName,
            objective: 'OUTCOME_ENGAGEMENT',
            status: 'PAUSED',
            special_ad_categories: '[]',
            access_token: accessToken
        });
        
        const campaignResponse = await fetch(
            `https://graph.facebook.com/v19.0/${adAccountId}/campaigns`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: campaignData
            }
        );
        
        if (!campaignResponse.ok) {
            const error = await campaignResponse.json();
            throw new Error(`Kampanya hatası: ${error.error?.message || 'Bilinmeyen hata'}`);
        }
        
        const campaign = await campaignResponse.json();
        
        // 2. Ad Set oluştur - Engagement için Advantage+ targeting
        const adSetData = new URLSearchParams({
            name: `${campaignName} - Ad Set`,
            campaign_id: campaign.id,
            daily_budget: (dailyBudget * 100).toString(),
            billing_event: 'IMPRESSIONS',
            optimization_goal: 'POST_ENGAGEMENT',
            bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
            targeting: JSON.stringify({
                geo_locations: { countries: ['TR'] },
                age_min: 18,
                age_max: 65,
                publisher_platforms: ['instagram'],
                device_platforms: ['mobile', 'desktop']
            }),
            status: 'PAUSED',
            access_token: accessToken
        });
        
        const adSetResponse = await fetch(
            `https://graph.facebook.com/v19.0/${adAccountId}/adsets`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: adSetData
            }
        );
        
        if (!adSetResponse.ok) {
            const error = await adSetResponse.json();
            throw new Error(`Ad Set hatası: ${error.error?.message || 'Bilinmeyen hata'}`);
        }
        
        const adSet = await adSetResponse.json();
        
        // 3. Creative oluştur - Instagram Story Ad with selected post
        const creativeData = new URLSearchParams({
            name: `${campaignName} - Creative`,
            object_story_spec: JSON.stringify({
                instagram_actor_id: pageId,
                link_data: {
                    link: `https://www.instagram.com/direct/t/${pageId}`,
                    message: 'Bize DM gönderin! 💬',
                    name: campaignName,
                    description: 'Sorularınız için bize yazın.',
                    call_to_action: {
                        type: 'SEND_MESSAGE'
                    },
                    image_hash: selectedPost.media_url ? await uploadImage(selectedPost.media_url, accessToken, adAccountId) : null
                }
            }),
            access_token: accessToken
        });
        
        const creativeResponse = await fetch(
            `https://graph.facebook.com/v19.0/${adAccountId}/adcreatives`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: creativeData
            }
        );
        
        if (!creativeResponse.ok) {
            const error = await creativeResponse.json();
            throw new Error(`Creative hatası: ${error.error?.message || 'Bilinmeyen hata'}`);
        }
        
        const creative = await creativeResponse.json();
        
        // 4. Ad oluştur
        const adData = new URLSearchParams({
            name: `${campaignName} - Ad`,
            adset_id: adSet.id,
            creative: JSON.stringify({ creative_id: creative.id }),
            status: 'PAUSED',
            access_token: accessToken
        });
        
        const adResponse = await fetch(
            `https://graph.facebook.com/v19.0/${adAccountId}/ads`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: adData
            }
        );
        
        if (!adResponse.ok) {
            const error = await adResponse.json();
            throw new Error(`Ad hatası: ${error.error?.message || 'Bilinmeyen hata'}`);
        }
        
        const ad = await adResponse.json();
        
        return res.status(200).json({ 
            success: true,
            campaignId: campaign.id,
            adSetId: adSet.id,
            adId: ad.id,
            message: 'Kampanya başarıyla oluşturuldu'
        });
        
    } catch (error) {
        console.error('Create Campaign Error:', error);
        return res.status(500).json({ 
            success: false, 
            error: error.message || 'Sunucu hatası'
        });
    }
}

// Helper function to upload image and get image_hash
async function uploadImage(imageUrl, accessToken, adAccountId) {
    try {
        // Download the image
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = await imageResponse.arrayBuffer();
        
        // Upload to Facebook
        const uploadData = new URLSearchParams({
            bytes: Buffer.from(imageBuffer).toString('base64'),
            access_token: accessToken
        });
        
        const uploadResponse = await fetch(
            `https://graph.facebook.com/v19.0/${adAccountId}/adimages`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: uploadData
            }
        );
        
        if (uploadResponse.ok) {
            const uploadResult = await uploadResponse.json();
            return uploadResult.images?.hash;
        }
        
        return null;
    } catch (error) {
        console.error('Image upload error:', error);
        return null;
    }
}