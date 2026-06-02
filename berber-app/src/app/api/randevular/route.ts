// =========================================================================
// API ROUTE — Randevular CRUD + Özel İşlemler
// =========================================================================

import { NextRequest, NextResponse } from 'next/server';
import * as randevuBl from '@/lib/bl/randevu.bl';

// GET — Randevu Listele + Müsait Saatler + Günlük + İstatistikler
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const randevuId = searchParams.get('id');
    const tarih = searchParams.get('tarih');
    const berberId = searchParams.get('berber_id');
    const islem = searchParams.get('islem');

    // Müsait saatler
    if (islem === 'musait' && berberId && tarih) {
      const saatler = await randevuBl.musaitSaatleriGetir(parseInt(berberId), tarih);
      return NextResponse.json({ success: true, data: saatler });
    }

    // Günlük randevular
    if (islem === 'gunluk' && berberId && tarih) {
      const randevular = await randevuBl.gunlukRandevular(tarih, parseInt(berberId));
      return NextResponse.json({ success: true, data: randevular });
    }

    // İstatistikler
    if (islem === 'istatistik' && berberId) {
      const istatistik = await randevuBl.istatistikleriGetir(parseInt(berberId));
      return NextResponse.json({ success: true, data: istatistik });
    }

    // Tarih aralığı
    if (islem === 'aralik' && berberId) {
      const baslangic = searchParams.get('baslangic');
      const bitis = searchParams.get('bitis');
      if (baslangic && bitis) {
        const randevular = await randevuBl.randevuTarihAraliginda(
          parseInt(berberId), baslangic, bitis
        );
        return NextResponse.json({ success: true, data: randevular });
      }
    }

    // Randevu hizmetleri
    if (islem === 'hizmetler' && randevuId) {
      const hizmetler = await randevuBl.randevuHizmetListele(parseInt(randevuId));
      return NextResponse.json({ success: true, data: hizmetler });
    }

    // Tekil veya tüm randevular
    const randevular = await randevuBl.randevuListele(
      randevuId ? parseInt(randevuId) : undefined
    );
    return NextResponse.json({ success: true, data: randevular });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST — Randevu Ekle + Hizmet Ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { islem } = body;

    // Randevu hizmet ekle
    if (islem === 'hizmet_ekle') {
      const { randevu_id, hizmet_id } = body;
      const rhId = await randevuBl.randevuHizmetEkle(randevu_id, hizmet_id);
      return NextResponse.json({ success: true, data: { rh_id: rhId } }, { status: 201 });
    }

    // Randevu ekle
    const { musteri_id, berber_id, randevu_tarihi, randevu_saati, notlar, hizmet_ids } = body;
    const randevuId = await randevuBl.randevuEkle(
      musteri_id, berber_id, randevu_tarihi, randevu_saati, notlar
    );

    // Hizmetleri ekle
    if (hizmet_ids && Array.isArray(hizmet_ids)) {
      for (const hizmetId of hizmet_ids) {
        await randevuBl.randevuHizmetEkle(randevuId, hizmetId);
      }
    }

    return NextResponse.json({ success: true, data: { randevu_id: randevuId } }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PUT — Randevu Güncelle + Durum Güncelle
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { islem } = body;

    // Durum güncelle
    if (islem === 'durum') {
      const { randevu_id, durum } = body;
      const etkilenen = await randevuBl.randevuDurumGuncelle(randevu_id, durum);
      return NextResponse.json({ success: true, data: { etkilenen_satir: etkilenen } });
    }

    // Randevu güncelle
    const { randevu_id, randevu_tarihi, randevu_saati, durum, notlar } = body;
    const etkilenen = await randevuBl.randevuGuncelle(
      randevu_id, randevu_tarihi, randevu_saati, durum, notlar
    );
    return NextResponse.json({ success: true, data: { etkilenen_satir: etkilenen } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// DELETE — Randevu Sil + Hizmet Sil
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const randevuId = searchParams.get('id');
    const rhId = searchParams.get('rh_id');

    if (rhId) {
      const etkilenen = await randevuBl.randevuHizmetSil(parseInt(rhId));
      return NextResponse.json({ success: true, data: { etkilenen_satir: etkilenen } });
    }

    if (!randevuId) {
      return NextResponse.json({ success: false, error: 'Randevu ID zorunludur.' }, { status: 400 });
    }
    const etkilenen = await randevuBl.randevuSil(parseInt(randevuId));
    return NextResponse.json({ success: true, data: { etkilenen_satir: etkilenen } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
