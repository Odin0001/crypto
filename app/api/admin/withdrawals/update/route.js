import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

export async function POST(request) {
  try {
    const { requestId, status } = await request.json()

    // Update withdrawal request status
    const result = await sql`
      UPDATE withdrawal_requests 
      SET status = ${status}, processed_at = CURRENT_TIMESTAMP
      WHERE id = ${requestId}
      RETURNING id, user_id, amount, status
    `

    if (result.length === 0) {
      return Response.json({ error: "Withdrawal request not found" }, { status: 404 })
    }

    const withdrawalRequest = result[0]

    // If approved, deduct from user balance
    if (status === "paid") {
      await sql`
        UPDATE users 
        SET balance = balance - ${withdrawalRequest.amount}
        WHERE id = ${withdrawalRequest.user_id}
      `
    }

    return Response.json({
      message: `Withdrawal request ${status} successfully`,
      request: withdrawalRequest,
    })
  } catch (error) {
    console.error("Update withdrawal status error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
