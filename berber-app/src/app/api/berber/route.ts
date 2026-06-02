// =========================================================================
// API ROUTE — Berber İşlemleri
// =========================================================================

import { NextRequest, NextResponse } from 'next/server';
import * as berberBl from '@/lib/bl/berber.bl';

// GET — Berber Bilgisi Getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const berberId = searchParams.get('id');

    const berberler = await berberBl.berberListele(
      berberId ? parseInt(berberId) : undefined
    );
    return NextResponse.json({ success: true, data: berberler });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST — Berber Giriş veya Kayıt
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { islem } = body;

    // Giriş (Login)
    if (islem === 'giris') {
      const { eposta, sifre } = body;
      const berber = await berberBl.berberGiris(eposta);
      
      if (!berber) {
        return NextResponse.json({ success: false, error: 'Kullanıcı bulunamadı.' }, { status: 404 });
      }
      
      // Basit şifre kontrolü (Demo amaçlı direkt karşılaştırma veya bcrypt eklenebilir)
      // Biz senaryoda $2b$10$defaultHashForDemo1234567890abcdef kullandık ama basitlik için admin123 kontrolü yapabiliriz.
      // Ya da tamamen front-end de yönetebiliriz. Demo için:
      if (sifre === 'admin123' || berber.sifre_hash === sifre) {
         // Başarılı
         return NextResponse.json({ success: true, data: berber });
      } else {
         return NextResponse.json({ success: false, error: 'Hatalı şifre.' }, { status: 401 });
      }
    }

    // Kayıt
    const { ad, soyad, telefon, eposta, sifre_hash } = body;
    const berberId = await berberBl.berberEkle(ad, soyad, telefon, eposta, sifre_hash || 'admin123');
    return NextResponse.json({ success: true, data: { berber_id: berberId } }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PUT — Berber Güncelle
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { berber_id, ad, soyad, telefon, eposta } = body;
    const etkilenen = await berberBl.berberGuncelle(berber_id, ad, soyad, telefon, eposta);
    return NextResponse.json({ success: true, data: { etkilenen_satir: etkilenen } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
