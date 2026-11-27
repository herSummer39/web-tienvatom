import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StudioShell from '@/components/StudioShell';
import ContactCta from '@/components/ContactCta';
import { getPostBySlug } from '@/lib/posts';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug((await params).slug);
  if (!post) return { title: 'Không tìm thấy bài viết' };
  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const post = await getPostBySlug((await params).slug);
  if (!post) notFound();

  return (
    <StudioShell>
      <article style={{ maxWidth: 780, margin: '0 auto' }}>
        <div className="studio-hero" style={{ marginBottom: 28 }}>
          <span className="studio-badge">{post.category}</span>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 46px)' }}>{post.title}</h1>
          <p>{post.excerpt}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, fontSize: 17, lineHeight: 1.75 }}>
          {post.content.split('\n\n').map((para, i) => (
            <p key={i} style={{ margin: 0, whiteSpace: 'pre-line' }}>
              {para}
            </p>
          ))}
        </div>
      </article>
      <ContactCta />
    </StudioShell>
  );
}
