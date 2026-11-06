import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Trash2, 
  Save, 
  Check, 
  Calendar, 
  Tag, 
  Copy, 
  FileText,
  Clock
} from 'lucide-react';
import { Note, MINING_AREAS } from '../types';
import { formatDate, getTodayString } from '../utils/formatters';

interface NotesSectionProps {
  notes: Note[];
  onSaveNote: (note: Note) => Promise<void>;
  onDeleteNote: (id: string) => Promise<void>;
  userId: string;
}

export const NotesSection: React.FC<NotesSectionProps> = ({
  notes,
  onSaveNote,
  onDeleteNote,
  userId,
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(notes[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('todas');

  // Active note form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(getTodayString());
  const [category, setCategory] = useState<string>('Extracción / Socavón');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'dirty'>('saved');
  const [copied, setCopied] = useState(false);

  // Sync editor fields when selected note changes
  useEffect(() => {
    if (selectedNoteId) {
      const current = notes.find((n) => n.id === selectedNoteId);
      if (current) {
        setTitle(current.title || '');
        setContent(current.content || '');
        setDate(current.date || getTodayString());
        setCategory(current.category || 'Extracción / Socavón');
        setSaveStatus('saved');
      }
    } else if (notes.length > 0) {
      setSelectedNoteId(notes[0].id);
    }
  }, [selectedNoteId, notes]);

  // Debounced Auto-save
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!selectedNoteId) return;

    setSaveStatus('dirty');
    const timer = setTimeout(async () => {
      setSaveStatus('saving');
      const noteToSave: Note = {
        id: selectedNoteId,
        userId,
        title: title.trim() || 'Nota sin título',
        content,
        date,
        category,
      };
      await onSaveNote(noteToSave);
      setSaveStatus('saved');
    }, 1000);

    return () => clearTimeout(timer);
  }, [title, content, date, category]);

  const handleCreateNewNote = async () => {
    const newId = 'nota_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
    const newNote: Note = {
      id: newId,
      userId,
      title: 'Nuevo apunte de campo',
      content: '',
      date: getTodayString(),
      category: 'Extracción / Socavón',
    };
    await onSaveNote(newNote);
    setSelectedNoteId(newId);
    setTitle(newNote.title);
    setContent('');
    setDate(newNote.date);
    setCategory(newNote.category || 'Extracción / Socavón');
    setSaveStatus('saved');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este apunte?')) {
      await onDeleteNote(id);
      if (selectedNoteId === id) {
        const remaining = notes.filter((n) => n.id !== id);
        setSelectedNoteId(remaining[0]?.id || null);
      }
    }
  };

  const handleCopyNote = () => {
    const fullText = `*${title}* (${formatDate(date)} - ${category})\n\n${content}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleManualSave = async () => {
    if (!selectedNoteId) return;
    setSaveStatus('saving');
    const noteToSave: Note = {
      id: selectedNoteId,
      userId,
      title: title.trim() || 'Nota sin título',
      content,
      date,
      category,
    };
    await onSaveNote(noteToSave);
    setSaveStatus('saved');
  };

  // Filter notes
  const filteredNotes = notes.filter((n) => {
    const matchSearch =
      (n.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.content || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = categoryFilter === 'todas' || n.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-4">
      {/* Top Bar: Search & New Note */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
        <div className="flex-1 flex flex-col xs:flex-row items-stretch xs:items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar apuntes por título o texto..."
              className="w-full pl-9 pr-3 py-2 bg-slate-800/90 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="py-2 px-3 bg-slate-800/90 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-hidden focus:border-amber-500"
          >
            <option value="todas">Todas las áreas</option>
            {MINING_AREAS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleCreateNewNote}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-amber-500/20 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Nuevo Apunte</span>
        </button>
      </div>

      {/* Main Dual Pane: Notes List (Left) + Editor (Right) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
        {/* Left: Notes List */}
        <div className={`lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden ${
          selectedNoteId && 'hidden lg:flex'
        }`}>
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>{filteredNotes.length} APUNTES REGISTRADOS</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                <p className="text-xs">No se encontraron apuntes.</p>
              </div>
            ) : (
              filteredNotes.map((note) => {
                const isSelected = note.id === selectedNoteId;
                return (
                  <div
                    key={note.id}
                    onClick={() => setSelectedNoteId(note.id)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/40 shadow-xs'
                        : 'bg-slate-850 hover:bg-slate-800 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`text-xs sm:text-sm font-bold truncate ${
                        isSelected ? 'text-amber-300' : 'text-slate-100'
                      }`}>
                        {note.title || 'Sin título'}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {formatDate(note.date)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                      {note.content || 'Sin contenido adicional...'}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60 font-medium">
                        {note.category || 'General'}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(note.id);
                        }}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded-md transition-colors"
                        title="Eliminar apunte"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Active Note Editor */}
        <div className={`lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden ${
          !selectedNoteId && 'hidden lg:flex'
        }`}>
          {selectedNoteId ? (
            <>
              {/* Editor Header: Title, Date, Category & Auto-save Status */}
              <div className="p-4 border-b border-slate-800 bg-slate-900/90 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  {/* Back to list button on mobile */}
                  <button
                    onClick={() => setSelectedNoteId(null)}
                    className="lg:hidden text-xs text-amber-400 font-semibold flex items-center gap-1"
                  >
                    ← Volver a la lista
                  </button>

                  {/* Auto-save indicator */}
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                      {saveStatus === 'saving' && (
                        <>
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                          <span className="text-amber-400">Guardando...</span>
                        </>
                      )}
                      {saveStatus === 'saved' && (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400/90 text-[11px]">Guardado automático</span>
                        </>
                      )}
                      {saveStatus === 'dirty' && (
                        <span className="text-slate-400 text-[11px]">Modificado...</span>
                      )}
                    </span>

                    <button
                      onClick={handleManualSave}
                      title="Guardar de inmediato"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1"
                    >
                      <Save className="w-3.5 h-3.5 text-amber-400" />
                      <span className="hidden sm:inline">Guardar</span>
                    </button>

                    <button
                      onClick={handleCopyNote}
                      title="Copiar texto completo"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="hidden sm:inline">{copied ? 'Copiado' : 'Copiar'}</span>
                    </button>

                    <button
                      onClick={() => handleDelete(selectedNoteId)}
                      title="Eliminar este apunte"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 border border-slate-700 text-xs font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Title Input */}
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Título del apunte de campo..."
                  className="w-full text-base sm:text-xl font-bold bg-transparent text-white placeholder-slate-500 focus:outline-hidden border-b border-transparent focus:border-amber-500/50 pb-1"
                />

                {/* Metadata Row: Date & Area */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="bg-transparent text-xs text-slate-200 focus:outline-hidden"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
                    <Tag className="w-3.5 h-3.5 text-amber-400" />
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="bg-transparent text-xs text-slate-200 focus:outline-hidden"
                    >
                      {MINING_AREAS.map((a) => (
                        <option key={a} value={a} className="bg-slate-850 text-white">
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Note Content Textarea */}
              <div className="flex-1 p-4 bg-slate-900">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escribe aquí los apuntes diarios: novedades de guardia, avance en metros, uso de explosivos, fallas mecánicas, inspecciones de seguridad, etc. Se guardará automáticamente mientras escribes..."
                  className="w-full h-full bg-transparent text-slate-200 text-sm sm:text-base leading-relaxed placeholder-slate-500 focus:outline-hidden resize-none"
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-500 text-center">
              <BookOpen className="w-12 h-12 mb-3 text-slate-600 opacity-50" />
              <h4 className="text-sm font-semibold text-slate-400">Ningún apunte seleccionado</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Selecciona un apunte de la lista izquierda o crea uno nuevo para empezar a redactar.
              </p>
              <button
                onClick={handleCreateNewNote}
                className="mt-4 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                + Crear Nuevo Apunte
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
