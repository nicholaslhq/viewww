import React, { useState } from 'react';
import { Plus, Layout, Trash2, Monitor, Pencil, Copy } from 'lucide-react';
import { useStore } from './store/useStore';
import { GridCanvas } from './components/GridCanvas';
import { ConfirmationModal } from './components/ConfirmationModal';
import { useProfileInitialization } from './hooks/useProfileInitialization';
import { normalizeUrl } from './utils/url';
import { APP_VERSION, APP_MODE } from './constants';

function App() {
  const {
    profiles,
    activeProfileId,
    addProfile,
    setActiveProfile,
    addWindow,
    removeProfile,
    updateProfileName,
    duplicateProfile
  } = useStore();

  const [newUrl, setNewUrl] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);

  // Initialize default profile if none exist
  useProfileInitialization({
    profileCount: profiles.length,
    addProfile,
  });

  const handleSaveProfileName = (id: string) => {
    if (editName.trim()) {
      updateProfileName(id, editName.trim());
    }
    setEditingProfileId(null);
    setEditName('');
  };

  const handleAddWindow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;

    const url = normalizeUrl(newUrl);
    addWindow(url);
    setNewUrl('');
  };

  const activeProfile = profiles.find(p => p.id === activeProfileId);

  return (
    <div className="flex h-screen w-screen bg-gray-950 text-white overflow-hidden">
      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
        ${isSidebarOpen ? 'md:w-64' : 'md:w-0'}
        ${isSidebarOpen ? '' : 'md:overflow-hidden'}
        fixed md:relative z-50 md:z-auto
        w-64 h-full
        transition-all duration-300 
        bg-gray-900 border-r border-gray-800 
        flex flex-col
      `}>
        <div className="p-4 border-b border-gray-800 flex items-center gap-2">
          <Monitor className="text-blue-500" />
          <h1 className="font-bold text-xl tracking-tight">Viewww</h1>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Profiles</h2>
            <div className="space-y-2">
              {profiles.map(profile => (
                <div
                  key={profile.id}
                  className={`group flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${activeProfileId === profile.id ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-gray-800 text-gray-400'
                    }`}
                  onClick={() => setActiveProfile(profile.id)}
                >
                  {editingProfileId === profile.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={() => handleSaveProfileName(profile.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveProfileName(profile.id);
                        if (e.key === 'Escape') setEditingProfileId(null);
                      }}
                      autoFocus
                      className="bg-gray-950 text-white text-sm px-1 py-0.5 rounded border border-blue-500 outline-none w-full mr-2"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <>
                      <span className="truncate text-sm font-medium flex-1">{profile.name}</span>
                      <div className="flex items-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingProfileId(profile.id);
                            setEditName(profile.name);
                          }}
                          className="p-1 hover:text-blue-400 transition-colors"
                          title="Rename Profile"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateProfile(profile.id);
                          }}
                          className="p-1 hover:text-green-400 transition-colors"
                          title="Duplicate Profile"
                        >
                          <Copy size={14} />
                        </button>
                        {profiles.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmation(profile.id);
                            }}
                            className="p-1 hover:text-red-400 transition-colors"
                            title="Delete Profile"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}

              <button
                onClick={() => addProfile(`Profile ${profiles.length + 1}`)}
                className="w-full mt-2 flex items-center justify-center gap-2 p-2 border border-dashed border-gray-700 rounded text-gray-500 hover:text-gray-300 hover:border-gray-500 transition-all text-sm"
              >
                <Plus size={14} /> New Profile
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Add Source</h2>
            <form onSubmit={handleAddWindow} className="space-y-2">
              <input
                type="text"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Add Window
              </button>
            </form>
          </div>
        </div>

        <div className="p-4 border-t border-gray-800 text-xs text-gray-600 text-center">
          {APP_VERSION} • {APP_MODE}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Top Bar */}
        <div className="h-14 bg-gray-900/50 backdrop-blur border-b border-gray-800 flex items-center justify-between px-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded text-gray-400"
          >
            <Layout size={20} />
          </button>

          <div className="text-sm font-medium text-gray-300">
            {activeProfile?.name}
          </div>

          <div className="w-8" /> {/* Spacer */}
        </div>

        {/* Grid Canvas */}
        <div className="flex-1 overflow-hidden relative">
          <GridCanvas />
        </div>
      </div>

      <ConfirmationModal
        isOpen={!!deleteConfirmation}
        onClose={() => setDeleteConfirmation(null)}
        onConfirm={() => {
          if (deleteConfirmation) {
            removeProfile(deleteConfirmation);
            setDeleteConfirmation(null);
          }
        }}
        title="Delete Profile"
        message={
          <>
            Are you sure you want to delete "{profiles.find(p => p.id === deleteConfirmation)?.name}"?
            <br />
            This action cannot be undone.
          </>
        }
      />
    </div>
  );
}

export default App;

