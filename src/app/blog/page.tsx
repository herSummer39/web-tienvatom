import type { Metadata } from 'next';
import StudioShell from '@/components/StudioShell';
import ContactCta from '@/components/ContactCta';
import { makeHeroHtml } from '@/components/siteChrome';
import { getAllPosts } from '@/lib/posts';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Chia sẻ của Tiệm Code về website, phần mềm và marketing trên Zalo.',
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <StudioShell heroHtml={makeHeroHtml('Blog', 'Chia sẻ về website, phần mềm và marketing.')}>
      {posts.length === 0 ? (
        <div className="studio-empty">
          <h2>Sắp có bài viết</h2>
          <p>Tụi mình đang chuẩn bị những bài chia sẻ đầu tiên về website, phần mềm và marketing trên Zalo.</p>
        </div>
      ) : (
        <div className="studio-grid-3">
          {posts.map((p) => (
            <a key={p.id} className="studio-card" href={`/blog/${p.slug}`}>
              <span className="studio-mono" style={{ fontSize: 12, color: 'var(--studio-muted)' }}>
                {new Date(p.created_at).toLocaleDateString('vi-VN')} · {p.category}
              </span>
              <h3>{p.title}</h3>
              <p>{p.excerpt}</p>
            </a>
          ))}
        </div>
      )}
      <ContactCta />
    </StudioShell>
  );
}
