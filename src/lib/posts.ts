import { isSupabaseConfigured, supabaseSelect } from '@/lib/supabase';
import { BlogPost, runtimeStore } from '@/lib/studioData';

export async function getAllPosts(): Promise<BlogPost[]> {
  if (isSupabaseConfigured()) {
    const rows = await supabaseSelect<BlogPost>('posts', '?order=created_at.desc');
    if (rows) return rows;
  }
  return runtimeStore.posts;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  if (isSupabaseConfigured()) {
    const rows = await supabaseSelect<BlogPost>('posts', `?slug=eq.${encodeURIComponent(slug)}&limit=1`);
    return rows?.[0];
  }
  return runtimeStore.posts.find((p) => p.slug === slug);
}
