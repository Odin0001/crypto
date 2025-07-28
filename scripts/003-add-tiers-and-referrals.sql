-- Add referral code and tier columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code VARCHAR(10);
ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by VARCHAR(10);
ALTER TABLE users ADD COLUMN IF NOT EXISTS tier VARCHAR(20) DEFAULT 'none';
ALTER TABLE users ADD COLUMN IF NOT EXISTS weekly_return_rate DECIMAL(5, 2) DEFAULT 0.00;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bonus_rate DECIMAL(5, 2) DEFAULT 0.00;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_deposited DECIMAL(15, 2) DEFAULT 0.00;

-- Create unique index for referral_code if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'users_referral_code_unique') THEN
        CREATE UNIQUE INDEX users_referral_code_unique ON users(referral_code) WHERE referral_code IS NOT NULL;
    END IF;
END $$;

-- Create referrals table to track referral relationships
CREATE TABLE IF NOT EXISTS referrals (
  id SERIAL PRIMARY KEY,
  referrer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  referred_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  referral_code VARCHAR(10) NOT NULL,
  deposit_amount DECIMAL(15, 2) DEFAULT 0.00,
  qualified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create deposits_history table to track all deposits
CREATE TABLE IF NOT EXISTS deposits_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(15, 2) NOT NULL,
  tier VARCHAR(20) NOT NULL,
  weekly_rate DECIMAL(5, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create weekly_returns table to track weekly payouts
CREATE TABLE IF NOT EXISTS weekly_returns (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  base_amount DECIMAL(15, 2) NOT NULL,
  base_rate DECIMAL(5, 2) NOT NULL,
  bonus_rate DECIMAL(5, 2) DEFAULT 0.00,
  total_rate DECIMAL(5, 2) NOT NULL,
  return_amount DECIMAL(15, 2) NOT NULL,
  week_number INTEGER NOT NULL,
  year INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP NULL
);

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code() RETURNS VARCHAR(10) AS $$
DECLARE
    code VARCHAR(10);
    exists BOOLEAN;
    attempts INTEGER := 0;
BEGIN
    LOOP
        code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
        SELECT EXISTS(SELECT 1 FROM users WHERE referral_code = code) INTO exists;
        IF NOT exists THEN
            RETURN code;
        END IF;
        attempts := attempts + 1;
        IF attempts > 100 THEN
            RAISE EXCEPTION 'Could not generate unique referral code after 100 attempts';
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Update existing users to have referral codes (only if they don't have one)
UPDATE users 
SET referral_code = generate_referral_code() 
WHERE referral_code IS NULL OR referral_code = '';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_weekly_returns_user_id ON weekly_returns(user_id);
CREATE INDEX IF NOT EXISTS idx_deposits_history_user_id ON deposits_history(user_id);
