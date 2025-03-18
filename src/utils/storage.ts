import { User, Note } from '../types';

// User Management
export const getUsers = (): User[] => {
  return JSON.parse(localStorage.getItem('users') || '[]');
};

export const createUser = (email: string, password: string): User => {
  const users = getUsers();
  const newUser = {
    id: crypto.randomUUID(),
    email,
    password, // In a real app, this should be hashed
  };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  return newUser;
};

export const authenticateUser = (email: string, password: string): User | null => {
  const users = getUsers();
  return users.find(user => user.email === email && user.password === password) || null;
};

// Note Management
export const getNotes = (userId: string): Note[] => {
  return JSON.parse(localStorage.getItem(`notes_${userId}`) || '[]');
};

export const createNote = (userId: string, title: string, content: string, tags: string[]): Note => {
  const notes = getNotes(userId);
  const newNote = {
    id: crypto.randomUUID(),
    userId,
    title,
    content,
    tags,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  notes.push(newNote);
  localStorage.setItem(`notes_${userId}`, JSON.stringify(notes));
  return newNote;
};

export const updateNote = (note: Note): Note => {
  const notes = getNotes(note.userId);
  const index = notes.findIndex(n => n.id === note.id);
  if (index !== -1) {
    notes[index] = { ...note, updatedAt: new Date().toISOString() };
    localStorage.setItem(`notes_${note.userId}`, JSON.stringify(notes));
    return notes[index];
  }
  throw new Error('Note not found');
};

export const deleteNote = (userId: string, noteId: string): void => {
  const notes = getNotes(userId);
  const filteredNotes = notes.filter(note => note.id !== noteId);
  localStorage.setItem(`notes_${userId}`, JSON.stringify(filteredNotes));
};