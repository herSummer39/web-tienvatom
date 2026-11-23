import { NextResponse } from 'next/server';
import { isSupabaseConfigured, supabaseInsert, supabaseSelect } from '@/lib/supabase';
import { LeadRecord, runtimeStore } from '@/lib/studioData';

async function triggerAutomationWebhook(lead: LeadRecord) {
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChat = process.env.TELEGRAM_CHAT_ID;

  const summaryText = [
    `🔔 KHÁCH HÀNG MỚI (${lead.source.toUpperCase()})`,
    `• Tên: ${lead.name}`,
    `• Liên hệ (SĐT/Zalo): ${lead.contact}`,
    lead.service_type ? `• Dịch vụ: ${lead.service_type}` : null,
    lead.pages_count ? `• Quy mô: ${lead.pages_count}` : null,
    lead.addons?.length ? `• Tính năng thêm: ${lead.addons.join(', ')}` : null,
    lead.estimated_total ? `• Dự kiến: ${lead.estimated_total.toLocaleString('vi-VN')}đ` : null,
    lead.notes ? `• Ghi chú: ${lead.notes}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'new_lead', lead, message: summaryText }),
      });
    } catch {
      // Non-blocking
    }
  }

  if (tgToken && tgChat) {
    try {
      await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: tgChat, text: summaryText }),
      });
    } catch {
      // Non-blocking
    }
  }
}

export async function GET() {
  if (isSupabaseConfigured()) {
    const rows = await supabaseSelect<LeadRecord>('leads', '?order=created_at.desc');
    if (rows) return NextResponse.json({ leads: rows, source: 'supabase' });
  }
  return NextResponse.json({ leads: runtimeStore.leads, source: 'local' });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name || '').trim();
    const contact = String(body.contact || '').trim();
    if (!name || !contact) {
      return NextResponse.json({ error: 'Vui lòng nhập tên và SĐT/Zalo.' }, { status: 400 });
    }

    const payload = {
      name,
      contact,
      source: String(body.source || 'bao-gia'),
      service_type: body.service_type ? String(body.service_type) : undefined,
      pages_count: body.pages_count ? String(body.pages_count) : undefined,
      addons: Array.isArray(body.addons) ? body.addons : [],
      estimated_total: Number(body.estimated_total || 0),
      notes: body.notes ? String(body.notes) : undefined,
      status: 'Mới',
    };

    let saved: LeadRecord | null = null;
    if (isSupabaseConfigured()) {
      saved = await supabaseInsert<LeadRecord>('leads', payload);
    }

    const record: LeadRecord = saved ?? {
      id: `lead-${Date.now()}`,
      ...payload,
      created_at: new Date().toISOString(),
    };

    if (!saved) {
      runtimeStore.leads.unshift(record);
    }

    await triggerAutomationWebhook(record);

    return NextResponse.json({ ok: true, lead: record });
  } catch {
    return NextResponse.json({ error: 'Lỗi xử lý yêu cầu.' }, { status: 500 });
  }
}
