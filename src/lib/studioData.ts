export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  cover_image: string;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
}

export interface LeadRecord {
  id: string;
  name: string;
  contact: string;
  source: string;
  service_type?: string;
  pages_count?: string;
  addons?: string[];
  estimated_total?: number;
  notes?: string;
  status: string;
  created_at: string;
}

// Bài viết mẫu đã được xoá — bài mới đăng qua trang /admin (lưu vào Supabase nếu đã cấu hình).
export const INITIAL_POSTS: BlogPost[] = [];

// In-memory runtime store for local demo when Supabase keys are not yet set
export const runtimeStore: {
  posts: BlogPost[];
  leads: LeadRecord[];
} = {
  posts: [...INITIAL_POSTS],
  leads: [],
};
