import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

export async function GET() {
  try {
    const requests = await sql`
      SELECT 
        wr.id,
        wr.amount,
        wr.wallet_address,
        wr.status,
        wr.created_at,
        wr.processed_at,
        u.name as user_name,
        u.email as user_email
      FROM withdrawal_requests wr
      JOIN users u ON wr.user_id = u.id
      ORDER BY wr.created_at DESC
    `

    return Response.json({
      requests: requests.map((request) => ({
        ...request,
        amount: Number.parseFloat(request.amount),
      })),
    })
  } catch (error) {
    console.error("Get withdrawal requests error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
