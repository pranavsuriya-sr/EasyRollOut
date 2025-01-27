"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useInventory } from "../context/InventoryContext";
import { Pencil, Trash, Search, ChevronDown, ChevronUp } from "lucide-react";
import * as XLSX from "xlsx";

export default function AdminPage() {
  const { components, setComponents, studentHistory } = useInventory();
  const [newComponent, setNewComponent] = useState({ name: "", quantity: undefined as number | undefined });
  const [studentRollNumber, setStudentRollNumber] = useState("");
  const [filteredHistory, setFilteredHistory] = useState<typeof studentHistory>([]);
  const [editingComponent, setEditingComponent] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isComponentsVisible, setIsComponentsVisible] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleAddComponent = () => {
    if (newComponent.name && typeof newComponent.quantity === "number" && newComponent.quantity > 0) {
      const newId = components.length > 0 ? Math.max(...components.map((c) => c.id)) + 1 : 1;
      setComponents([...components, { id: newId, name: newComponent.name, quantity: newComponent.quantity }]);
      setNewComponent({ name: "", quantity: undefined });
    }
  };

  const handleSearchStudent = () => {
    if (studentRollNumber) {
      const history = studentHistory.filter((record) => record.rollNumber === studentRollNumber);
      setFilteredHistory(history);
    }
  };

  const handleEditComponent = (id: number) => {
    setEditingComponent(id);
  };

  const handleUpdateComponent = (id: number, name: string, quantity: number) => {
    setComponents(components.map((c) => (c.id === id ? { ...c, name, quantity } : c)));
    setEditingComponent(null);
  };

  const handleDeleteComponent = (id: number) => {
    setComponents(components.filter((c) => c.id !== id));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] ?? null);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const workbook = XLSX.read(event.target?.result, { type: "binary" });
          const sheetName = workbook.SheetNames[0]; // First sheet
          const worksheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(worksheet);

          // Validate data structure
          if (!Array.isArray(data) || !data.every((row) => row.Component && typeof row.Quantity === "number")) {
            alert("Invalid Excel structure. Please ensure columns 'Component' and 'Quantity' exist and are valid.");
            return;
          }

          // Assign unique IDs and update state
          let maxId = components.length > 0 ? Math.max(...components.map((c) => c.id)) : 0;
          const newComponents = data.map((row) => ({
            id: ++maxId, // Increment ID for each new row
            name: row.Component,
            quantity: row.Quantity,
          }));

          setComponents([...components, ...newComponents]);
        } catch (error) {
          console.error("Error processing file:", error);
          alert("Failed to process the Excel file. Please try again.");
        }
      };
      reader.readAsBinaryString(selectedFile);
    }
  };

  const filteredComponents = components.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Admin Portal</h1>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Component Management</h2>
        <div className="space-y-4 mb-8">
          <div>
            <Label htmlFor="componentName">Component Name</Label>
            <Input
              id="componentName"
              value={newComponent.name}
              onChange={(e) => setNewComponent({ ...newComponent, name: e.target.value })}
              placeholder="Enter component name"
            />
          </div>
          <div>
            <Label htmlFor="componentQuantity">Quantity</Label>
            <Input
              id="componentQuantity"
              type="number"
              value={newComponent.quantity ?? ""}
              onChange={(e) =>
                setNewComponent({
                  ...newComponent,
                  quantity: e.target.value ? Number.parseInt(e.target.value) : undefined,
                })
              }
              min="1"
              placeholder="Enter quantity"
            />
          </div>
          <Button onClick={handleAddComponent}>Add Component</Button>
        </div>

        <div className="mb-12">
        <div className="space-y-4">
          <div>
            <Label htmlFor="excelSheet">Excel Sheet</Label>
            <Input type="file" id="excelSheet" onChange={handleFileChange} />
          </div>
          <Button onClick={handleUpload}>Upload</Button>
        </div>
      </div>
      

        <div className="space-y-4">
          <Button
            variant="outline"
            onClick={() => setIsComponentsVisible(!isComponentsVisible)}
            className="w-full flex items-center justify-between"
          >
            <span>View Components</span>
            {isComponentsVisible ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {isComponentsVisible && (
            <>
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search components..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Component</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComponents.map((component) => (
                    <TableRow key={component.id}>
                      <TableCell>
                        {editingComponent === component.id ? (
                          <Input
                            value={component.name}
                            onChange={(e) => handleUpdateComponent(component.id, e.target.value, component.quantity)}
                          />
                        ) : (
                          component.name
                        )}
                      </TableCell>
                      <TableCell>
                        {editingComponent === component.id ? (
                          <Input
                            type="number"
                            value={component.quantity}
                            onChange={(e) =>
                              handleUpdateComponent(component.id, component.name, Number.parseInt(e.target.value) || 0)
                            }
                            min="1"
                          />
                        ) : (
                          component.quantity
                        )}
                      </TableCell>
                      <TableCell>
                        {editingComponent === component.id ? (
                          <Button onClick={() => setEditingComponent(null)}>Save</Button>
                        ) : (
                          <>
                            <Button onClick={() => handleEditComponent(component.id)} className="mr-2">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button onClick={() => handleDeleteComponent(component.id)} variant="destructive">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </div>
      </div>

      

      <div>
        <h2 className="text-2xl font-semibold mb-4">Student History</h2>
        <div className="space-y-4 mb-8">
          <div>
            <Label htmlFor="studentRollNumber">Student Roll Number</Label>
            <Input
              id="studentRollNumber"
              value={studentRollNumber}
              onChange={(e) => setStudentRollNumber(e.target.value)}
              placeholder="Enter student roll number"
            />
          </div>
          <Button onClick={handleSearchStudent}>Search</Button>
        </div>
        {filteredHistory.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Component</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.action}</TableCell>
                  <TableCell>{record.component}</TableCell>
                  <TableCell>{record.quantity}</TableCell>
                  <TableCell>{record.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
