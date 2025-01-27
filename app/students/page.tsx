"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useInventory } from "../context/InventoryContext"

interface BorrowedComponent {
  id: number
  quantity: number | undefined
}

export default function StudentsPage() {
  const { components, setComponents, studentHistory, setStudentHistory } = useInventory()
  const [borrowRollNumber, setBorrowRollNumber] = useState("")
  const [returnRollNumber, setReturnRollNumber] = useState("")
  const [borrowedComponents, setBorrowedComponents] = useState<BorrowedComponent[]>([{ id: 0, quantity: undefined }])
  const [returnedComponents, setReturnedComponents] = useState<number[]>([])
  const [filteredHistory, setFilteredHistory] = useState<typeof studentHistory>([])
  const [hasSearched, setHasSearched] = useState(false)

  const handleAddComponent = () => {
    setBorrowedComponents([...borrowedComponents, { id: 0, quantity: undefined }])
  }

  const handleBorrow = () => {
    if (borrowRollNumber && borrowedComponents.every((c) => c.id !== 0 && typeof c.quantity === "number")) {
      const newHistory = borrowedComponents.map((bc, index) => ({
        id: studentHistory.length + index + 1,
        rollNumber: borrowRollNumber,
        action: "Borrowed" as const,
        component: components.find((c) => c.id === bc.id)?.name || "",
        quantity: bc.quantity!,
        date: new Date().toISOString().split("T")[0],
      }))

      // Update component quantities
      const updatedComponents = components.map((c) => {
        const borrowed = borrowedComponents.find((bc) => bc.id === c.id)
        return borrowed ? { ...c, quantity: c.quantity - (borrowed.quantity || 0) } : c
      })

      setComponents(updatedComponents)
      setStudentHistory([...studentHistory, ...newHistory])

      // Reset form
      setBorrowRollNumber("")
      setBorrowedComponents([{ id: 0, quantity: undefined }])
    }
  }

  const handleSearchStudent = () => {
    setHasSearched(true)
    if (returnRollNumber) {
      const borrowedItems = studentHistory.filter(
        (record) => record.rollNumber === returnRollNumber && record.action === "Borrowed",
      )
      const returnedItems = studentHistory.filter(
        (record) => record.rollNumber === returnRollNumber && record.action === "Returned",
      )

      const unreturned = borrowedItems.filter(
        (borrowed) =>
          !returnedItems.some(
            (returned) => returned.component === borrowed.component && returned.quantity === borrowed.quantity,
          ),
      )

      setFilteredHistory(unreturned)
    } else {
      setFilteredHistory([])
    }
  }

  const handleReturn = () => {
    if (returnRollNumber && returnedComponents.length > 0) {
      const returnedRecords = filteredHistory.filter((record) => returnedComponents.includes(record.id))

      const newHistory = returnedRecords.map((record, index) => ({
        id: studentHistory.length + index + 1,
        rollNumber: returnRollNumber,
        action: "Returned" as const,
        component: record.component,
        quantity: record.quantity,
        date: new Date().toISOString().split("T")[0],
      }))

      // Update component quantities
      const updatedComponents = components.map((c) => {
        const returned = returnedRecords.find((r) => r.component === c.name)
        return returned ? { ...c, quantity: c.quantity + returned.quantity } : c
      })

      setComponents(updatedComponents)
      setStudentHistory([...studentHistory, ...newHistory])

      // Reset form
      setReturnedComponents([])
      setFilteredHistory([])
      setReturnRollNumber("")
      setHasSearched(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Student Portal</h1>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Borrow Components</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="borrowRollNumber">Roll Number</Label>
            <Input
              id="borrowRollNumber"
              value={borrowRollNumber}
              onChange={(e) => setBorrowRollNumber(e.target.value)}
              placeholder="Enter your roll number"
            />
          </div>
          {borrowedComponents.map((component, index) => (
            <div key={index} className="flex space-x-4">
              <Select
                value={component.id.toString()}
                onValueChange={(value) => {
                  const newComponents = [...borrowedComponents]
                  newComponents[index].id = Number.parseInt(value)
                  setBorrowedComponents(newComponents)
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a component" />
                </SelectTrigger>
                <SelectContent>
                  {components.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.name} (Available: {c.quantity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={component.quantity ?? ""}
                onChange={(e) => {
                  const newComponents = [...borrowedComponents]
                  const value = e.target.value ? Number.parseInt(e.target.value) : undefined
                  const availableQuantity = components.find((c) => c.id === component.id)?.quantity || 0
                  newComponents[index].quantity = value ? Math.min(value, availableQuantity) : undefined
                  setBorrowedComponents(newComponents)
                }}
                min="1"
                max={components.find((c) => c.id === component.id)?.quantity || 1}
                placeholder="Quantity"
              />
            </div>
          ))}
          <div className="flex flex-col gap-4 pt-4">
            <Button className="w-[180px]" onClick={handleAddComponent}>Add Another Component</Button>
            <Button className="w-[180px]" onClick={handleBorrow}>Borrow</Button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Return Components</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="returnRollNumber">Roll Number</Label>
            <Input
              id="returnRollNumber"
              value={returnRollNumber}
              onChange={(e) => setReturnRollNumber(e.target.value)}
              placeholder="Enter your roll number"
            />
          </div>
          <Button onClick={handleSearchStudent}>Search</Button>
          {hasSearched && (
            <>
              {filteredHistory.length > 0 ? (
                <>
                  {filteredHistory.map((record) => (
                    <div key={record.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`return-${record.id}`}
                        checked={returnedComponents.includes(record.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setReturnedComponents([...returnedComponents, record.id])
                          } else {
                            setReturnedComponents(returnedComponents.filter((id) => id !== record.id))
                          }
                        }}
                      />
                      <Label htmlFor={`return-${record.id}`}>
                        {record.component} (Quantity: {record.quantity})
                      </Label>
                    </div>
                  ))}
                  <Button onClick={handleReturn}>Return</Button>
                </>
              ) : (
                <p className="text-gray-500">No components to return for this roll number.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

