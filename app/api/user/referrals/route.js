import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

export async function GET(request) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get("userId")

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 })
    }

    // Check if referrals table exists and get referral statistics
    let referralStats = { total_referrals: 0, qualified_referrals: 0 }
    let referralList = []

    try {
      const statsResult = await sql`
        SELECT 
          COUNT(*) as total_referrals,
          COUNT(CASE WHEN r.qualified = true THEN 1 END) as qualified_referrals
        FROM referrals r
        WHERE r.referrer_id = ${userId}
      `

      if (statsResult.length > 0) {
        referralStats = statsResult[0]
      }

      // Get detailed referral list
      const listResult = await sql`
        SELECT 
          u.name,
          u.email,
          u.total_deposited,
          r.qualified,
          r.created_at
        FROM referrals r
        JOIN users u ON r.referred_id = u.id
        WHERE r.referrer_id = ${userId}
        ORDER BY r.created_at DESC
      `

      referralList = listResult || []
    } catch (tableError) {
      console.log("Referrals table not found, returning default values:", tableError.message)
      // Return default values if table doesn't exist
    }

    const totalReferrals = Number.parseInt(referralStats.total_referrals || 0)
    const qualifiedReferrals = Number.parseInt(referralStats.qualified_referrals || 0)

    return Response.json({
      totalReferrals,
      qualifiedReferrals,
      bonusPercentage: Math.min(qualifiedReferrals, 5),
      referrals: referralList.map((ref) => ({
        name: ref.name,
        email: ref.email,
        totalDeposited: Number.parseFloat(ref.total_deposited || 0),
        qualified: ref.qualified || false,
        joinedAt: ref.created_at,
      })),
    })
  } catch (error) {
    console.error("Get referrals error:", error)

    // Return default values instead of error to prevent dashboard crash
    return Response.json({
      totalReferrals: 0,
      qualifiedReferrals: 0,
      bonusPercentage: 0,
      referrals: [],
    })
  }
}

export async function POST(request) {
  try {
    const { id } = await request.json();
    if (!id) return Response.json({ error: "User ID required" }, { status: 400 });

    const users = await sql`
      SELECT id, name, email, role, balance, referral_code, tier, weekly_return_rate, bonus_rate, total_deposited
      FROM users WHERE id = ${id} LIMIT 1
    `;
    if (users.length === 0) return Response.json({ error: "User not found" }, { status: 404 });

    const user = users[0];
    return Response.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        balance: Number.parseFloat(user.balance || 0),
        referralCode: user.referral_code,
        tier: user.tier,
        weeklyReturnRate: Number.parseFloat(user.weekly_return_rate || "0"),
        bonusRate: Number.parseFloat(user.bonus_rate || "0"),
        totalDeposited: Number.parseFloat(user.total_deposited || "0"),
      }
    });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
