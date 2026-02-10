import { useGallery } from '../../context/GalleryContext'
import ConfirmModal from '../ConfirmModal'

export default function ResetModal() {
  const { showResetModal, setShowResetModal, handleReset } = useGallery()

  return (
    <ConfirmModal
      isOpen={showResetModal}
      onClose={() => setShowResetModal(false)}
      onConfirm={handleReset}
      title="Start Over?"
      subtitle="This action cannot be undone"
      message="Are you sure you want to start over? All your current selections, artworks, and frames will be cleared, and you'll return to the beginning."
      confirmText="Yes, Start Over"
      cancelText="Cancel"
      type="warning"
    />
  )
}
