
-- Create a new storage bucket for site images
INSERT INTO storage.buckets (id, name, public)
VALUES ('site_images', 'Site Images', true);

-- Add policy to allow public read access to the bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT
USING (bucket_id = 'site_images');

-- Add policy to allow authenticated users to upload
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'site_images');

-- Add policy to allow authenticated users to update
CREATE POLICY "Authenticated users can update" ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'site_images');

-- Add policy to allow authenticated users to delete
CREATE POLICY "Authenticated users can delete" ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'site_images');

-- Create site_config table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.site_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add initial records for colors if they don't exist
INSERT INTO public.site_config (key, value)
VALUES 
  ('background_color', '#F5E9D7'),
  ('text_color', '#3A2E1F'),
  ('button_color', '#4A5E3A'),
  ('header_footer_color', '#6B2D2D'),
  ('home_image_url', '/lovable-uploads/3879cbc3-d347-45e2-b93d-53a58b78ba5a.png')
ON CONFLICT (key) DO NOTHING;
