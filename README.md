# Meta Ads Manager - Instagram Engagement Ads

Bu uygulama, Instagram gönderilerinizi kullanarak etkileşim reklamları oluşturmanızı sağlar. Seçtiğiniz Instagram gönderisi ile DM (Direct Message) CTA'lı reklamlar oluşturabilirsiniz.

## Özellikler

- ✅ Instagram gönderilerinizi görüntüleme ve seçme
- ✅ Etkileşim odaklı reklam kampanyaları oluşturma
- ✅ DM (Direct Message) Call-to-Action
- ✅ Advantage+ hedefleme
- ✅ Carousel gönderileri desteği
- ✅ Türkçe arayüz

## Gereksinimler

1. **Facebook Access Token** - Facebook Developer hesabından alın
2. **Ad Account ID** - Facebook Ads Manager'dan alın (act_xxxxxxxxx formatında)
3. **Instagram Business Account** - Facebook sayfanızla bağlı olmalı.
4. **Page ID** - Instagram Business Account'ınızın bağlı olduğu Facebook sayfasının ID'si

## Kurulum

1. Projeyi klonlayın
2. `npm install` komutunu çalıştırın
3. `npm run dev` ile geliştirme sunucusunu başlatın

## Kullanım

### 1. API Bağlantısı
- Facebook Access Token'ınızı girin
- Ad Account ID'nizi girin
- Instagram sayfa ID'nizi girin
- "Bağlan" butonuna tıklayın

### 2. Kampanya Ayarları
- Kampanya adını belirleyin
- Günlük bütçeyi ayarlayın (minimum 20 TL)
- Performans hedefi: "Gönderi Etkileşimini En Üst Seviyeye Çıkar"
- Mesaj yönlendirme: "Instagram DM"

### 3. Instagram Gönderisi Seçimi
- "Gönderileri Yükle" butonuna tıklayın
- Reklamda kullanmak istediğiniz gönderiyi seçin
- "Kampanya Oluştur" butonuna tıklayın

### 4. Kampanya Oluşturma
- Sistem otomatik olarak kampanya, ad set ve reklam oluşturacak
- Kampanya duraklatılmış olarak oluşturulur
- Facebook Ads Manager'dan manuel olarak aktif edebilirsiniz

## API Endpoints

- `POST /api/connect` - API bağlantısını test eder
- `POST /api/posts` - Instagram gönderilerini getirir
- `POST /api/create-campaign` - Kampanya oluşturur

## Teknik Detaylar

- **Objective**: OUTCOME_ENGAGEMENT
- **Optimization Goal**: POST_ENGAGEMENT
- **Billing Event**: IMPRESSIONS
- **Platform**: Instagram
- **CTA**: SEND_MESSAGE
- **Targeting**: Türkiye, 18-65 yaş, Advantage+ hedefleme

## Sorun Giderme

### "Instagram Business Account bağlantısı bulunamadı" hatası
- Facebook sayfanızın Instagram Business Account ile bağlı olduğundan emin olun
- Instagram Business hesabınızın aktif olduğunu kontrol edin

### "Ad Account hatası" 
- Access token'ınızın geçerli olduğunu kontrol edin
- Ad Account ID'nizin doğru formatta olduğunu kontrol edin (act_xxxxxxxxx)

### "Medya hatası"
- Instagram hesabınızda gönderi olduğundan emin olun
- Access token'ınızın Instagram medya okuma iznine sahip olduğunu kontrol edin

## Güvenlik

- Access token'larınızı güvenli tutun
- Production ortamında CORS ayarlarını kısıtlayın
- Rate limiting uygulayın

## Lisans

MIT License 