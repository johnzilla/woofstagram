/*
  # Create posts and engagement tables

  1. New Tables
    - `posts`
      - `id` (uuid)
      - `user_id` (uuid, references profiles.id)
      - `image_url` (text)
      - `caption` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `likes`
      - `post_id` (uuid, references posts.id)
      - `user_id` (uuid, references profiles.id)
      - `created_at` (timestamp)
    
    - `comments`
      - `id` (uuid)
      - `post_id` (uuid, references posts.id)
      - `user_id` (uuid, references profiles.id)
      - `content` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for CRUD operations
*/

-- Posts table
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  image_url text not null,
  caption text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table posts enable row level security;

create policy "Posts are viewable by everyone"
  on posts
  for select
  using (true);

create policy "Users can create their own posts"
  on posts
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own posts"
  on posts
  for update
  using (auth.uid() = user_id);

-- Likes table
create table if not exists likes (
  post_id uuid references posts(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (post_id, user_id)
);

alter table likes enable row level security;

create policy "Users can view all likes"
  on likes
  for select
  using (true);

create policy "Users can like/unlike posts"
  on likes
  for all
  using (auth.uid() = user_id);

-- Comments table
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table comments enable row level security;

create policy "Comments are viewable by everyone"
  on comments
  for select
  using (true);

create policy "Users can create comments"
  on comments
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own comments"
  on comments
  for update
  using (auth.uid() = user_id);

-- Set up triggers for updated_at
create trigger posts_updated_at
  before update on posts
  for each row
  execute function update_updated_at();

create trigger comments_updated_at
  before update on comments
  for each row
  execute function update_updated_at();