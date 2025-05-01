"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import UserForm from "@/components/UserForm"


interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

export default function EditUser({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
   
    const storedUsers = localStorage.getItem("users")
    if (storedUsers) {
      const users: User[] = JSON.parse(storedUsers)
      const foundUser = users.find((u) => u.id === params.id)

      if (foundUser) {
        setUser(foundUser)
      } else {
        setError("User not found")
      }
    } else {
      setError("No users found")
    }

    setLoading(false)
  }, [params.id])

  const handleSubmit = (userData: Omit<User, "id">) => {
    if (!user) return false

   
    const storedUsers = localStorage.getItem("users")
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : []

   
    const isDuplicate = users.some((u) => u.id !== user.id && u.email.toLowerCase() === userData.email.toLowerCase())

    if (isDuplicate) {
      setError("A user with this email already exists.")
      return false
    }

    
    const updatedUsers = users.map((u) => (u.id === user.id ? { ...userData, id: user.id } : u))

    localStorage.setItem("users", JSON.stringify(updatedUsers))

   
    router.push("/")
    return true
  }

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">{error}</div>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Edit User</h1>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

        {user && <UserForm initialData={user} onSubmit={handleSubmit} />}
      </div>
    </div>
  )
}
