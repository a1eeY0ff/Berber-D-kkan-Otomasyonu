// =========================================================================
// API ROUTE — Hizmetler CRUD
// =========================================================================

import { NextRequest, NextResponse } from 'next/server';
import * as hizmetBl from '@/lib/bl/hizmet.bl';

// GET — Hizmet Listele
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hizmetId = searchParams.get('id');
    const tumHizmetler = searchParams.get('tumu');

    if (tumHizmetler === 'true') {
      const hizmetler = await hizmetBl.tumHizmetlerListele();
      return NextResponse.json({ success: true, data: hizmetler });
    }

    const hizmetler = await hizmetBl.hizmetListele(
      hizmetId ? parseInt(hizmetId) : undefined
    );
    return NextResponse.json({ success: true, data: hizmetler });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST — Hizmet Ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hizmet_adi, sure_dakika, ucret } = body;
    const hizmetId = await hizmetBl.hizmetEkle(hizmet_adi, sure_dakika, ucret);
    return NextResponse.json({ success: true, data: { hizmet_id: hizmetId } }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PUT — Hizmet Güncelle
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { hizmet_id, hizmet_adi, sure_dakika, ucret, aktif_mi } = body;
    const etkilenen = await hizmetBl.hizmetGuncelle(hizmet_id, hizmet_adi, sure_dakika, ucret, aktif_mi);
    return NextResponse.json({ success: true, data: { etkilenen_satir: etkilenen } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// DELETE — Hizmet Sil
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hizmetId = searchParams.get('id');
    if (!hizmetId) {
      return NextResponse.json({ success: false, error: 'Hizmet ID zorunludur.' }, { status: 400 });
    }
    const etkilenen = await hizmetBl.hizmetSil(parseInt(hizmetId));
    return NextResponse.json({ success: true, data: { etkilenen_satir: etkilenen } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
