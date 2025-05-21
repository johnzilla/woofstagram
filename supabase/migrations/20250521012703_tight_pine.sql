/*
  # Initial schema setup for Woofstagram

  1. New Tables
    - `profiles`
      - `id` (uuid, matches auth.users.id)
      - `username` (text, unique)
      - `full_name` (text)
      - `profile_image` (text)
      - `bio` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `profiles` table
    - Add policies for:
      - Users can read all profiles
      - Users can update their own profile
*/

create table if not exists profiles (
  id uuid references auth.users(id) primary key,
  username text unique not null,
  full_name text,
  profile_image text,
  bio text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on profiles
  for select
  using (true);

create policy "Users can update their own profile"
  on profiles
  for update
  using (auth.uid() = id);

-- Set up trigger to update the updated_at column
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on profiles
  for each row
  execute function update_updated_at();