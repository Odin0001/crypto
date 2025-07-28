import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

export async function GET() {
  try {
    // Get total users
    const totalUsersResult = await sql`
      SELECT COUNT(*) as count FROM users WHERE role = 'user'
    `

    // Get total balance
    const totalBalanceResult = await sql`
      SELECT SUM(balance) as total FROM users WHERE role = 'user'
    `

    // Get pending withdrawals count
    const pendingWithdrawalsResult = await sql`
      SELECT COUNT(*) as count FROM withdrawal_requests WHERE status = 'pending'
    `

    // Get total withdrawals amount
    const totalWithdrawalsResult = await sql`
      SELECT SUM(amount) as total FROM withdrawal_requests WHERE status = 'paid'
    `

    const stats = {
      totalUsers: Number.parseInt(totalUsersResult[0].count),
      totalBalance: Number.parseFloat(totalBalanceResult[0].total || 0),
      pendingWithdrawals: Number.parseInt(pendingWithdrawalsResult[0].count),
      totalWithdrawals: Number.parseFloat(totalWithdrawalsResult[0].total || 0),
    }

    return Response.json({ stats })
  } catch (error) {
    console.error("Get stats error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
