import * as React from 'react'
import Modal from 'react-modal'
Modal.setAppElement('#__next') // Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)

interface AppModalProps {
  modalOpen: boolean
  setModalState: (
    modalOpenStatus: boolean,
    modalChildren?: React.ReactNode
  ) => void
  modalTitle?: string
}

const AppModal: React.FC<AppModalProps> = ({
  modalOpen,
  setModalState,
  children,
  modalTitle = 'Modal Title',
}) => {
  return (
    <Modal
      id="app-modal"
      isOpen={modalOpen}
      className="w-80 h-128 m-auto bg-white overflow-scroll mt-48 outline-none rounded rounded-t-none"
      style={{
        overlay: { backgroundColor: '#000000bf', zIndex: 1000 },
      }}
      onRequestClose={() => {
        setModalState(false)
      }}
      contentLabel="User modal"
    >
      <header>
        <h3 className="text-center border-b fixed -mt-10 w-80 rounded-t pt-2 h-10 bg-white">
          {modalTitle}
        </h3>
      </header>
      {children}
    </Modal>
  )
}

export default AppModal
