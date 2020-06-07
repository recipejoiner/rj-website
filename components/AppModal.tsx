import * as React from 'react'
import Modal from 'react-modal'
Modal.setAppElement('#__next') // Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)

interface AppModalProps {
  modalOpen: boolean
  setModalState: (
    modalOpenStatus: boolean,
    modalTitle?: string,
    modalChildren?: React.ReactNode
  ) => void
  modalTitle: string
}

const AppModal: React.FC<AppModalProps> = ({
  modalOpen,
  setModalState,
  children,
  modalTitle,
}) => {
  return (
    <Modal
      id="app-modal"
      isOpen={modalOpen}
      className="absolute inset-0 bg-white overflow-scroll sm:w-80 sm:h-128 sm:m-auto sm:mt-48 mt-10 outline-none sm:rounded sm:rounded-t-none"
      style={{
        overlay: { backgroundColor: '#000000bf', zIndex: 1000 },
      }}
      onRequestClose={() => {
        setModalState(false)
      }}
      contentLabel="User modal"
    >
      <header>
        <h3 className="text-center border-b fixed -mt-10 w-screen pt-2 h-10 bg-white sm:w-80 sm:rounded-t">
          {modalTitle}
        </h3>
      </header>
      {children}
    </Modal>
  )
}

export default AppModal
