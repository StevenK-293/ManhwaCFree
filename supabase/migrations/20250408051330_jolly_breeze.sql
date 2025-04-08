/*
  1. New Tables
    - `reading_list`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `manga_slug` (text)
      - `title` (text)
      - `status` (text)
      - `last_chapter` (text)
      - `last_read` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `reading_list` table
*/

CREATE TABLE reading_list (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  manga_slug text NOT NULL,
  title text NOT NULL,
  status text NOT NULL,
  last_chapter text,
  last_read timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, manga_slug)
);

ALTER TABLE reading_list ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reading list"
  ON reading_list
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own reading list"
  ON reading_list
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reading list"
  ON reading_list
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own reading list"
  ON reading_list
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_reading_list_user_id ON reading_list(user_id);
CREATE INDEX idx_reading_list_manga_slug ON reading_list(manga_slug);
