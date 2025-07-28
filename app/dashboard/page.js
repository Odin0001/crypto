"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/navbar"
import { Wallet, ArrowUpRight, ArrowDownLeft, Copy, ExternalLink, Gift, Users, TrendingUp, Star } from "lucide-react"

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [withdrawalAmount, setWithdrawalAmount] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [withdrawalRequests, setWithdrawalRequests] = useState([])
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    qualifiedReferrals: 0,
    bonusPercentage: 0,
    referrals: [],
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const depositWalletAddress = "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      fetchWithdrawalRequests()
      if (parsedUser.id) {
        fetchReferralStats(parsedUser.id)
      }
    } else {
      window.location.href = "/login"
    }
  }, [])

  const fetchWithdrawalRequests = async () => {
    try {
      const response = await fetch("/api/withdrawals/user")
      if (response.ok) {
        const data = await response.json()
        setWithdrawalRequests(data.requests || [])
      }
    } catch (error) {
      console.error("Error fetching withdrawal requests:", error)
    }
  }

  const fetchReferralStats = async (userId) => {
    try {
      const response = await fetch(`/api/user/referrals?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setReferralStats(data)
      } else {
        console.log("Failed to fetch referral stats, using defaults")
      }
    } catch (error) {
      console.error("Error fetching referral stats:", error)
      // Keep default values if fetch fails
    }
  }

  const refreshUserData = async () => {
    if (user?.id) {
      try {
        const response = await fetch("/api/user/referrals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: user.id }),
        })
        
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          localStorage.setItem("user", JSON.stringify(data.user))
        }
      } catch (error) {
        console.error("Error refreshing user data:", error)
      }
    }
  }

  const handleWithdrawal = async (e) => {
    e.preventDefault()

    if (!withdrawalAmount || !walletAddress) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    if (Number.parseFloat(withdrawalAmount) > user.balance) {
      toast({
        title: "Error",
        description: "Insufficient balance",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/withdrawals/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number.parseFloat(withdrawalAmount),
          walletAddress,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Withdrawal request submitted successfully!",
        })
        setWithdrawalAmount("")
        setWalletAddress("")
        fetchWithdrawalRequests()
        refreshUserData() // Refresh user data after withdrawal
      } else {
        toast({
          title: "Error",
          description: data.error || "Withdrawal request failed",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    if (text) {
      navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: "Copied to clipboard",
      })
    }
  }

  const openExternalWallet = () => {
    window.open(`https://blockchain.info/address/${depositWalletAddress}`, "_blank")
  }

  const getTierInfo = (tier) => {
    switch (tier) {
      case "bronze":
        return { name: "Bronze", color: "bg-amber-600", icon: "🥉", range: "$40 - $99" }
      case "silver":
        return { name: "Silver", color: "bg-gray-400", icon: "🥈", range: "$100 - $199" }
      case "gold":
        return { name: "Gold", color: "bg-yellow-500", icon: "🥇", range: "$200+" }
      default:
        return { name: "None", color: "bg-gray-600", icon: "⭐", range: "No deposits yet" }
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  const tierInfo = getTierInfo(user.tier || "none")
  const totalReturnRate = (user.weeklyReturnRate || 0) + (user.bonusRate || 0)

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 neon-text">Welcome back, {user.name}!</h1>
            <p className="text-gray-400">Manage your investments and track your portfolio</p>
            <button 
              onClick={refreshUserData}
              className="mt-2 text-sm text-blue-400 hover:text-blue-300 underline"
            >
              Refresh Balance
            </button>
          </div>

          {/* Balance and Tier Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gray-800/50 border-blue-500/20 glow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Total Balance</CardTitle>
                <Wallet className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">${(user.balance || 0).toLocaleString()}</div>
                <p className="text-xs text-gray-400">Available for withdrawal</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-purple-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Investment Tier</CardTitle>
                <Star className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">{tierInfo.icon}</span>
                  <div className="text-xl font-bold text-white">{tierInfo.name}</div>
                </div>
                <p className="text-xs text-gray-400">{tierInfo.range}</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-green-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Weekly Returns</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">{totalReturnRate.toFixed(1)}%</div>
                <p className="text-xs text-gray-400">
                  Base: {user.weeklyReturnRate || 0}% + Bonus: {user.bonusRate || 0}%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Referral Section */}
          <Card className="mb-8 bg-gray-800/50 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Gift className="h-5 w-5 mr-2 text-blue-500" />
                Referral Program
              </CardTitle>
              <CardDescription className="text-gray-300">
                Share your referral code and earn bonus returns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Your Referral Code</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Input
                    value={user.referralCode || "Generating..."}
                    readOnly
                    className="bg-gray-700 border-gray-600 text-white font-mono text-lg"
                  />
                  <Button
                    onClick={() => copyToClipboard(user.referralCode)}
                    variant="outline"
                    size="icon"
                    className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                    disabled={!user.referralCode}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="text-xl font-bold text-white">{referralStats.totalReferrals}</div>
                      <div className="text-sm text-gray-400">Total Referrals</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="text-xl font-bold text-white">{referralStats.qualifiedReferrals}</div>
                      <div className="text-sm text-gray-400">Qualified ($100+)</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <div>
                      <div className="text-xl font-bold text-white">+{referralStats.bonusPercentage}%</div>
                      <div className="text-sm text-gray-400">Bonus Rate</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-blue-400 text-sm">
                  <strong>How it works:</strong> For every 5 users you refer who deposit $100 or more, you get an
                  additional 1% weekly return bonus (up to 5% total bonus).
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Deposit Section */}
            <Card className="bg-gray-800/50 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <ArrowDownLeft className="h-5 w-5 mr-2 text-green-500" />
                  Deposit Funds
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Send cryptocurrency to your investment wallet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">Deposit Address (BTC)</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Input value={depositWalletAddress} readOnly className="bg-gray-700 border-gray-600 text-white" />
                    <Button
                      onClick={() => copyToClipboard(depositWalletAddress)}
                      variant="outline"
                      size="icon"
                      className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={openExternalWallet}
                      variant="outline"
                      size="icon"
                      className="border-blue-500 text-blue-400 hover:bg-blue-500/10 bg-transparent"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Tier Information */}
                <div className="space-y-2">
                  <Label className="text-white">Investment Tiers & Weekly Returns</Label>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-amber-600/20 rounded">
                      <span className="text-amber-400">🥉 Bronze ($40-$99)</span>
                      <span className="text-white font-semibold">5% weekly</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-400/20 rounded">
                      <span className="text-gray-300">🥈 Silver ($100-$199)</span>
                      <span className="text-white font-semibold">7% weekly</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-yellow-500/20 rounded">
                      <span className="text-yellow-400">🥇 Gold ($200+)</span>
                      <span className="text-white font-semibold">10% weekly</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <p className="text-yellow-400 text-sm">
                    <strong>Important:</strong> Only send Bitcoin (BTC) to this address. Sending other cryptocurrencies
                    may result in permanent loss. Minimum deposit: $40
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Withdrawal Section */}
            <Card className="bg-gray-800/50 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <ArrowUpRight className="h-5 w-5 mr-2 text-red-500" />
                  Request Withdrawal
                </CardTitle>
                <CardDescription className="text-gray-300">Submit a withdrawal request to your wallet</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleWithdrawal} className="space-y-4">
                  <div>
                    <Label htmlFor="amount" className="text-white">
                      Amount (USD)
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Enter amount"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="wallet" className="text-white">
                      Wallet Address
                    </Label>
                    <Input
                      id="wallet"
                      type="text"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Enter your wallet address"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 glow" disabled={loading}>
                    {loading ? "Submitting..." : "Request Withdrawal"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Withdrawal Requests - Only show if there are requests */}
          {withdrawalRequests.length > 0 && (
            <Card className="mt-8 bg-gray-800/50 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white">Withdrawal Requests</CardTitle>
                <CardDescription className="text-gray-300">Track your withdrawal request status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {withdrawalRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                      <div>
                        <p className="text-white font-medium">${request.amount.toLocaleString()}</p>
                        <p className="text-gray-400 text-sm">{new Date(request.created_at).toLocaleDateString()}</p>
                        <p className="text-gray-400 text-xs">{request.wallet_address}</p>
                      </div>
                      <Badge
                        variant={
                          request.status === "pending"
                            ? "secondary"
                            : request.status === "paid"
                              ? "default"
                              : "destructive"
                        }
                        className={
                          request.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : request.status === "paid"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                        }
                      >
                        {request.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
