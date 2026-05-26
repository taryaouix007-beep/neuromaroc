-- Quiz Leads table for lead capture
CREATE TABLE IF NOT EXISTS quiz_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  quiz_score INT,
  quiz_results JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE quiz_leads ENABLE ROW LEVEL SECURITY;

-- Allow public insert for leads
DROP POLICY IF EXISTS "Allow public insert" ON quiz_leads;
CREATE POLICY "Allow public insert" ON quiz_leads FOR INSERT WITH CHECK (true);
