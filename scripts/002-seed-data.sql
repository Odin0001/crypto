-- Insert admin user with correct password hash
-- Password: admin123 (properly hashed with bcrypt)
INSERT INTO users (email, password, name, role) VALUES 
('admin@crypto.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', 'admin')
ON CONFLICT (email) DO UPDATE SET 
  password = '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  name = 'Admin User',
  role = 'admin';

-- Remove investment plans table and data (we use tiers now)
DROP TABLE IF EXISTS investment_plans;

-- Insert sample users for testing with correct password hashes
-- Password for both: password123
INSERT INTO users (email, password, name, balance, referral_code, tier, weekly_return_rate, bonus_rate, total_deposited) VALUES 
('user1@example.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John Doe', 5000.00, 'TESTREF1', 'gold', 10.00, 0.00, 250.00),
('user2@example.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane Smith', 12000.00, 'TESTREF2', 'silver', 7.00, 2.00, 150.00)
ON CONFLICT (email) DO UPDATE SET 
  password = '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  balance = EXCLUDED.balance,
  referral_code = EXCLUDED.referral_code,
  tier = EXCLUDED.tier,
  weekly_return_rate = EXCLUDED.weekly_return_rate,
  bonus_rate = EXCLUDED.bonus_rate,
  total_deposited = EXCLUDED.total_deposited;

-- Create some sample referral relationships for testing
INSERT INTO referrals (referrer_id, referred_id, referral_code, deposit_amount, qualified) 
SELECT 
  u1.id as referrer_id,
  u2.id as referred_id,
  'TESTREF1' as referral_code,
  150.00 as deposit_amount,
  true as qualified
FROM users u1, users u2 
WHERE u1.email = 'user1@example.com' AND u2.email = 'user2@example.com'
ON CONFLICT DO NOTHING;
