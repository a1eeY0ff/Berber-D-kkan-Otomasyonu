# Berber Otomasyon Sistemi

Bu proje, bir berber veya kuaför salonu için geliştirilmiş, randevu, müşteri ve hizmet yönetimi sağlayan tam kapsamlı bir otomasyon sistemidir. [Next.js](https://nextjs.org/) kullanılarak geliştirilmiştir ve veritabanı olarak **MySQL** kullanılmaktadır.

## 📋 Özellikler

- Müşteri Kaydı ve Yönetimi
- Berber Çalışma Günleri ve Saatleri Ayarlama
- Randevu Oluşturma ve Takibi (Beklemede, Onaylandı, Tamamlandı, İptal)
- Hizmet Yönetimi (Saç kesimi, sakal tıraşı vb. ve ücretlendirme)
- Dinamik Veritabanı Mimarisi

## 🛠️ Gereksinimler

Projeyi yerel ortamınızda çalıştırabilmek için aşağıdaki araçların bilgisayarınızda kurulu olması gerekmektedir:

- [Node.js](https://nodejs.org/en/) (v18.x veya daha yeni bir sürüm önerilir)
- [MySQL](https://dev.mysql.com/downloads/mysql/) Server (v8.0+ önerilir)
- Git (Opsiyonel, repoyu klonlamak için)

## 🚀 Kurulum

### 1. Projeyi Klonlama / İndirme
Eğer projeyi henüz bilgisayarınıza indirmediyseniz, dosyaları bir klasöre çıkarın ve terminal (veya komut istemcisi) üzerinden projenin bulunduğu (bu `README.md` dosyasının olduğu) klasöre gidin:

```bash
cd "c:\Users\aleks\Documents\Veri tabani\berber-app"
```

### 2. Bağımlılıkların Yüklenmesi
Terminalde aşağıdaki komutu çalıştırarak gerekli tüm paketleri (Node modules) yükleyin:

```bash
npm install
```

### 3. Veritabanı Kurulumu
Proje, MySQL veritabanı ile çalışmaktadır. Öncelikle projenizin bir üst klasöründe yer alan `database/schema.sql` dosyasındaki SQL komutlarını çalıştırarak veritabanınızı oluşturmalısınız.

- MySQL Workbench, phpMyAdmin veya komut satırı üzerinden MySQL'e giriş yapın.
- `schema.sql` dosyasının içindeki kodları çalıştırarak `berber_otomasyon` adındaki veritabanını, tabloları ve örnek verileri (stored procedure'ler dahil) oluşturun.

### 4. Çevresel Değişkenlerin (.env) Ayarlanması
Uygulamanın veritabanı ile iletişim kurabilmesi için bir `.env.local` dosyası oluşturmalısınız. Proje kök dizininde `.env.local` adında yeni bir dosya oluşturun (veya varsa düzenleyin) ve içerisine kendi MySQL bilgilerinize göre aşağıdaki değişkenleri ekleyin:

```env
# MySQL Bağlantı Ayarları
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=SizinMysqlSifreniz
DB_NAME=berber_otomasyon
```
*(Yukarıdaki şifre kısmını (`DB_PASSWORD`), MySQL'i kurarken belirlediğiniz `root` şifrenizle değiştirin.)*

### 5. Uygulamayı Çalıştırma
Veritabanını hazırlayıp `.env.local` dosyasını ayarladıktan sonra, geliştirme (development) sunucusunu başlatabilirsiniz:

```bash
npm run dev
```

Bu komut uygulamayı yerel makinenizde başlatacaktır. Tarayıcınızı açın ve [http://localhost:3000](http://localhost:3000) adresine giderek uygulamayı görüntüleyin.

## 🗂️ Proje Yapısı

- **`/src/app`**: Sayfaların ve Next.js App Router yapısının bulunduğu klasör.
- **`/src/components`**: Tekrar kullanılabilir arayüz (UI) bileşenleri (Navbar vb.).
- **`/src/lib/dal`**: (Data Access Layer) Veritabanı sorgularının ve bağlantısının (`mysql2`) yönetildiği katman.
- **`/src/lib/bl`**: (Business Logic) İş kurallarının yer aldığı katman.
- **`/src/lib/types`**: Veritabanı tablolarının ve uygulamanın TypeScript tip tanımlamaları (`index.ts`).
- **`/database`**: (Proje dışı) SQL şema (`schema.sql`) dosyalarının bulunduğu alan.
