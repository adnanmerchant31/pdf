/*
  # Create shared files table for PDF sharing functionality

  1. New Tables
    - `users` (if not exists)
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `shared_files`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `file_name` (text)
      - `file_url` (text)
      - `share_token` (text, unique)
      - `permissions` (jsonb)
      - `expires_at` (timestamp)
      - `max_access_count` (integer, optional)
      - `access_count` (integer, default 0)
      - `password_hash` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for users to manage their own data
    - Add policy for public access to shared files with valid tokens

  3. Indexes
    - Add indexes for share tokens and expiry dates
    - Add trigger for updated_at column
*/

-- Create users table if it doesn't exist (for Supabase auth integration)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own data
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' AND policyname = 'Users can read own data'
  ) THEN
    CREATE POLICY "Users can read own data"
      ON users
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;
END $$;

-- Create policy for users to update their own data
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' AND policyname = 'Users can update own data'
  ) THEN
    CREATE POLICY "Users can update own data"
      ON users
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Create shared_files table
CREATE TABLE IF NOT EXISTS shared_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  share_token text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'base64url'),
  permissions jsonb DEFAULT '["view"]'::jsonb,
  expires_at timestamptz NOT NULL,
  max_access_count integer,
  access_count integer DEFAULT 0,
  password_hash text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on shared_files table
ALTER TABLE shared_files ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own shared files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'shared_files' AND policyname = 'Users can manage own shared files'
  ) THEN
    CREATE POLICY "Users can manage own shared files"
      ON shared_files
      FOR ALL
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Create policy for public access to shared files with valid tokens
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'shared_files' AND policyname = 'Public can access shared files with valid tokens'
  ) THEN
    CREATE POLICY "Public can access shared files with valid tokens"
      ON shared_files
      FOR SELECT
      TO anon, authenticated
      USING (
        expires_at > now() 
        AND (max_access_count IS NULL OR access_count < max_access_count)
      );
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS shared_files_share_token_idx ON shared_files (share_token);
CREATE INDEX IF NOT EXISTS shared_files_expires_at_idx ON shared_files (expires_at);
CREATE INDEX IF NOT EXISTS shared_files_user_id_idx ON shared_files (user_id);

-- Create trigger function for updating updated_at column if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_users_updated_at'
  ) THEN
    CREATE TRIGGER update_users_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_shared_files_updated_at'
  ) THEN
    CREATE TRIGGER update_shared_files_updated_at
      BEFORE UPDATE ON shared_files
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;