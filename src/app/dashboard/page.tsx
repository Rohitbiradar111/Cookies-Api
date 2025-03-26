"use client";

import { redirectToLogin } from "@/utils/FindToken";
import { useSelector, useDispatch } from "react-redux";
import { addNote, deleteNote, updateNote } from "@/redux/slices/notesSlice";
import { useState } from "react";

export default function DashboardPage() {
  redirectToLogin();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const dispatch = useDispatch();

  const notes = useSelector((state: any) => state.notes || []);

  const handleAddOrUpdateNote = (event: any) => {
    event.preventDefault();
    if (!title.trim() && !description.trim()) return;

    if (editingId !== null) {
      dispatch(
        updateNote({
          id: editingId,
          title: title.trim(),
          description: description.trim(),
        })
      );
      setEditingId(null);
    } else {
      const newNote = {
        id: Date.now(),
        title: title.trim(),
        description: description.trim(),
      };
      dispatch(addNote(newNote));
    }

    setTitle("");
    setDescription("");
  };

  const handleRemoveNote = (noteId: number) => {
    dispatch(deleteNote(noteId));
    if (editingId === noteId) {
      setEditingId(null);
    }
  };

  const handleEditNote = (note: any) => {
    setTitle(note.title);
    setDescription(note.description);
    setEditingId(note.id);
  };

  return (
    <div className="text-white flex flex-col items-center p-5">
      <form
        className="bg-gray-800 p-6 rounded-lg w-full max-w-md"
        onSubmit={handleAddOrUpdateNote}
      >
        <h2 className="text-2xl font-bold text-center mb-4">
          {editingId ? "Update Note" : "Create a Note"}
        </h2>
        <input
          type="text"
          className="w-full p-3 mb-3 rounded-lg bg-gray-700 border border-gray-600 text-white outline-none"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Write your note here..."
          value={description}
          className="w-full p-3 mb-3 rounded-lg bg-gray-700 border border-gray-600 text-white outline-none"
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <button
          className={`w-full py-2 px-4 rounded-lg transition font-bold ${
            editingId
              ? "bg-yellow-500 hover:bg-yellow-600 text-black"
              : "bg-green-500 hover:bg-green-600 text-black"
          }`}
          type="submit"
        >
          {editingId ? "Update Note" : "Add Note"}
        </button>
      </form>

      {notes.length > 0 && (
        <h1 className="text-3xl mt-8 font-semibold">Your Notes</h1>
      )}

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.length > 0 ? (
          notes.map((note: any) => (
            <div
              key={note.id}
              className="bg-gray-800 p-4 rounded-lg border border-gray-700 w-72"
            >
              <h3 className="text-xl font-bold mb-2 text-green-400">
                {note.title}
              </h3>
              <p className="text-gray-300">{note.description}</p>
              <div className="mt-3 flex justify-between">
                <button
                  className="bg-blue-500 text-white font-bold py-1 px-3 rounded transition"
                  onClick={() => handleEditNote(note)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white font-bold py-1 px-3 rounded transition"
                  onClick={() => handleRemoveNote(note.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-50 text-xl">No notes found.</p>
        )}
      </div>
    </div>
  );
}
