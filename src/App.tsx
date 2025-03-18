import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Auth } from './components/Auth';
import { NoteList } from './components/NoteList';
import { NoteEditor } from './components/NoteEditor';
import { Note } from './types';
import { LogOut, Plus } from 'lucide-react';

function App() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    setSelectedNote(null);
    setRefreshKey(prev => prev + 1);
  };

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">{user.email}</span>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isEditing ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              {selectedNote ? 'Edit Note' : 'Create Note'}
            </h2>
            <NoteEditor
              userId={user.id}
              noteToEdit={selectedNote}
              onSave={handleSave}
              onCancel={() => {
                setIsEditing(false);
                setSelectedNote(null);
              }}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5" />
              Create Note
            </button>
            <NoteList
              key={refreshKey}
              userId={user.id}
              onEditNote={handleEditNote}
              onNotesChange={() => setRefreshKey(prev => prev + 1)}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;