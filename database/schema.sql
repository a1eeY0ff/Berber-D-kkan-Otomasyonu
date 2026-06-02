-- =========================================================================
-- BERBER DÜKKANI OTOMASYONU - VERİTABANI ŞEMASI
-- BTS304 Veritabanı Yönetim Sistemleri-II Final Ödevi
-- =========================================================================

CREATE DATABASE IF NOT EXISTS berber_otomasyon
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE berber_otomasyon;

-- =========================================================================
-- TABLOLARIN OLUŞTURULMASI
-- =========================================================================

-- 1. Berber Tablosu (Tek berber — dükkan sahibi / yönetici)
CREATE TABLE IF NOT EXISTS Berber (
    berber_id    INT AUTO_INCREMENT PRIMARY KEY,
    ad           VARCHAR(50)  NOT NULL,
    soyad        VARCHAR(50)  NOT NULL,
    telefon      VARCHAR(20)  NOT NULL UNIQUE,
    eposta       VARCHAR(100) UNIQUE,
    sifre_hash   VARCHAR(255) NOT NULL,
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Müşteriler Tablosu
CREATE TABLE IF NOT EXISTS Musteriler (
    musteri_id   INT AUTO_INCREMENT PRIMARY KEY,
    ad           VARCHAR(50)  NOT NULL,
    soyad        VARCHAR(50)  NOT NULL,
    telefon      VARCHAR(20)  NOT NULL UNIQUE,
    eposta       VARCHAR(100) UNIQUE,
    kayit_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Hizmetler Tablosu
CREATE TABLE IF NOT EXISTS Hizmetler (
    hizmet_id    INT AUTO_INCREMENT PRIMARY KEY,
    hizmet_adi   VARCHAR(100) NOT NULL UNIQUE,
    sure_dakika  INT          NOT NULL,
    ucret        DECIMAL(10, 2) NOT NULL,
    aktif_mi     BOOLEAN DEFAULT TRUE,
    CONSTRAINT chk_sure   CHECK (sure_dakika > 0),
    CONSTRAINT chk_ucret  CHECK (ucret >= 0)
);

-- 4. Çalışma Günleri Tablosu (Berberin haftalık programı)
CREATE TABLE IF NOT EXISTS CalismaGunleri (
    calisma_id      INT AUTO_INCREMENT PRIMARY KEY,
    berber_id       INT NOT NULL,
    gun_no          TINYINT NOT NULL,  -- 0=Pazar, 1=Pazartesi ... 6=Cumartesi
    baslangic_saati TIME NOT NULL,
    bitis_saati     TIME NOT NULL,
    aktif_mi        BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_calisma_berber FOREIGN KEY (berber_id)
        REFERENCES Berber(berber_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_gun  CHECK (gun_no BETWEEN 0 AND 6),
    CONSTRAINT chk_saat CHECK (baslangic_saati < bitis_saati),
    CONSTRAINT uq_berber_gun UNIQUE (berber_id, gun_no)
);

-- 5. Randevular Tablosu
CREATE TABLE IF NOT EXISTS Randevular (
    randevu_id       INT AUTO_INCREMENT PRIMARY KEY,
    musteri_id       INT NOT NULL,
    berber_id        INT NOT NULL,
    randevu_tarihi   DATE NOT NULL,
    randevu_saati    TIME NOT NULL,
    toplam_sure      INT DEFAULT 0,          -- dakika cinsinden
    toplam_ucret     DECIMAL(10,2) DEFAULT 0.00,
    durum            ENUM('beklemede','onaylandi','tamamlandi','iptal') DEFAULT 'beklemede',
    notlar           TEXT,
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_randevu_musteri FOREIGN KEY (musteri_id)
        REFERENCES Musteriler(musteri_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_randevu_berber FOREIGN KEY (berber_id)
        REFERENCES Berber(berber_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- 6. Randevu Hizmetleri Tablosu (N-N ilişki çözümü)
CREATE TABLE IF NOT EXISTS RandevuHizmetleri (
    rh_id             INT AUTO_INCREMENT PRIMARY KEY,
    randevu_id        INT NOT NULL,
    hizmet_id         INT NOT NULL,
    uygulanan_ucret   DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_rh_randevu FOREIGN KEY (randevu_id)
        REFERENCES Randevular(randevu_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_rh_hizmet FOREIGN KEY (hizmet_id)
        REFERENCES Hizmetler(hizmet_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT uq_randevu_hizmet UNIQUE (randevu_id, hizmet_id)
);

-- 7. İşlem Geçmişi (Log / Audit) Tablosu
CREATE TABLE IF NOT EXISTS IslemGecmisi (
    log_id        INT AUTO_INCREMENT PRIMARY KEY,
    tablo_adi     VARCHAR(50)  NOT NULL,
    islem_tipi    ENUM('INSERT','UPDATE','DELETE') NOT NULL,
    kayit_id      INT,
    eski_deger    TEXT,
    yeni_deger    TEXT,
    islem_tarihi  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================================
-- STORED PROCEDURES — CRUD İŞLEMLERİ
-- =========================================================================

-- *************************************************************************
-- BERBER STORED PROCEDURES
-- *************************************************************************

DELIMITER $$

-- Berber Ekleme
CREATE PROCEDURE sp_BerberEkle(
    IN p_ad VARCHAR(50),
    IN p_soyad VARCHAR(50),
    IN p_telefon VARCHAR(20),
    IN p_eposta VARCHAR(100),
    IN p_sifre_hash VARCHAR(255)
)
BEGIN
    INSERT INTO Berber (ad, soyad, telefon, eposta, sifre_hash)
    VALUES (p_ad, p_soyad, p_telefon, p_eposta, p_sifre_hash);
    SELECT LAST_INSERT_ID() AS berber_id;
END $$
DELIMITER ;

DELIMITER $$

-- Berber Güncelleme
CREATE PROCEDURE sp_BerberGuncelle(
    IN p_berber_id INT,
    IN p_ad VARCHAR(50),
    IN p_soyad VARCHAR(50),
    IN p_telefon VARCHAR(20),
    IN p_eposta VARCHAR(100)
)
BEGIN
    UPDATE Berber
    SET ad      = p_ad,
        soyad   = p_soyad,
        telefon = p_telefon,
        eposta  = p_eposta
    WHERE berber_id = p_berber_id;
    SELECT ROW_COUNT() AS etkilenen_satir;
END $$
DELIMITER ;

DELIMITER $$

-- Berber Silme
CREATE PROCEDURE sp_BerberSil(
    IN p_berber_id INT
)
BEGIN
    DELETE FROM Berber WHERE berber_id = p_berber_id;
    SELECT ROW_COUNT() AS etkilenen_satir;
END $$
DELIMITER ;

DELIMITER $$

-- Berber Listeleme
CREATE PROCEDURE sp_BerberListele(
    IN p_berber_id INT
)
BEGIN
    IF p_berber_id IS NULL THEN
        SELECT * FROM Berber;
    ELSE
        SELECT * FROM Berber WHERE berber_id = p_berber_id;
    END IF;
END $$
DELIMITER ;

DELIMITER $$

-- Berber Giriş Kontrolü
CREATE PROCEDURE sp_BerberGiris(
    IN p_eposta VARCHAR(100)
)
BEGIN
    SELECT berber_id, ad, soyad, telefon, eposta, sifre_hash
    FROM Berber
    WHERE eposta = p_eposta;
END $$
DELIMITER ;

-- *************************************************************************
-- MÜŞTERİ STORED PROCEDURES
-- *************************************************************************

DELIMITER $$

-- Müşteri Ekleme
CREATE PROCEDURE sp_MusteriEkle(
    IN p_ad VARCHAR(50),
    IN p_soyad VARCHAR(50),
    IN p_telefon VARCHAR(20),
    IN p_eposta VARCHAR(100)
)
BEGIN
    INSERT INTO Musteriler (ad, soyad, telefon, eposta)
    VALUES (p_ad, p_soyad, p_telefon, p_eposta);
    SELECT LAST_INSERT_ID() AS musteri_id;
END $$
DELIMITER ;

DELIMITER $$

-- Müşteri Güncelleme
CREATE PROCEDURE sp_MusteriGuncelle(
    IN p_musteri_id INT,
    IN p_ad VARCHAR(50),
    IN p_soyad VARCHAR(50),
    IN p_telefon VARCHAR(20),
    IN p_eposta VARCHAR(100)
)
BEGIN
    UPDATE Musteriler
    SET ad      = p_ad,
        soyad   = p_soyad,
        telefon = p_telefon,
        eposta  = p_eposta
    WHERE musteri_id = p_musteri_id;
    SELECT ROW_COUNT() AS etkilenen_satir;
END $$
DELIMITER ;

DELIMITER $$

-- Müşteri Silme
CREATE PROCEDURE sp_MusteriSil(
    IN p_musteri_id INT
)
BEGIN
    DELETE FROM Musteriler WHERE musteri_id = p_musteri_id;
    SELECT ROW_COUNT() AS etkilenen_satir;
END $$
DELIMITER ;

DELIMITER $$

-- Müşteri Listeleme / Arama
CREATE PROCEDURE sp_MusteriListele(
    IN p_musteri_id INT
)
BEGIN
    IF p_musteri_id IS NULL THEN
        SELECT * FROM Musteriler ORDER BY kayit_tarihi DESC;
    ELSE
        SELECT * FROM Musteriler WHERE musteri_id = p_musteri_id;
    END IF;
END $$
DELIMITER ;

DELIMITER $$

-- Müşteri Telefon ile Arama
CREATE PROCEDURE sp_MusteriTelefonIleAra(
    IN p_telefon VARCHAR(20)
)
BEGIN
    SELECT * FROM Musteriler WHERE telefon = p_telefon;
END $$
DELIMITER ;

-- *************************************************************************
-- HİZMET STORED PROCEDURES
-- *************************************************************************

DELIMITER $$

-- Hizmet Ekleme
CREATE PROCEDURE sp_HizmetEkle(
    IN p_hizmet_adi VARCHAR(100),
    IN p_sure_dakika INT,
    IN p_ucret DECIMAL(10,2)
)
BEGIN
    INSERT INTO Hizmetler (hizmet_adi, sure_dakika, ucret)
    VALUES (p_hizmet_adi, p_sure_dakika, p_ucret);
    SELECT LAST_INSERT_ID() AS hizmet_id;
END $$
DELIMITER ;

DELIMITER $$

-- Hizmet Güncelleme
CREATE PROCEDURE sp_HizmetGuncelle(
    IN p_hizmet_id INT,
    IN p_hizmet_adi VARCHAR(100),
    IN p_sure_dakika INT,
    IN p_ucret DECIMAL(10,2),
    IN p_aktif_mi BOOLEAN
)
BEGIN
    UPDATE Hizmetler
    SET hizmet_adi  = p_hizmet_adi,
        sure_dakika = p_sure_dakika,
        ucret       = p_ucret,
        aktif_mi    = p_aktif_mi
    WHERE hizmet_id = p_hizmet_id;
    SELECT ROW_COUNT() AS etkilenen_satir;
END $$
DELIMITER ;

DELIMITER $$

-- Hizmet Silme
CREATE PROCEDURE sp_HizmetSil(
    IN p_hizmet_id INT
)
BEGIN
    DELETE FROM Hizmetler WHERE hizmet_id = p_hizmet_id;
    SELECT ROW_COUNT() AS etkilenen_satir;
END $$
DELIMITER ;

DELIMITER $$

-- Hizmet Listeleme
CREATE PROCEDURE sp_HizmetListele(
    IN p_hizmet_id INT
)
BEGIN
    IF p_hizmet_id IS NULL THEN
        SELECT * FROM Hizmetler WHERE aktif_mi = TRUE ORDER BY hizmet_adi;
    ELSE
        SELECT * FROM Hizmetler WHERE hizmet_id = p_hizmet_id;
    END IF;
END $$
DELIMITER ;

DELIMITER $$

-- Tüm Hizmetler (aktif/pasif dahil)
CREATE PROCEDURE sp_TumHizmetlerListele()
BEGIN
    SELECT * FROM Hizmetler ORDER BY hizmet_adi;
END $$
DELIMITER ;

-- *************************************************************************
-- ÇALIŞMA GÜNLERİ STORED PROCEDURES
-- *************************************************************************

DELIMITER $$

-- Çalışma Günü Ekleme
CREATE PROCEDURE sp_CalismaGunuEkle(
    IN p_berber_id INT,
    IN p_gun_no TINYINT,
    IN p_baslangic_saati TIME,
    IN p_bitis_saati TIME,
    IN p_aktif_mi BOOLEAN
)
BEGIN
    INSERT INTO CalismaGunleri (berber_id, gun_no, baslangic_saati, bitis_saati, aktif_mi)
    VALUES (p_berber_id, p_gun_no, p_baslangic_saati, p_bitis_saati, p_aktif_mi)
    ON DUPLICATE KEY UPDATE
        baslangic_saati = p_baslangic_saati,
        bitis_saati     = p_bitis_saati,
        aktif_mi        = p_aktif_mi;
    SELECT LAST_INSERT_ID() AS calisma_id;
END $$
DELIMITER ;

DELIMITER $$

-- Çalışma Günü Güncelleme
CREATE PROCEDURE sp_CalismaGunuGuncelle(
    IN p_calisma_id INT,
    IN p_baslangic_saati TIME,
    IN p_bitis_saati TIME,
    IN p_aktif_mi BOOLEAN
)
BEGIN
    UPDATE CalismaGunleri
    SET baslangic_saati = p_baslangic_saati,
        bitis_saati     = p_bitis_saati,
        aktif_mi        = p_aktif_mi
    WHERE calisma_id = p_calisma_id;
    SELECT ROW_COUNT() AS etkilenen_satir;
END $$
DELIMITER ;

DELIMITER $$

-- Çalışma Günü Silme
CREATE PROCEDURE sp_CalismaGunuSil(
    IN p_calisma_id INT
)
BEGIN
    DELETE FROM CalismaGunleri WHERE calisma_id = p_calisma_id;
    SELECT ROW_COUNT() AS etkilenen_satir;
END $$
DELIMITER ;

DELIMITER $$

-- Çalışma Günleri Listeleme
CREATE PROCEDURE sp_CalismaGunuListele(
    IN p_berber_id INT
)
BEGIN
    SELECT * FROM CalismaGunleri
    WHERE berber_id = p_berber_id
    ORDER BY gun_no;
END $$
DELIMITER ;

-- *************************************************************************
-- RANDEVU STORED PROCEDURES
-- *************************************************************************

DELIMITER $$

-- Randevu Ekleme
CREATE PROCEDURE sp_RandevuEkle(
    IN p_musteri_id INT,
    IN p_berber_id INT,
    IN p_randevu_tarihi DATE,
    IN p_randevu_saati TIME,
    IN p_notlar TEXT
)
BEGIN
    INSERT INTO Randevular (musteri_id, berber_id, randevu_tarihi, randevu_saati, notlar)
    VALUES (p_musteri_id, p_berber_id, p_randevu_tarihi, p_randevu_saati, p_notlar);
    SELECT LAST_INSERT_ID() AS randevu_id;
END $$
DELIMITER ;

DELIMITER $$

-- Randevu Güncelleme
CREATE PROCEDURE sp_RandevuGuncelle(
    IN p_randevu_id INT,
    IN p_randevu_tarihi DATE,
    IN p_randevu_saati TIME,
    IN p_durum ENUM('beklemede','onaylandi','tamamlandi','iptal'),
    IN p_notlar TEXT
)
BEGIN
    UPDATE Randevular
    SET randevu_tarihi = p_randevu_tarihi,
        randevu_saati  = p_randevu_saati,
        durum          = p_durum,
        notlar         = p_notlar
    WHERE randevu_id = p_randevu_id;
    SELECT ROW_COUNT() AS etkilenen_satir;
END $$
DELIMITER ;

DELIMITER $$

-- Randevu Silme
CREATE PROCEDURE sp_RandevuSil(
    IN p_randevu_id INT
)
BEGIN
    DELETE FROM Randevular WHERE randevu_id = p_randevu_id;
    SELECT ROW_COUNT() AS etkilenen_satir;
END $$
DELIMITER ;

DELIMITER $$

-- Randevu Listeleme (tümü veya tekil)
CREATE PROCEDURE sp_RandevuListele(
    IN p_randevu_id INT
)
BEGIN
    IF p_randevu_id IS NULL THEN
        SELECT r.*, m.ad AS musteri_ad, m.soyad AS musteri_soyad, m.telefon AS musteri_telefon
        FROM Randevular r
        INNER JOIN Musteriler m ON r.musteri_id = m.musteri_id
        ORDER BY r.randevu_tarihi DESC, r.randevu_saati DESC;
    ELSE
        SELECT r.*, m.ad AS musteri_ad, m.soyad AS musteri_soyad, m.telefon AS musteri_telefon
        FROM Randevular r
        INNER JOIN Musteriler m ON r.musteri_id = m.musteri_id
        WHERE r.randevu_id = p_randevu_id;
    END IF;
END $$
DELIMITER ;

DELIMITER $$

-- Randevu Durumu Güncelleme (Onayla / İptal / Tamamla)
CREATE PROCEDURE sp_RandevuDurumGuncelle(
    IN p_randevu_id INT,
    IN p_durum ENUM('beklemede','onaylandi','tamamlandi','iptal')
)
BEGIN
    UPDATE Randevular
    SET durum = p_durum
    WHERE randevu_id = p_randevu_id;
    SELECT ROW_COUNT() AS etkilenen_satir;
END $$
DELIMITER ;

DELIMITER $$

-- Günlük Randevuları Listele
CREATE PROCEDURE sp_GunlukRandevular(
    IN p_tarih DATE,
    IN p_berber_id INT
)
BEGIN
    SELECT r.*, m.ad AS musteri_ad, m.soyad AS musteri_soyad, m.telefon AS musteri_telefon
    FROM Randevular r
    INNER JOIN Musteriler m ON r.musteri_id = m.musteri_id
    WHERE r.randevu_tarihi = p_tarih
      AND r.berber_id = p_berber_id
      AND r.durum != 'iptal'
    ORDER BY r.randevu_saati;
END $$
DELIMITER ;

DELIMITER $$

-- Müsait Saatleri Getir
CREATE PROCEDURE sp_MusaitSaatleriGetir(
    IN p_berber_id INT,
    IN p_tarih DATE
)
BEGIN
    DECLARE v_gun_no TINYINT;
    SET v_gun_no = DAYOFWEEK(p_tarih) - 1; -- MySQL: 1=Pazar → 0=Pazar

    -- Çalışma saatleri ile mevcut randevuları birlikte döndür
    SELECT
        cg.baslangic_saati,
        cg.bitis_saati,
        cg.aktif_mi AS gun_aktif,
        r.randevu_saati AS dolu_saat,
        r.toplam_sure AS dolu_sure
    FROM CalismaGunleri cg
    LEFT JOIN Randevular r ON r.berber_id = cg.berber_id
        AND r.randevu_tarihi = p_tarih
        AND r.durum IN ('beklemede', 'onaylandi')
    WHERE cg.berber_id = p_berber_id
      AND cg.gun_no = v_gun_no
      AND cg.aktif_mi = TRUE;
END $$
DELIMITER ;

DELIMITER $$

-- Tarih Aralığı ile Randevu Listele
CREATE PROCEDURE sp_RandevuTarihAraliginda(
    IN p_berber_id INT,
    IN p_baslangic DATE,
    IN p_bitis DATE
)
BEGIN
    SELECT r.*, m.ad AS musteri_ad, m.soyad AS musteri_soyad, m.telefon AS musteri_telefon
    FROM Randevular r
    INNER JOIN Musteriler m ON r.musteri_id = m.musteri_id
    WHERE r.berber_id = p_berber_id
      AND r.randevu_tarihi BETWEEN p_baslangic AND p_bitis
    ORDER BY r.randevu_tarihi, r.randevu_saati;
END $$
DELIMITER ;

-- *************************************************************************
-- RANDEVU HİZMETLERİ STORED PROCEDURES
-- *************************************************************************

DELIMITER $$

-- Randevu Hizmeti Ekleme
CREATE PROCEDURE sp_RandevuHizmetEkle(
    IN p_randevu_id INT,
    IN p_hizmet_id INT
)
BEGIN
    DECLARE v_ucret DECIMAL(10,2);
    DECLARE v_sure INT;

    -- Hizmetin güncel ücretini ve süresini al
    SELECT ucret, sure_dakika INTO v_ucret, v_sure
    FROM Hizmetler WHERE hizmet_id = p_hizmet_id;

    -- Randevu hizmeti ekle
    INSERT INTO RandevuHizmetleri (randevu_id, hizmet_id, uygulanan_ucret)
    VALUES (p_randevu_id, p_hizmet_id, v_ucret);

    -- Randevunun toplam ücret ve süresini güncelle
    UPDATE Randevular
    SET toplam_ucret = toplam_ucret + v_ucret,
        toplam_sure  = toplam_sure + v_sure
    WHERE randevu_id = p_randevu_id;

    SELECT LAST_INSERT_ID() AS rh_id;
END $$
DELIMITER ;

DELIMITER $$

-- Randevu Hizmeti Güncelleme
CREATE PROCEDURE sp_RandevuHizmetGuncelle(
    IN p_rh_id INT,
    IN p_uygulanan_ucret DECIMAL(10,2)
)
BEGIN
    UPDATE RandevuHizmetleri
    SET uygulanan_ucret = p_uygulanan_ucret
    WHERE rh_id = p_rh_id;
    SELECT ROW_COUNT() AS etkilenen_satir;
END $$
DELIMITER ;

DELIMITER $$

-- Randevu Hizmeti Silme
CREATE PROCEDURE sp_RandevuHizmetSil(
    IN p_rh_id INT
)
BEGIN
    DECLARE v_randevu_id INT;
    DECLARE v_ucret DECIMAL(10,2);
    DECLARE v_hizmet_id INT;
    DECLARE v_sure INT;

    -- Silinecek hizmetin bilgilerini al
    SELECT randevu_id, hizmet_id, uygulanan_ucret
    INTO v_randevu_id, v_hizmet_id, v_ucret
    FROM RandevuHizmetleri WHERE rh_id = p_rh_id;

    SELECT sure_dakika INTO v_sure FROM Hizmetler WHERE hizmet_id = v_hizmet_id;

    -- Hizmeti sil
    DELETE FROM RandevuHizmetleri WHERE rh_id = p_rh_id;

    -- Randevunun toplam ücret ve süresini güncelle
    UPDATE Randevular
    SET toplam_ucret = toplam_ucret - v_ucret,
        toplam_sure  = toplam_sure - IFNULL(v_sure, 0)
    WHERE randevu_id = v_randevu_id;

    SELECT ROW_COUNT() AS etkilenen_satir;
END $$
DELIMITER ;

DELIMITER $$

-- Randevu Hizmetleri Listeleme
CREATE PROCEDURE sp_RandevuHizmetListele(
    IN p_randevu_id INT
)
BEGIN
    SELECT rh.*, h.hizmet_adi, h.sure_dakika
    FROM RandevuHizmetleri rh
    INNER JOIN Hizmetler h ON rh.hizmet_id = h.hizmet_id
    WHERE rh.randevu_id = p_randevu_id;
END $$
DELIMITER ;


-- =========================================================================
-- KULLANICI TANIMLI FONKSİYONLAR (EN AZ 2 ADET)
-- =========================================================================

DELIMITER $$

-- 1. Günlük Kazanç Hesaplama
CREATE FUNCTION fn_GunlukKazanc(p_tarih DATE)
RETURNS DECIMAL(10,2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_kazanc DECIMAL(10,2);

    SELECT IFNULL(SUM(toplam_ucret), 0)
    INTO v_kazanc
    FROM Randevular
    WHERE randevu_tarihi = p_tarih
      AND durum = 'tamamlandi';

    RETURN v_kazanc;
END $$
DELIMITER ;

DELIMITER $$

-- 2. Müşteri Toplam Harcama Hesaplama
CREATE FUNCTION fn_MusteriToplamHarcama(p_musteri_id INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_toplam DECIMAL(10,2);

    SELECT IFNULL(SUM(toplam_ucret), 0)
    INTO v_toplam
    FROM Randevular
    WHERE musteri_id = p_musteri_id
      AND durum = 'tamamlandi';

    RETURN v_toplam;
END $$
DELIMITER ;


-- =========================================================================
-- TETİKLEYİCİLER (TRIGGERS) — EN AZ 2 ADET
-- =========================================================================

DELIMITER $$

-- 1. Randevu INSERT Sonrası Log Trigger
CREATE TRIGGER trg_RandevuInsertLog
AFTER INSERT ON Randevular
FOR EACH ROW
BEGIN
    INSERT INTO IslemGecmisi (tablo_adi, islem_tipi, kayit_id, yeni_deger)
    VALUES (
        'Randevular',
        'INSERT',
        NEW.randevu_id,
        CONCAT('Musteri:', NEW.musteri_id, ' Tarih:', NEW.randevu_tarihi,
               ' Saat:', NEW.randevu_saati, ' Durum:', NEW.durum)
    );
END $$
DELIMITER ;

DELIMITER $$

-- 2. Randevu UPDATE Sonrası Log Trigger (durum değişikliği takibi)
CREATE TRIGGER trg_RandevuUpdateLog
AFTER UPDATE ON Randevular
FOR EACH ROW
BEGIN
    INSERT INTO IslemGecmisi (tablo_adi, islem_tipi, kayit_id, eski_deger, yeni_deger)
    VALUES (
        'Randevular',
        'UPDATE',
        NEW.randevu_id,
        CONCAT('Durum:', OLD.durum, ' Tarih:', OLD.randevu_tarihi, ' Saat:', OLD.randevu_saati),
        CONCAT('Durum:', NEW.durum, ' Tarih:', NEW.randevu_tarihi, ' Saat:', NEW.randevu_saati)
    );
END $$
DELIMITER ;

DELIMITER $$

-- 3. Randevu Çakışma Kontrolü (BEFORE INSERT)
CREATE TRIGGER trg_RandevuCakismaKontrol
BEFORE INSERT ON Randevular
FOR EACH ROW
BEGIN
    DECLARE v_cakisma INT;

    SELECT COUNT(*) INTO v_cakisma
    FROM Randevular
    WHERE berber_id = NEW.berber_id
      AND randevu_tarihi = NEW.randevu_tarihi
      AND randevu_saati = NEW.randevu_saati
      AND durum IN ('beklemede', 'onaylandi');

    IF v_cakisma > 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Bu tarih ve saatte zaten bir randevu bulunmaktadır!';
    END IF;
END $$
DELIMITER ;


-- =========================================================================
-- İSTATİSTİK STORED PROCEDURE
-- =========================================================================

DELIMITER $$

CREATE PROCEDURE sp_Istatistikler(
    IN p_berber_id INT
)
BEGIN
    -- Toplam müşteri sayısı
    SELECT COUNT(*) AS toplam_musteri FROM Musteriler;

    -- Bugünün randevu sayısı
    SELECT COUNT(*) AS bugunun_randevulari
    FROM Randevular
    WHERE berber_id = p_berber_id
      AND randevu_tarihi = CURDATE()
      AND durum != 'iptal';

    -- Bu ayki toplam kazanç
    SELECT IFNULL(SUM(toplam_ucret), 0) AS aylik_kazanc
    FROM Randevular
    WHERE berber_id = p_berber_id
      AND MONTH(randevu_tarihi) = MONTH(CURDATE())
      AND YEAR(randevu_tarihi) = YEAR(CURDATE())
      AND durum = 'tamamlandi';

    -- Bekleyen randevular
    SELECT COUNT(*) AS bekleyen_randevular
    FROM Randevular
    WHERE berber_id = p_berber_id
      AND durum = 'beklemede';
END $$
DELIMITER ;


-- =========================================================================
-- ÖRNEK VERİLER (STORED PROCEDURES ARACILIĞIYLA)
-- =========================================================================

DELIMITER $$

-- Berber Ekleme (şifre: admin123 → basit hash)
CALL sp_BerberEkle(
    'Ahmet',
    'Yılmaz',
    '05551234567',
    'ahmet@ustberber.com',
    '$2b$10$defaultHashForDemo1234567890abcdef'
)$$

-- Hizmetler Ekleme
CALL sp_HizmetEkle('Saç Kesimi', 30, 250.00)$$
CALL sp_HizmetEkle('Sakal Tıraşı', 20, 150.00)$$
CALL sp_HizmetEkle('Saç Yıkama', 15, 100.00)$$
CALL sp_HizmetEkle('Saç Şekillendirme', 25, 200.00)$$
CALL sp_HizmetEkle('Saç Boyama', 60, 500.00)$$
CALL sp_HizmetEkle('Cilt Bakımı', 45, 350.00)$$

-- Çalışma Günleri Ekleme (Pazartesi-Cumartesi, 09:00-19:00)
CALL sp_CalismaGunuEkle(1, 1, '09:00:00', '19:00:00', TRUE)$$  -- Pazartesi
CALL sp_CalismaGunuEkle(1, 2, '09:00:00', '19:00:00', TRUE)$$  -- Salı
CALL sp_CalismaGunuEkle(1, 3, '09:00:00', '19:00:00', TRUE)$$  -- Çarşamba
CALL sp_CalismaGunuEkle(1, 4, '09:00:00', '19:00:00', TRUE)$$  -- Perşembe
CALL sp_CalismaGunuEkle(1, 5, '09:00:00', '19:00:00', TRUE)$$  -- Cuma
CALL sp_CalismaGunuEkle(1, 6, '10:00:00', '17:00:00', TRUE)$$  -- Cumartesi
CALL sp_CalismaGunuEkle(1, 0, '00:00:00', '23:59:59', FALSE)$$ -- Pazar (kapalı)

-- Örnek Müşteriler Ekleme
CALL sp_MusteriEkle('Mehmet', 'Kaya', '05559876543', 'mehmet@email.com')$$
CALL sp_MusteriEkle('Ali', 'Demir', '05551112233', 'ali@email.com')$$
CALL sp_MusteriEkle('Burak', 'Çelik', '05554445566', 'burak@email.com')$$
CALL sp_MusteriEkle('Emre', 'Şahin', '05557778899', 'emre@email.com')$$
CALL sp_MusteriEkle('Fatih', 'Öztürk', '05552223344', 'fatih@email.com')$$

DELIMITER ;
