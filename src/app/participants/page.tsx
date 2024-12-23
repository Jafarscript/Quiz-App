'use client';
import { useEffect, useState } from "react";
import { Dialog, DialogTitle } from "@headlessui/react";
import { motion } from "framer-motion";
import Link from "next/link";

// Define the type for a Participant
type Participant = {
  id: string;
  name: string;
  email: string;
};

// Main component
const ParticipantsPage = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Participant, "id">>({ name: "", email: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch participants from the backend
  const getParticipants = async () => {
    try {
      const response = await fetch('/api/participants');
      if (!response.ok) throw new Error(`Failed to fetch participants: ${response.status}`);
      const data = await response.json();
      setParticipants(data);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error saving participant:", error.message);
      } else {
        console.error("Error saving participant:", error);
      }
    }
  };

  useEffect(() => {
    getParticipants();
  }, []);

  // Add or update participant
  const handleAddOrUpdateParticipant = async () => {
    try {
      // Validate input
      if (!formData.name.trim() || !formData.email.trim()) {
        alert("Name and Email are required!");
        return;
      }

      const method = editingId ? 'PUT' : 'POST';
      const url = '/api/participants';
      const body = JSON.stringify(editingId ? { id: editingId, ...formData } : formData);

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingId ? 'update' : 'add'} participant`);
      }

      // Refresh participant list
      getParticipants();
      resetForm();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error saving participant:", error.message);
      } else {
        console.error("Error saving participant:", error);
      }
    }
  };

  // Edit participant
  const handleEdit = (id: string) => {
    const participant = participants.find((p) => p.id === id);
    if (!participant) return;
    setFormData({ name: participant.name, email: participant.email });
    setEditingId(id);
    setIsDialogOpen(true);
  };

  // Delete participant
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/participants?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete participant');
      setParticipants((prev) => prev.filter((participant) => participant.id !== id));
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error saving participant:", error.message);
      } else {
        console.error("Error saving participant:", error);
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({ name: "", email: "" });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <motion.h1
        className="text-3xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Participants
      </motion.h1>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setIsDialogOpen(true)}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Add Participant
        </button>
        <Link href="/" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">Home</Link>
      </div>
      <table className="w-full border border-gray-300 bg-white shadow-md">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((participant) => (
            <tr key={participant.id} className="text-center border-t">
              <td className="p-2">{participant.name}</td>
              <td className="p-2">{participant.email}</td>
              <td className="p-2">
                <button
                  onClick={() => handleEdit(participant.id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(participant.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={resetForm}
        className="relative z-50"
        aria-labelledby="dialog-title"
      >
        <div className="fixed inset-0 bg-black bg-opacity-25" />
        <div className="fixed inset-0 flex items-center justify-center">
          <motion.div
            className="bg-white p-6 rounded-md shadow-lg w-96"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <DialogTitle id="dialog-title" className="text-xl font-bold mb-4">
              {editingId ? "Edit Participant" : "Add Participant"}
            </DialogTitle>
            <div className="mb-4">
              <label className="block text-sm mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrUpdateParticipant}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                {editingId ? "Update" : "Add"}
              </button>
            </div>
          </motion.div>
        </div>
      </Dialog>
    </div>
  );
};

export default ParticipantsPage;
