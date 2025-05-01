"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"


interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<User[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

 
  useEffect(() => {
    const storedUsers = localStorage.getItem("users")
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers))
    }
  }, [])

  
  useEffect(() => {
    const query = searchParams.get("search")
    if (query) {
      setSearchTerm(query)
    }
  }, [searchParams])


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)

    if (value.trim() === "") {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    
    const filteredUsers = users.filter((user) => user.email.toLowerCase().includes(value.toLowerCase()))

    setSuggestions(filteredUsers)
    setShowSuggestions(true)
  }

  
  const selectSuggestion = (user: User) => {
    setSearchTerm(user.email)
    setSuggestions([])
    setShowSuggestions(false)

    
    if (searchParams.get("search") !== user.email) {
      router.push(`/?search=${encodeURIComponent(user.email)}`)
    }
  }

 
  const filteredUsers =
    searchTerm.trim() === ""
      ? users
      : users.filter((user) => user.email.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">User Management</h1>

       
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search by email"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onFocus={() => searchTerm && setSuggestions.length > 0 && setShowSuggestions(true)}
            />

          
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                {suggestions.map((user) => (
                  <div
                    key={user.id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => selectSuggestion(user)}
                  >
                    <div>{user.email}</div>
                    <div className="text-sm text-gray-600">
                      {user.firstName} {user.lastName}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/add-user"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add User
          </Link>
        </div>

        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link href={`/edit-user/${user.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
