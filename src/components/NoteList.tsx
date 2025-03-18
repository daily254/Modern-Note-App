import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import { getNotes, deleteNote } from '../utils/storage';
import { Trash2, Edit, Clock, Search, SortAsc, SortDesc } from 'lucide-react';
import { AlertDialog } from './AlertDialog';

interface NoteListProps {
  userId: string;
  onEditNote: (note: Note) => void;
  onNotesChange: () => void;
}

export const NoteList: React.FC<NoteListProps> = ({ userId, onEditNote, onNotesChange }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deleteAlert, setDeleteAlert] = useState<{ isOpen: boolean; noteId: string | null }>({
    isOpen: false,
    noteId: null,
  });

  useEffect(() => {
    const userNotes = getNotes(userId);
    setNotes(userNotes);
  }, [userId]);

  const handleDeleteClick = (noteId: string) => {
    setDeleteAlert({ isOpen: true, noteId });
  };

  const handleDeleteConfirm = () => {
    if (deleteAlert.noteId) {
      deleteNote(userId, deleteAlert.noteId);
      setNotes(getNotes(userId));
      onNotesChange();
    }
    setDeleteAlert({ isOpen: false, noteId: null });
  };

  const getAllTags = () => {
    const tags = new Set<string>();
    notes.forEach(note => note.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  };

  const getReadingTime = (content: string): string => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const filteredAndSortedNotes = notes
    .filter(note => {
      const matchesTag = selectedTag ? note.tags.includes(selectedTag) : true;
      const matchesSearch = searchQuery
        ? note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      return matchesTag && matchesSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  return (
    <div className="space-y-4">
      <AlertDialog
        isOpen={deleteAlert.isOpen}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteAlert({ isOpen: false, noteId: null })}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          {sortOrder === 'asc' ? (
            <SortAsc className="h-5 w-5" />
          ) : (
            <SortDesc className="h-5 w-5" />
          )}
          Sort by date
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          className={`px-3 py-1 rounded-full text-sm ${
            !selectedTag ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setSelectedTag('')}
        >
          All
        </button>
        {getAllTags().map(tag => (
          <button
            key={tag}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedTag === tag ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setSelectedTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAndSortedNotes.map(note => (
          <div
            key={note.id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold mb-2">{note.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-3">{note.content}</p>
            <div className="flex gap-2 flex-wrap mb-4">
              {note.tags.map(tag => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {getReadingTime(note.content)}
              </div>
              <div className="flex items-center gap-4">
                <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEditNote(note)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(note.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};