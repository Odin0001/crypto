"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/navbar"
import { Users, DollarSign, Clock, CheckCircle, XCircle } from "lucide-react"

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [withdrawalRequests, setWithdrawalRequests] = useState([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBalance: 0,
    pendingWithdrawals: 0,
    totalWithdrawals: 0,
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      if (user.role !== "admin") {
        window.location.href = "/dashboard"
        return
      }
    } else {
      window.location.href = "/login"
      return
    }

    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [usersRes, withdrawalsRes, statsRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/withdrawals"),
        fetch("/api/admin/stats"),
      ])

      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData.users)
      }

      if (withdrawalsRes.ok) {
        const withdrawalsData = await withdrawalsRes.json()
        setWithdrawalRequests(withdrawalsData.requests)
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData.stats)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateWithdrawalStatus = async (requestId, status) => {
    try {
      const response = await fetch("/api/admin/withdrawals/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId, status }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Withdrawal ${status} successfully`,
        })
        fetchData() // Refresh data
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to update withdrawal status",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <div className="text-white">Loading admin dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 neon-text">Admin Dashboard</h1>
            <p className="text-gray-400">Manage users, withdrawals, and platform statistics</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-800/50 border-blue-500/20 glow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Total Users</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
                <p className="text-xs text-gray-400">Registered accounts</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-green-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Total Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">${stats.totalBalance.toLocaleString()}</div>
                <p className="text-xs text-gray-400">Platform balance</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-yellow-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Pending Withdrawals</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-500">{stats.pendingWithdrawals}</div>
                <p className="text-xs text-gray-400">Awaiting approval</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-purple-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Total Withdrawals</CardTitle>
                <CheckCircle className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">${stats.totalWithdrawals.toLocaleString()}</div>
                <p className="text-xs text-gray-400">Processed</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Users Table */}
            <Card className="bg-gray-800/50 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white">User Accounts</CardTitle>
                <CardDescription className="text-gray-300">All registered users and their balances</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-300">Name</TableHead>
                        <TableHead className="text-gray-300">Email</TableHead>
                        <TableHead className="text-gray-300">Balance</TableHead>
                        <TableHead className="text-gray-300">Role</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id} className="border-gray-700">
                          <TableCell className="text-white">{user.name}</TableCell>
                          <TableCell className="text-gray-300">{user.email}</TableCell>
                          <TableCell className="text-green-400">${user.balance.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Withdrawal Requests */}
            <Card className="bg-gray-800/50 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white">Withdrawal Requests</CardTitle>
                <CardDescription className="text-gray-300">Manage pending withdrawal requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {withdrawalRequests.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No withdrawal requests</p>
                  ) : (
                    withdrawalRequests.map((request) => (
                      <div key={request.id} className="p-4 bg-gray-700/50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-white font-medium">{request.user_name}</p>
                            <p className="text-gray-400 text-sm">{request.user_email}</p>
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
                        <div className="mb-3">
                          <p className="text-white text-lg font-semibold">${request.amount.toLocaleString()}</p>
                          <p className="text-gray-400 text-xs break-all">{request.wallet_address}</p>
                          <p className="text-gray-500 text-xs">{new Date(request.created_at).toLocaleString()}</p>
                        </div>
                        {request.status === "pending" && (
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => updateWithdrawalStatus(request.id, "paid")}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => updateWithdrawalStatus(request.id, "rejected")}
                              size="sm"
                              variant="destructive"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
