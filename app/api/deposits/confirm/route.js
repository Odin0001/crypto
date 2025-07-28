import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

// Function to calculate tier and weekly return rate
function calculateTier(amount) {
  if (amount >= 40 && amount < 100) {
    return { tier: "bronze", rate: 5.0 }
  } else if (amount >= 100 && amount < 200) {
    return { tier: "silver", rate: 7.0 }
  } else if (amount >= 200) {
    return { tier: "gold", rate: 10.0 }
  }
  return { tier: "none", rate: 0.0 }
}

// Function to calculate referral bonus
async function calculateReferralBonus(userId) {
  const qualifiedReferrals = await sql`
    SELECT COUNT(*) as count
    FROM referrals r
    JOIN users u ON r.referred_id = u.id
    WHERE r.referrer_id = ${userId} 
    AND u.total_deposited >= 100
    AND r.qualified = true
  `

  const count = Number.parseInt(qualifiedReferrals[0].count)
  return Math.min(count, 5) * 1.0 // 1% bonus per qualified referral, max 5%
}

export async function POST(request) {
  try {
    const { userId, amount, transactionHash } = await request.json()

    if (!userId || !amount || amount < 40) {
      return Response.json({ error: "Invalid deposit amount. Minimum deposit is $40." }, { status: 400 })
    }

    // Get user details
    const users = await sql`
      SELECT id, email, total_deposited, referred_by FROM users WHERE id = ${userId} LIMIT 1
    `

    if (users.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    const user = users[0]
    const newTotalDeposited = Number.parseFloat(user.total_deposited) + Number.parseFloat(amount)

    // Calculate tier and rate
    const { tier, rate } = calculateTier(newTotalDeposited)

    // Calculate referral bonus
    const bonusRate = await calculateReferralBonus(userId)
    const totalRate = rate + bonusRate

    // Update user balance and tier
    await sql`
      UPDATE users 
      SET balance = balance + ${amount},
          total_deposited = ${newTotalDeposited},
          tier = ${tier},
          weekly_return_rate = ${rate},
          bonus_rate = ${bonusRate}
      WHERE id = ${userId}
    `

    // Record deposit history
    await sql`
      INSERT INTO deposits_history (user_id, amount, tier, weekly_rate)
      VALUES (${userId}, ${amount}, ${tier}, ${totalRate})
    `

    // If user was referred and this qualifies them, update referral
    if (user.referred_by && newTotalDeposited >= 100) {
      await sql`
        UPDATE referrals 
        SET deposit_amount = ${newTotalDeposited}, qualified = true
        WHERE referred_id = ${userId} AND referral_code = ${user.referred_by}
      `

      // Update referrer's bonus rate
      const referrer = await sql`
        SELECT id FROM users WHERE referral_code = ${user.referred_by} LIMIT 1
      `

      if (referrer.length > 0) {
        const referrerId = referrer[0].id
        const newBonusRate = await calculateReferralBonus(referrerId)

        await sql`
          UPDATE users 
          SET bonus_rate = ${newBonusRate}
          WHERE id = ${referrerId}
        `
      }
    }

    return Response.json({
      message: "Deposit confirmed successfully",
      tier,
      weeklyRate: totalRate,
      newBalance: newTotalDeposited,
    })
  } catch (error) {
    console.error("Deposit confirmation error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
