// =========================================================================
// API ROUTE — Müşteriler CRUD
// =========================================================================

import { NextRequest, NextResponse } from 'next/server';
import * as musteriBl from '@/lib/bl/musteri.bl';

// GET — Müşteri Listele
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const musteriId = searchParams.get('id');
    const telefon = searchParams.get('telefon');

    if (telefon) {
      const musteri = await musteriBl.musteriTelefonIleAra(telefon);
      return NextResponse.json({ success: true, data: musteri });
    }

    const musteriler = await musteriBl.musteriListele(
      musteriId ? parseInt(musteriId) : undefined
    );
    return NextResponse.json({ success: true, data: musteriler });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST — Müşteri Ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ad, soyad, telefon, eposta } = body;
    const musteriId = await musteriBl.musteriEkle(ad, soyad, telefon, eposta || '');
    return NextResponse.json({ success: true, data: { musteri_id: musteriId } }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PUT — Müşteri Güncelle
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { musteri_id, ad, soyad, telefon, eposta } = body;
    const etkilenen = await musteriBl.musteriGuncelle(musteri_id, ad, soyad, telefon, eposta || '');
    return NextResponse.json({ success: true, data: { etkilenen_satir: etkilenen } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// DELETE — Müşteri Sil
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const musteriId = searchParams.get('id');
    if (!musteriId) {
      return NextResponse.json({ success: false, error: 'Müşteri ID zorunludur.' }, { status: 400 });
    }
    const etkilenen = await musteriBl.musteriSil(parseInt(musteriId));
    return NextResponse.json({ success: true, data: { etkilenen_satir: etkilenen } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen hata';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
