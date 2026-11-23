import { BAIVIET_HTML } from '@/components/subpagesHtml';
import OnlinesRuntime from '@/components/OnlinesRuntime';
import ChatbotWidget from '@/components/ChatbotWidget';
import StudioShell from '@/components/StudioShell';
import { isSupabaseConfigured, supabaseSelect } from '@/lib/supabase';
import { BlogPost, runtimeStore } from '@/lib/studioData';

export const dynamic = 'force-dynamic';

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Check if it's a custom post created in /admin or Supabase
  let customPost: BlogPost | undefined;
  if (isSupabaseConfigured()) {
    const rows = await supabaseSelect<BlogPost>('posts', `?slug=eq.${encodeURIComponent(slug)}&limit=1`);
    if (rows && rows[0]) customPost = rows[0];
  } else {
    customPost = runtimeStore.posts.find((p) => p.slug === slug && p.id.startsWith('post-'));
  }

  if (customPost) {
    return (
      <StudioShell>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <div className="studio-hero" style={{ marginBottom: 28 }}>
            <span className="studio-badge">{customPost.category}</span>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 46px)' }}>{customPost.title}</h1>
            <p>{customPost.excerpt}</p>
          </div>
          <article style={{ display: 'flex', flexDirection: 'column', gap: 18, fontSize: 17, lineHeight: 1.75 }}>
            {customPost.content.split('\n\n').map((para, i) => (
              <p key={i} style={{ margin: 0 }}>{para}</p>
            ))}
          </article>
        </div>
      </StudioShell>
    );
  }

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: BAIVIET_HTML }} />
      <OnlinesRuntime />
      <ChatbotWidget />
    </>
  );
}
