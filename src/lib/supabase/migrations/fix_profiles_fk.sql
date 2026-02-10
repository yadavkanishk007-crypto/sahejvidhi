-- 1. Add Foreign Key Constraint
ALTER TABLE content
ADD CONSTRAINT fk_content_created_by_profiles
FOREIGN KEY (created_by)
REFERENCES profiles (id)
ON DELETE SET NULL;

-- 2. Verify and Fix Profiles Policies (ensure public read is allowed)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING (true);

-- 3. (Optional but recommended) Index the column
CREATE INDEX IF NOT EXISTS idx_content_created_by ON content(created_by);
