-- Fix admin password with correct bcrypt hash
-- Password: admin123
UPDATE users 
SET password = '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE email = 'admin@crypto.com';

-- Ensure admin has all required columns
UPDATE users 
SET 
  referral_code = COALESCE(referral_code, 'ADMIN001'),
  tier = COALESCE(tier, 'admin'),
  weekly_return_rate = COALESCE(weekly_return_rate, 0.00),
  bonus_rate = COALESCE(bonus_rate, 0.00),
  total_deposited = COALESCE(total_deposited, 0.00)
WHERE email = 'admin@crypto.com';

-- Remove investment_plans table if it exists
DROP TABLE IF EXISTS investment_plans CASCADE;
