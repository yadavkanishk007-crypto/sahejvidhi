-- Add author_name if not exists (idempotent check is harder in raw SQL without PL/pgSQL, but running it twice is usually harmless error or we can drop/add)
-- Safer to just run ADD COLUMN and ignore if exists error manually, or:

ALTER TABLE content
ADD COLUMN IF NOT EXISTS author_name TEXT;

ALTER TABLE content
ADD COLUMN IF NOT EXISTS manual_date TIMESTAMPTZ;
