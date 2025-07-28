import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL)

export async function POST(request) {
  try {
    const { name, email, password, referralCode } = await request.json()

    // Input validation
    if (!name || !email || !password) {
      return Response.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return Response.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return Response.json({ error: "Invalid email format" }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${normalizedEmail} LIMIT 1
    `

    if (existingUser.length > 0) {
      return Response.json({ error: "User already exists" }, { status: 400 })
    }

    // Validate referral code if provided
    let referrerId = null
    if (referralCode) {
      try {
        const referrer = await sql`
          SELECT id FROM users WHERE referral_code = ${referralCode.toUpperCase()} LIMIT 1
        `
        if (referrer.length > 0) {
          referrerId = referrer[0].id
        } else {
          console.log("Referral code not found:", referralCode)
        }
      } catch (error) {
        console.log("Error validating referral code:", error.message)
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate unique referral code for new user - improved method
    const generateReferralCode = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
      let result = ""
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return result
    }

    let newReferralCode = generateReferralCode()
    let attempts = 0
    const maxAttempts = 10

    // Ensure referral code is unique
    while (attempts < maxAttempts) {
      try {
        const existingCode = await sql`
          SELECT id FROM users WHERE referral_code = ${newReferralCode} LIMIT 1
        `
        if (existingCode.length === 0) {
          break // Code is unique
        } else {
          newReferralCode = generateReferralCode()
          console.log("Referral code collision, generating new one:", newReferralCode)
        }
      } catch (error) {
        console.log("Error checking referral code uniqueness:", error.message)
        break // Proceed if there's an error checking
      }
      attempts++
    }

    console.log("Generated referral code:", newReferralCode)

    // Create user with explicit column handling
    let result
    try {
      result = await sql`
        INSERT INTO users (name, email, password, referral_code, referred_by, tier, weekly_return_rate, bonus_rate, total_deposited)
        VALUES (${name.trim()}, ${normalizedEmail}, ${hashedPassword}, ${newReferralCode}, ${referralCode || null}, 'none', 0.00, 0.00, 0.00)
        RETURNING id, name, email, role, balance, referral_code, tier, weekly_return_rate, bonus_rate, total_deposited
      `
    } catch (error) {
      console.log("Error with full insert, trying basic insert:", error.message)
      // Fallback to basic insert if new columns don't exist
      result = await sql`
        INSERT INTO users (name, email, password)
        VALUES (${name.trim()}, ${normalizedEmail}, ${hashedPassword})
        RETURNING id, name, email, role, balance
      `

      // Try to update with referral code
      try {
        await sql`
          UPDATE users 
          SET referral_code = ${newReferralCode}
          WHERE id = ${result[0].id}
        `
        result[0].referral_code = newReferralCode
      } catch (updateError) {
        console.log("Could not update referral code:", updateError.message)
      }
    }

    const user = result[0]
    console.log("Created user:", user)

    // If user was referred, try to create referral record
    if (referrerId && user.id) {
      try {
        await sql`
          INSERT INTO referrals (referrer_id, referred_id, referral_code)
          VALUES (${referrerId}, ${user.id}, ${referralCode.toUpperCase()})
        `
        console.log("Created referral record for user:", user.id)
      } catch (error) {
        console.log("Error creating referral record:", error.message)
        // Continue even if referral record creation fails
      }
    }

    return Response.json({
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || "user",
        balance: Number.parseFloat(user.balance || "0"),
        referralCode: user.referral_code || newReferralCode,
        tier: user.tier || "none",
        weeklyReturnRate: Number.parseFloat(user.weekly_return_rate || "0"),
        bonusRate: Number.parseFloat(user.bonus_rate || "0"),
        totalDeposited: Number.parseFloat(user.total_deposited || "0"),
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
