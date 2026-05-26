-- 1. Contacts Submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Newsletter Subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Clinical Leads (Medical Access Requests)
CREATE TABLE IF NOT EXISTS medical_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  objective TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Forum Questions
CREATE TABLE IF NOT EXISTS forum_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('sommeil', 'attention', 'stress', 'hyperactivite')),
  author_name TEXT NOT NULL DEFAULT 'Anonyme',
  votes INT DEFAULT 1,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Forum Answers
CREATE TABLE IF NOT EXISTS forum_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES forum_questions(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_title TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'fr' CHECK (locale IN ('fr', 'en', 'ar')),
  published_at TIMESTAMPTZ DEFAULT now(),
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Drop policies if exist to ensure idempotency
DROP POLICY IF EXISTS "Allow public insert" ON contact_submissions;
DROP POLICY IF EXISTS "Allow public insert" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow public insert" ON medical_leads;
DROP POLICY IF EXISTS "Allow public insert" ON forum_questions;
DROP POLICY IF EXISTS "Allow public read approved questions" ON forum_questions;
DROP POLICY IF EXISTS "Allow public read answers" ON forum_answers;
DROP POLICY IF EXISTS "Allow public read blog posts" ON blog_posts;

-- Create RLS Policies
CREATE POLICY "Allow public insert" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON medical_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON forum_questions FOR INSERT WITH CHECK (true);

-- Public SELECT policies for public parts
CREATE POLICY "Allow public read approved questions" ON forum_questions FOR SELECT USING (approved = true);
CREATE POLICY "Allow public read answers" ON forum_answers FOR SELECT USING (true);
CREATE POLICY "Allow public read blog posts" ON blog_posts FOR SELECT USING (published_at <= now());

-- Update / vote policies (for public to increment votes)
DROP POLICY IF EXISTS "Allow public update votes" ON forum_questions;
CREATE POLICY "Allow public update votes" ON forum_questions FOR UPDATE USING (approved = true) WITH CHECK (true);
