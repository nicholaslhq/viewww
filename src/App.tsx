import { useState } from 'react';
import { useStore } from './store/useStore';
import { GridCanvas } from './components/GridCanvas';
import { ConfirmationModal } from './components/ConfirmationModal';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { EmptyState } from './components/EmptyState';
import { AddWindowModal } from './components/AddWindowModal';
import { useProfileInitialization } from './hooks/useProfileInitialization';
import { useTheme } from './hooks/useTheme';

function App() {
  const {
    profiles,
    activeProfileId,
    addProfile,
    addWindow,
    removeProfile,
    updateProfileName,
  } = useStore();

  // Initialize theme
  useTheme();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);

  // Initialize default profile if none exist
  useProfileInitialization({
    profileCount: profiles.length,
    addProfile,
  });

  const activeProfile = profiles.find(p => p.id === activeProfileId);
  const hasWindows = activeProfile?.layout && activeProfile.layout.length > 0;

  const handleAddWindow = (url: string) => {
    addWindow(url);
  };

  return (
    <div className="flex h-screen w-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white overflow-hidden transition-colors duration-300">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onEditProfile={updateProfileName}
        onDeleteProfile={setDeleteConfirmation}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        <TopBar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          activeProfileName={activeProfile?.name}
          onAddWindow={() => setIsAddModalOpen(true)}
        />

        {/* Canvas Area */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          {hasWindows ? (
            <GridCanvas />
          ) : (
            <EmptyState onAddWindow={() => setIsAddModalOpen(true)} />
          )}
        </div>
      </div>

      {/* Modals */}
      <AddWindowModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddWindow}
      />

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
