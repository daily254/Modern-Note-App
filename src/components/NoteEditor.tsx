import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import { createNote, updateNote } from '../utils/storage';
import { X, Clock, Hash } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface NoteEditorProps {
  userId: string;
  noteToEdit: Note | null;
  onSave: () => void;
  onCancel: () => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  userId,
  noteToEdit,
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
      setTags(noteToEdit.tags);
    }
  }, [noteToEdit]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (noteToEdit) {
      updateNote({
        ...noteToEdit,
        title,
        content,
        tags,
        updatedAt: new Date().toISOString(),
      });
    } else {
      createNote(userId, title, content, tags);
    }
    
    onSave();
    setTitle('');
    setContent('');
    setTags([]);
  };

  const getReadingTime = (): string => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Save with Ctrl/Cmd + S
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSubmit(e as any);
    }
    // Add tag with Enter in tag input
    if (e.key === 'Enter' && document.activeElement === document.getElementById('tagInput')) {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" onKeyDown={handleKeyDown}>
      <div>
        <input
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            {getReadingTime()}
            <span className="mx-2">•</span>
            <span>{content.length} characters</span>
          </div>
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            {isPreview ? 'Edit' : 'Preview'}
          </button>
        </div>

        {isPreview ? (
          <div className="prose max-w-none p-4 border border-gray-300 rounded-md min-h-[200px] bg-gray-50">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            placeholder="Note content (Markdown supported)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[200px] font-mono"
            required
          />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              id="tagInput"
              type="text"
              placeholder="Add tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Add Tag
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full flex items-center gap-2"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500">
        <div>
          Press Ctrl/Cmd + S to save
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {noteToEdit ? 'Update Note' : 'Create Note'}
          </button>
        </div>
      </div>
    </form>
  );
};