-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  first_name text,
  last_name text,
  location text,
  job_title text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SUBSCRIPTIONS
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  tier text check (tier in ('free', 'pro')) default 'free',
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PROJECTS (Case Studies)
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null default 'Untitled Project',
  slug text unique,
  figma_url text,
  vibe text default 'minimal',
  is_published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- STORYLINE SECTIONS (Blocks for the drag-and-drop builder)
create table public.sections (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  type text not null check (type in ('figma_image', 'ai_text', 'barchart', 'ring', 'testimonial')),
  content jsonb default '{}'::jsonb not null,
  sort_order integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.projects enable row level security;
alter table public.sections enable row level security;

-- Basic Policies
create policy "Users can view their own profile." on public.profiles for select using (auth.uid() = id);
create policy "Users can update their own profile." on public.profiles for update using (auth.uid() = id);

create policy "Users can view their own projects." on public.projects for select using (auth.uid() = user_id);
create policy "Users can insert their own projects." on public.projects for insert with check (auth.uid() = user_id);
create policy "Users can update their own projects." on public.projects for update using (auth.uid() = user_id);
create policy "Users can delete their own projects." on public.projects for delete using (auth.uid() = user_id);

-- Anyone can view published projects
create policy "Anyone can view published projects." on public.projects for select using (is_published = true);
