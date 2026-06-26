# 📚 Kütüphane Arşivi — 3 Çalışma Bölümü

Tek sayfalık (tek dosya) bir podcast/öğrenme arşivi. Açılışta **3 büyük kart** çıkar; tıklayınca
**aynı sekmede, URL değişmeden** ilgili kütüphane açılır:

| Kart | Kütüphane | Renk |
|------|-----------|------|
| 🏥 | **NHG-Richtlijnen** | yeşil |
| 🚑 | **Het Acute Boekje** | kızıl |
| 📊 | **BI Dersleri** | antrasit |

Her kütüphanenin **kendi içeriği, kendi yıldızlı kelimeleri ve kendi medyası** vardır — birbirine karışmaz.

> Şu an yalnızca **NHG** dolu. Acute Boekje ve BI Dersleri başlıkları sonraki adımda eklenecek
> (iskeletleri hazır, import/yıldız/sunucu özellikleri çalışıyor).

---

## 📁 Klasör yapısı

```
index.html              ← uygulama (= "!!! KÜTÜPHANE !!!.html" ile aynı dosya)
manifests/
  nhg.json              ← NHG için   item ID → indirme URL'i
  acute.json            ← Acute için
  bi.json               ← BI için
README.md
.gitignore              ← büyük *.html podcast'leri repodan dışlar
```

⚠️ **Podcast HTML dosyaları repoda DEĞİLDİR.** 30–90 MB boyutundalar; GitHub limitlerini şişirmemek
için ayrı ücretsiz host'larda dururlar ve `manifests/` içinde **URL** ile referans verilirler.

---

## 🎵 Medya iki yoldan yüklenir

### 1) Elle içe aktarma (her zaman çalışır, offline)
Kütüphane içindeyken **📁 Medya Ekle** veya **🗜 ZIP İçe Aktar** ile podcast HTML'lerini seç →
dosya adı başlıklara otomatik eşleştirilir → tarayıcının IndexedDB'sine kaydedilir → başlık maviye
döner, tıklayınca **blob** olarak açılır. İnternet gerekmez.

### 2) Sunucudan otomatik indirme (opsiyonel, manifest doldurulunca)
Bir başlığın manifest'te URL'i varsa, başlık yanında **☁** çıkar. Tıklayınca:
`sunucudan indir → IndexedDB'ye kaydet → aç`. **İkinci açılışta artık offline** (cache'ten).
Manifest boşsa hiçbir şey değişmez — yol (1) birincil olarak çalışmaya devam eder.

---

## 🌐 Sunucu indirmeyi kurma (ücretsiz, çok-sunuculu)

1. **Podcast'leri bir yere yükle** — Netlify (sürükle-bırak deploy), GitHub Release eki, Cloudflare
   Pages, jsDelivr… hangisi olursa. Her dosyanın bir **doğrudan URL'i** olsun.
2. **İlgili manifest'i doldur** (`manifests/nhg.json` vb.). Anahtar = başlığın **item ID'si**,
   değer = `{ "url": "...", "size": bayt }`:
   ```json
   {
     "version": 1,
     "items": {
       "item_0_0_0": { "url": "https://siteniz.netlify.app/kinderen-met-koorts.html", "size": 18234567 }
     }
   }
   ```
   `size` opsiyoneldir (ilerleme çubuğu için; yoksa sunucunun `content-length` başlığı kullanılır).
3. **Item ID'sini bulma:** `index.html` içinde başlık `data-id="item_0_0_0"` şeklinde yazılıdır.
   (Tab–Bölüm–Sıra: `item_<tab>_<bolum>_<sira>`.)

### Ücretsiz limit aşımı → birden çok sunucu
URL'ler **tam** olduğu için, aynı manifest içinde **farklı başlıklar farklı host'larda** durabilir:
```json
"item_0_0_0": { "url": "https://host-A.netlify.app/a.html" },
"item_0_1_0": { "url": "https://host-B.pages.dev/b.html" }
```
Böylece tek bir ücretsiz hesabın bant genişliği/depolama limitine takılmadan yük dağıtılır.

---

## 🚀 GitHub'a yükleme + Pages (opsiyonel)

- Bu klasörü olduğu gibi bir repoya yükle.
- GitHub Pages açarsan giriş dosyası **`index.html`** olmalı (zaten öyle). Pages'ten serve edilince
  `manifests/*.json` otomatik `fetch` edilir ve ☁ başlıklar tıklanınca sunucudan iner.
- Yalnızca yerelden (`file://`) çift-tıkla açarsan da çalışır; o durumda `fetch` engellenir →
  sunucu indirme sessizce devre dışı kalır, **elle import** yolu çalışır (tasarım gereği).

> `index.html`, ana çalışma dosyası **`!!! KÜTÜPHANE !!!.html`'in kopyasıdır.** Ana dosyayı
> güncelleyince bu klasöre `index.html` adıyla tekrar kopyala.

---

## 🔒 Veri & gizlilik
- İlerleme, kelime-yıldızları ve son konum **tarayıcıda** tutulur (localStorage), medya
  **IndexedDB'de**. Her kütüphane ayrı ön-ek kullanır: `nhg_…`, `acute_…`, `bi_…`.
- **Sync Kodu Kopyala / Kodu Aktar** ile bir kütüphanenin ilerleme+konum+yıldızlarını başka cihaza
  taşıyabilirsin (kütüphaneye özel).
- Gizli/özel sekmede IndexedDB kapalı olabilir → medya saklanmaz (uyarı verilir).
