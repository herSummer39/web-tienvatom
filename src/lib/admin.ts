import { timingSafeEqual } from 'crypto';

// Kiểm tra mật khẩu quản trị (header x-admin-password) với biến môi trường ADMIN_PASSWORD.
// Chưa đặt ADMIN_PASSWORD thì khóa hẳn khu vực quản trị (không có mật khẩu mặc định).
export function isAdmin(req: Request): boolean {
  const expected = process.env.ADMIN_PASSWORD || '';
  const given = req.headers.get('x-admin-password') || '';
  if (!expected || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
