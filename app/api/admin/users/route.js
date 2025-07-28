import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

export async function GET() {
  try {
    const users = await sql`
      SELECT id, name, email, role, balance, created_at
      FROM users 
      ORDER BY created_at DESC
    `

    return Response.json({
      users: users.map((user) => ({
        ...user,
        balance: Number.parseFloat(user.balance),
      })),
    })
  } catch (error) {
    console.error("Get users error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
