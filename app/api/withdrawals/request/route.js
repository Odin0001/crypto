import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

export async function POST(request) {
  try {
    const { amount, walletAddress } = await request.json()

    // In a real app, you'd get the user ID from a JWT token or session
    // For this demo, we'll use a simple approach
    const userEmail = request.headers.get("user-email") || "user1@example.com"

    // Get user
    const users = await sql`
      SELECT id, balance FROM users WHERE email = ${userEmail}
    `

    if (users.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    const user = users[0]

    if (Number.parseFloat(user.balance) < amount) {
      return Response.json({ error: "Insufficient balance" }, { status: 400 })
    }

    // Create withdrawal request
    const result = await sql`
      INSERT INTO withdrawal_requests (user_id, amount, wallet_address)
      VALUES (${user.id}, ${amount}, ${walletAddress})
      RETURNING id, amount, wallet_address, status, created_at
    `

    return Response.json({
      message: "Withdrawal request created successfully",
      request: result[0],
    })
  } catch (error) {
    console.error("Withdrawal request error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
