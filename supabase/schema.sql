-- Chạy file SQL này trong Supabase SQL Editor để tạo bảng cho Website Studio

create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  excerpt text not null,
  content text not null,
  category text default 'SEO & Web',
  cover_image text default '',
  meta_title text,
  meta_description text,
  published boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.leads (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  contact text not null, -- Số điện thoại
  email text,
  source text default 'bao-gia', -- 'bao-gia' | 'chatbot' | 'lien-he'
  service_type text,
  pages_count text,
  addons jsonb default '[]'::jsonb,
  estimated_total bigint default 0,
  notes text,
  status text default 'Mới',
  created_at timestamptz default now()
);

-- Nếu bảng leads đã tạo từ trước, thêm cột email:
alter table public.leads add column if not exists email text;

-- Bật RLS
alter table public.posts enable row level security;
alter table public.leads enable row level security;

-- Ai cũng có thể đọc bài viết đã publish (phục vụ SEO)
create policy "Public read published posts" on public.posts
  for select using (published = true);

-- Cho phép tạo lead từ form công khai
create policy "Public insert leads" on public.leads
  for insert with check (true);

-- Bảng posts tạo từ bản web cũ: bỏ ảnh bìa mặc định cũ
alter table public.posts alter column cover_image set default '';
