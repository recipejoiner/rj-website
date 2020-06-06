import * as React from 'react'
import Modal from 'react-modal'
Modal.setAppElement('#__next') // Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)

interface AppModalProps {
  modalOpen: boolean
  setModalOpen: (state: boolean) => void
}

const AppModal: React.FC<AppModalProps> = ({ setModalOpen, children }) => {
  return (
    <Modal
      isOpen={true}
      className="w-80 h-128 m-auto bg-white overflow-scroll mt-48 p-2 rounded border shadow-xl"
      style={{
        overlay: { backgroundColor: '#000000bf', zIndex: 1000 },
      }}
      onRequestClose={() => {
        setModalOpen(false)
      }}
      contentLabel="User modal"
    >
      {children}
    </Modal>
  )
}

export default AppModal
