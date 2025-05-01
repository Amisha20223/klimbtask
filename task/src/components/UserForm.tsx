"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"

// User type definition (without ID for form submission)
interface UserData {
  firstName: string
  lastName: string
  email: string
  phone: string
}

// Props for the UserForm component
interface UserFormProps {
  initialData?: UserData & { id: string }
  onSubmit: (data: UserData) => boolean
}

export default function UserForm({ initialData, onSubmit }: UserFormProps) {
  // Form state
  const [formData, setFormData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Initialize form with initial data if provided
  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        phone: initialData.phone,
      })
    }
  }, [initialData])

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Mark field as touched
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))

    // Validate field
    validateField(name, value)
  }

  // Handle field blur for validation
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Mark field as touched
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))

    // Validate field
    validateField(name, value)
  }

  // Validate a single field
  const validateField = (name: string, value: string) => {
    const fieldErrors: Record<string, string> = { ...errors }

    switch (name) {
      case "firstName":
      case "lastName":
        if (!value.trim()) {
          fieldErrors[name] = `${name === "firstName" ? "First" : "Last"} name is required`
        } else {
          delete fieldErrors[name]
        }
        break

      case "email":
        if (!value.trim()) {
          fieldErrors[name] = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          fieldErrors[name] = "Please enter a valid email address"
        } else {
          delete fieldErrors[name]
        }
        break

      case "phone":
        if (!value.trim()) {
          fieldErrors[name] = "Phone number is required"
        } else if (!/^\d{10}$/.test(value.replace(/\D/g, ""))) {
          fieldErrors[name] = "Please enter a valid 10-digit phone number"
        } else {
          delete fieldErrors[name]
        }
        break

      default:
        break
    }

    setErrors(fieldErrors)
  }

  // Validate all fields
  const validateForm = () => {
    const fieldErrors: Record<string, string> = {}
    const allTouched: Record<string, boolean> = {}

    // Check each field
    if (!formData.firstName.trim()) {
      fieldErrors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      fieldErrors.lastName = "Last name is required"
    }

    if (!formData.email.trim()) {
      fieldErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      fieldErrors.email = "Please enter a valid email address"
    }

    if (!formData.phone.trim()) {
      fieldErrors.phone = "Phone number is required"
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      fieldErrors.phone = "Please enter a valid 10-digit phone number"
    }

    // Mark all fields as touched
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true
    })

    setErrors(fieldErrors)
    setTouched(allTouched)

    return Object.keys(fieldErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    if (validateForm()) {
      // Call the onSubmit callback with form data
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-4">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              touched.firstName && errors.firstName
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {touched.firstName && errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              touched.lastName && errors.lastName
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {touched.lastName && errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              touched.email && errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {touched.email && errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="1234567890"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              touched.phone && errors.phone
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {touched.phone && errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>

        {/* Form Actions */}
        <div className="flex justify-between pt-4">
          <Link href="/" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
            Cancel
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {initialData ? "Update User" : "Add User"}
          </button>
        </div>
      </div>
    </form>
  )
}
