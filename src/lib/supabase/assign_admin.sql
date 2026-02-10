
-- 1. Run this to assign the admin role to your user
-- Replace 'your-email@example.com' with your actual email address
UPDATE auth.users
SET raw_user_meta_data = 
  CASE 
    WHEN raw_user_meta_data IS NULL THEN '{"role": "admin"}'::jsonb
    ELSE raw_user_meta_data || '{"role": "admin"}'::jsonb
  END
WHERE email = 'your-email@example.com';

-- 2. Force a session refresh might be needed (logout/login)
