/*
  # Initial Schema for PDF Processing App

  1. New Tables
    - `processing_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `operation_type` (text)
      - `file_name` (text)
      - `file_size` (bigint)
      - `processed_at` (timestamp)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `processing_history` table
    - Add policies for authenticated users to manage their own processing history
*/

-- Create processing_history table
CREATE TABLE IF NOT EXISTS processing_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  operation_type text NOT NULL,
  file_name text NOT NULL,
  file_size bigint NOT NULL DEFAULT 0,
  processed_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('processing', 'completed', 'failed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE processing_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own processing history"
  ON processing_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own processing history"
  ON processing_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own processing history"
  ON processing_history
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own processing history"
  ON processing_history
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_processing_history_updated_at
  BEFORE UPDATE ON processing_history
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for performance
CREATE INDEX IF NOT EXISTS processing_history_user_id_idx ON processing_history(user_id);
CREATE INDEX IF NOT EXISTS processing_history_created_at_idx ON processing_history(created_at DESC);