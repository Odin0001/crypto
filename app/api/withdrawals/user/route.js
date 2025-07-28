import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

export async function GET(request) {
  try {
    // In a real app, you'd get the user ID from a JWT token or session
    const userEmail = request.headers.get("user-email") || "user1@example.com"

    // Get user
    const users = await sql`
      SELECT id FROM users WHERE email = ${userEmail}
    `

    if (users.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    const user = users[0]

    // Get withdrawal requests - only return actual requests, no dummy data
    const requests = await sql`
      SELECT id, amount, wallet_address, status, created_at, processed_at
      FROM withdrawal_requests 
      WHERE user_id = ${user.id}
      ORDER BY created_at DESC
    `

    return Response.json({ requests: requests || [] })
  } catch (error) {
    console.error("Get withdrawal requests error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
