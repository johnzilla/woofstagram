/*
  # Create follows table for user relationships

  1. New Tables
    - `follows`
      - `follower_id` (uuid, references profiles.id)
      - `following_id` (uuid, references profiles.id)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for following/unfollowing
*/

create table if not exists follows (
  follower_id uuid references profiles(id) on delete cascade,
  following_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (follower_id, following_id)
);

alter table follows enable row level security;

create policy "Users can view all follows"
  on follows
  for select
  using (true);

create policy "Users can follow/unfollow others"
  on follows
  for all
  using (auth.uid() = follower_id);