import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL)

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Input validation
    if (!email || !password) {
      return Response.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user with optimized query - handle missing columns gracefully
    let users
    try {
      users = await sql`
        SELECT id, name, email, password, role, balance, referral_code, tier, weekly_return_rate, bonus_rate, total_deposited
        FROM users 
        WHERE email = ${email.toLowerCase().trim()}
        LIMIT 1
      `
    } catch (error) {
      // If new columns don't exist, fall back to basic query
      console.log("Some columns missing, using basic query:", error.message)
      users = await sql`
        SELECT id, name, email, password, role, balance
        FROM users 
        WHERE email = ${email.toLowerCase().trim()}
        LIMIT 1
      `
    }

    if (users.length === 0) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const user = users[0]

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Update last login (optional)
    await sql`
      UPDATE users 
      SET updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${user.id}
    `

    return Response.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        balance: Number.parseFloat(user.balance),
        referralCode: user.referral_code || null,
        tier: user.tier || "none",
        weeklyReturnRate: Number.parseFloat(user.weekly_return_rate || 0),
        bonusRate: Number.parseFloat(user.bonus_rate || 0),
        totalDeposited: Number.parseFloat(user.total_deposited || 0),
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
