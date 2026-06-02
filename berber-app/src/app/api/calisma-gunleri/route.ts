// =========================================================================
// API ROUTE — Çalışma Günleri CRUD
// =========================================================================

import { NextRequest, NextResponse } from 'next/server';
import * as calismaBl from '@/lib/bl/calisma.bl';

// GET — Çalışma Günleri Listele
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const berberId = searchParams.get('berber_id');

    if (!berberId) {
      return NextResponse.json(
        { success: false, error: 'Berber ID zorunludur.' },
        { status: 400 }
      );
    }

    const gunler = await calismaBl.calismaGunuListele(parseInt(berberId));
    return NextResponse.json({ success: true, data: gunler });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST — Çalışma Günü Ekle/Güncelle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { berber_id, gun_no, baslangic_saati, bitis_saati, aktif_mi } = body;
    const calismaId = await calismaBl.calismaGunuEkle(
      berber_id, gun_no, baslangic_saati, bitis_saati, aktif_mi
    );
    return NextResponse.json({ success: true, data: { calisma_id: calismaId } }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PUT — Çalışma Günü Güncelle
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { calisma_id, baslangic_saati, bitis_saati, aktif_mi } = body;
    const etkilenen = await calismaBl.calismaGunuGuncelle(
      calisma_id, baslangic_saati, bitis_saati, aktif_mi
    );
    return NextResponse.json({ success: true, data: { etkilenen_satir: etkilenen } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// DELETE — Çalışma Günü Sil
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const calismaId = searchParams.get('id');
    if (!calismaId) {
      return NextResponse.json(
        { success: false, error: 'Çalışma ID zorunludur.' },
        { status: 400 }
      );
    }
    const etkilenen = await calismaBl.calismaGunuSil(parseInt(calismaId));
    return NextResponse.json({ success: true, data: { etkilenen_satir: etkilenen } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
