-- Add 'status' column to 'content' table
ALTER TABLE content 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';

-- Update existing records to have 'published' status
UPDATE content 
SET status = 'published' 
WHERE status IS NULL;

-- Make the column required for future inserts (optional, but good practice)
-- ALTER TABLE content ALTER COLUMN status SET NOT NULL;
