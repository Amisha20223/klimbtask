"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import UserForm from "@/components/UserForm"


interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

export default function AddUser() {
  const router = useRouter()
  const [error, setError] = useState("")

  const handleSubmit = (userData: Omit<User, "id">) => {
    
    const storedUsers = localStorage.getItem("users")
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : []

 
    const isDuplicate = users.some((user) => user.email.toLowerCase() === userData.email.toLowerCase())

    if (isDuplicate) {
      setError("A user with this email already exists.")
      return false
    }

    
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
    }

   
    const updatedUsers = [...users, newUser]

   
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    
    router.push("/")
    return true
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Add User</h1>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

        <UserForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
