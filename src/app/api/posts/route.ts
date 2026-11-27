import { NextResponse } from 'next/server';
import { isSupabaseConfigured, supabaseDelete, supabaseInsert, supabaseSelect } from '@/lib/supabase';
import { BlogPost, runtimeStore } from '@/lib/studioData';
import { isAdmin } from '@/lib/admin';

export async function GET() {
  if (isSupabaseConfigured()) {
    const rows = await supabaseSelect<BlogPost>('posts', '?order=created_at.desc');
    if (rows && rows.length > 0) {
      return NextResponse.json({ posts: rows, source: 'supabase' });
    }
  }
  return NextResponse.json({ posts: runtimeStore.posts, source: 'local' });
}

export async function POST(req: Request) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Sai mật khẩu quản trị.' }, { status: 401 });
    }

    const body = await req.json();
    const title = String(body.title || '').trim();
    const slug = String(body.slug || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-');
    const excerpt = String(body.excerpt || '').trim();
    const content = String(body.content || '').trim();

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Thiếu tiêu đề, slug hoặc nội dung.' }, { status: 400 });
    }

    const payload = {
      title,
      slug,
      excerpt: excerpt || content.slice(0, 140) + '...',
      content,
      category: String(body.category || 'SEO & Web'),
      cover_image: String(
        body.cover_image || ''
      ),
      meta_title: String(body.meta_title || title),
      meta_description: String(body.meta_description || excerpt || content.slice(0, 155)),
      published: true,
    };

    let saved: BlogPost | null = null;
    if (isSupabaseConfigured()) {
      saved = await supabaseInsert<BlogPost>('posts', payload);
    }

    const post: BlogPost = saved ?? {
      id: `post-${Date.now()}`,
      ...payload,
      created_at: new Date().toISOString(),
    };

    if (!saved) {
      runtimeStore.posts.unshift(post);
    }

    return NextResponse.json({ ok: true, post });
  } catch {
    return NextResponse.json({ error: 'Không thể lưu bài viết.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Sai mật khẩu quản trị.' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Thiếu id' }, { status: 400 });

  if (isSupabaseConfigured()) {
    await supabaseDelete('posts', id);
  }
  runtimeStore.posts = runtimeStore.posts.filter((p) => p.id !== id);
  return NextResponse.json({ ok: true });
}
