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
  email?: string;
  source: string;
  service_type?: string;
  pages_count?: string;
  addons?: string[];
  estimated_total?: number;
  notes?: string;
  status: string;
  created_at: string;
}

// Lưu tạm trong bộ nhớ khi chưa cấu hình Supabase (chỉ để thử trên máy, mất khi khởi động lại)
export const runtimeStore: {
  posts: BlogPost[];
  leads: LeadRecord[];
} = {
  posts: [],
  leads: [],
};
