-- RUN THIS IN YOUR SUPABASE SQL EDITOR

-- 1. Enable RLS on the tables (if not already enabled)
ALTER TABLE courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- 2. Create "Public Read" policies (Everyone can view)
CREATE POLICY "Public courts are viewable by everyone" ON courts FOR SELECT USING (true);
CREATE POLICY "Public categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Public content is viewable by everyone" ON content FOR SELECT USING (true);

-- 3. Create "Admin Write" policies
-- NOTE: This assumes your user has metadata 'role': 'admin'. 
-- If you haven't set up roles yet, you can replace the check with "auth.role() = 'authenticated'" to allow any logged-in user to edit.

-- Courts Policies
CREATE POLICY "Admins can insert courts" ON courts FOR INSERT 
WITH CHECK ( (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR auth.jwt() ->> 'email' = 'your-email@example.com' ); -- REPLACE proper email if needed, or stick to role

CREATE POLICY "Admins can update courts" ON courts FOR UPDATE 
USING ( (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' );

-- Categories Policies
CREATE POLICY "Admins can insert categories" ON categories FOR INSERT 
WITH CHECK ( (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR auth.jwt() ->> 'email' = 'your-email@example.com' );

-- Content Policies
CREATE POLICY "Admins can insert content" ON content FOR INSERT 
WITH CHECK ( (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR auth.jwt() ->> 'email' = 'your-email@example.com' );

CREATE POLICY "Admins/Owners can update content" ON content FOR UPDATE 
USING ( (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR auth.uid() = created_by );

-- 4. EMERGENCY OVERRIDE (Use only if the above doesn't work effectively immediately)
-- Uncomment the lines below to allow ANY logged-in user to add courts/content/categories
-- CREATE POLICY "Authenticated users can insert courts" ON courts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- CREATE POLICY "Authenticated users can insert content" ON content FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- CREATE POLICY "Authenticated users can insert categories" ON categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
