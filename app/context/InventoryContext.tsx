"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface Component {
  id: number
  name: string
  quantity: number
}

interface StudentRecord {
  id: number
  rollNumber: string
  action: "Borrowed" | "Returned"
  component: string
  quantity: number
  date: string
}

interface InventoryContextType {
  components: Component[]
  setComponents: React.Dispatch<React.SetStateAction<Component[]>>
  studentHistory: StudentRecord[]
  setStudentHistory: React.Dispatch<React.SetStateAction<StudentRecord[]>>
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined)

export const useInventory = () => {
  const context = useContext(InventoryContext)
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider")
  }
  return context
}

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [components, setComponents] = useState<Component[]>([])
  const [studentHistory, setStudentHistory] = useState<StudentRecord[]>([])

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedComponents = localStorage.getItem("components")
    const storedHistory = localStorage.getItem("studentHistory")

    if (storedComponents) {
      setComponents(JSON.parse(storedComponents))
    }
    if (storedHistory) {
      setStudentHistory(JSON.parse(storedHistory))
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("components", JSON.stringify(components))
    localStorage.setItem("studentHistory", JSON.stringify(studentHistory))
  }, [components, studentHistory])

  return (
    <InventoryContext.Provider value={{ components, setComponents, studentHistory, setStudentHistory }}>
      {children}
    </InventoryContext.Provider>
  )
}

