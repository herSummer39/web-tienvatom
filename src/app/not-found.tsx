import StudioShell from '@/components/StudioShell';

export default function NotFound() {
  return (
    <StudioShell>
      <div className="studio-empty">
        <h2>Không tìm thấy trang</h2>
        <p>Trang bạn tìm không tồn tại hoặc đã được chuyển đi.</p>
        <a className="studio-btn studio-btn--primary" href="/">
          Về trang chủ
        </a>
      </div>
    </StudioShell>
  );
}
