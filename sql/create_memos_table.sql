-- Create memos table based on existing Memo interface
CREATE TABLE IF NOT EXISTS public.memos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('personal', 'work', 'study', 'idea', 'other')),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (optional, for future user-based access)
ALTER TABLE public.memos ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (adjust as needed)
CREATE POLICY "Allow all operations on memos" ON public.memos
  FOR ALL USING (true) WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_memos_updated_at 
  BEFORE UPDATE ON public.memos 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_memos_created_at ON public.memos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_memos_category ON public.memos(category);
CREATE INDEX IF NOT EXISTS idx_memos_tags ON public.memos USING GIN(tags);