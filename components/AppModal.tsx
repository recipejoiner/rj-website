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
      className="absolute inset-0 bg-white overflow-scroll sm:w-72 md:w-96 sm:h-96 sm:m-auto mt-12 outline-none sm:rounded-4xl sm:rounded-t-none"
      style={{
        overlay: { backgroundColor: '#000000bf', zIndex: 1000 },
      }}
      onRequestClose={() => {
        setModalState(false)
      }}
      contentLabel="User modal"
    >
      <header className="text-center border-b table fixed -mt-12 w-screen pt-2 h-12 bg-white sm:w-72 md:w-96 sm:rounded-t-4xl">
        <h3 className="font-medium mt-1">{modalTitle}</h3>
        {/* X button for closing the modal */}
        <div className="absolute w-full -mt-8">
          <button className="float-right" onClick={() => setModalState(false)}>
            <svg
              className="h-8 w-8 m-1 p-2 mr-2 sm:h-10 sm:w-10 sm:pb-3 text-gray-900 fill-current"
              viewBox="0 0 189 189"
            >
              <g id="UI-Icons" transform="translate(-477.000000, -438.000000)">
                <path
                  d="M479.229482,440.229482 C482.202126,437.256839 487.021733,437.256839 489.994376,440.229482 L571.5,521.735106 L653.005624,440.229482 C655.978267,437.256839 660.797874,437.256839 663.770518,440.229482 C666.743161,443.202126 666.743161,448.021733 663.770518,450.994376 L582.264125,532.500769 L663.770518,614.005624 C666.743161,616.978267 666.743161,621.797874 663.770518,624.770518 C660.797874,627.743161 655.978267,627.743161 653.005624,624.770518 L571.499231,543.265663 L489.994376,624.770518 C487.021733,627.743161 482.202126,627.743161 479.229482,624.770518 C476.256839,621.797874 476.256839,616.978267 479.229482,614.005624 L560.735106,532.5 L479.229482,450.994376 C476.256839,448.021733 476.256839,443.202126 479.229482,440.229482 Z"
                  id="Path"
                ></path>
              </g>
            </svg>
          </button>
        </div>
      </header>
      {children}
    </Modal>
  )
}

export default AppModal
