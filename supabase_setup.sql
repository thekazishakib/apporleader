-- ApporLeader Supabase Database Setup
-- Supabase Dashboard → SQL Editor এ paste করো → Run

-- 0. SETTINGS (site links & contact — used by Admin CMS)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Authenticated can write settings" ON settings FOR ALL USING (auth.uid() IS NOT NULL);

ALTER PUBLICATION supabase_realtime ADD TABLE settings;

-- 1. TABLES
CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  name TEXT,
  role TEXT,
  image TEXT,
  bio TEXT,
  website TEXT,
  github TEXT,
  linkedin TEXT,
  twitter TEXT,
  facebook TEXT,
  instagram TEXT,
  gmail TEXT,
  "isEx" BOOLEAN DEFAULT FALSE,
  "isPermanent" BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS leadership (
  id TEXT PRIMARY KEY,
  name TEXT,
  role TEXT,
  image TEXT,
  bio TEXT,
  website TEXT,
  github TEXT,
  linkedin TEXT,
  twitter TEXT,
  facebook TEXT,
  instagram TEXT,
  gmail TEXT,
  "isEx" BOOLEAN DEFAULT FALSE,
  "isPermanent" BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS gallery (
  id TEXT PRIMARY KEY,
  title TEXT,
  category TEXT,
  image TEXT,
  credit TEXT
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT,
  date TEXT,
  time TEXT,
  location TEXT,
  category TEXT,
  description TEXT,
  spots INTEGER DEFAULT 0,
  filled INTEGER DEFAULT 0,
  color TEXT,
  bg TEXT,
  text TEXT,
  image TEXT,
  "registrationLink" TEXT
);

CREATE TABLE IF NOT EXISTS blogs (
  id TEXT PRIMARY KEY,
  title TEXT,
  date TEXT,
  image TEXT,
  excerpt TEXT,
  content TEXT
);

CREATE TABLE IF NOT EXISTS videos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL
);

-- 2. ROW LEVEL SECURITY
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE leadership ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- সবাই read করতে পারবে
CREATE POLICY "Public can read members" ON members FOR SELECT USING (true);
CREATE POLICY "Public can read leadership" ON leadership FOR SELECT USING (true);
CREATE POLICY "Public can read gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public can read events" ON events FOR SELECT USING (true);
CREATE POLICY "Public can read blogs" ON blogs FOR SELECT USING (true);
CREATE POLICY "Public can read videos" ON videos FOR SELECT USING (true);

-- শুধু logged-in admin লিখতে/মুছতে পারবে
CREATE POLICY "Admin can write members" ON members FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can write leadership" ON leadership FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can write gallery" ON gallery FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can write events" ON events FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can write blogs" ON blogs FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can write videos" ON videos FOR ALL USING (auth.uid() IS NOT NULL);

-- 3. REALTIME
ALTER PUBLICATION supabase_realtime ADD TABLE members;
ALTER PUBLICATION supabase_realtime ADD TABLE leadership;
ALTER PUBLICATION supabase_realtime ADD TABLE gallery;
ALTER PUBLICATION supabase_realtime ADD TABLE events;
ALTER PUBLICATION supabase_realtime ADD TABLE blogs;
ALTER PUBLICATION supabase_realtime ADD TABLE videos;

-- 4. STORAGE (images — run after creating bucket in Dashboard → Storage)
-- Bucket name must match VITE_SUPABASE_STORAGE_BUCKET (default: apporleader). Mark bucket Public for read.
-- Then Storage → Policies: allow SELECT public; allow INSERT/UPDATE/DELETE for authenticated users only.
-- Example policies on storage.objects (adjust bucket id):
--   SELECT: bucket_id = 'apporleader'
--   INSERT: bucket_id = 'apporleader' AND auth.role() = 'authenticated'
--   DELETE: bucket_id = 'apporleader' AND auth.role() = 'authenticated'

-- 5. HERO IMAGES setting (run this if you set up the DB before this update)
-- This inserts the hero_images key into the settings table if it doesn't exist.
INSERT INTO settings (key, value)
VALUES ('hero_images', '[]')
ON CONFLICT (key) DO NOTHING;
