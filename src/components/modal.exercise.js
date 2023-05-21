import * as React from 'react';
import { Dialog } from './lib'

// 💰 Here's a reminder of how your components will be used:
/*
<Modal>
  <ModalOpenButton>
    <button>Open Modal</button>
  </ModalOpenButton>
  <ModalContents aria-label="Modal label (for screen readers)">
    <ModalDismissButton>
      <button>Close Modal</button>
    </ModalDismissButton>
    <h3>Modal title</h3>
    <div>Some great contents of the modal</div>
  </ModalContents>
</Modal>
*/

// we need this set of compound components to be structurally flexible
// meaning we don't have control over the structure of the components. But
// we still want to have implicitly shared state, so...
// 🐨 create a ModalContext here with React.createContext
const ModalContext = React.createContext();

// 🐨 create a Modal component that manages the isOpen state (via useState)
// and renders the ModalContext.Provider with the value which will pass the
// isOpen state and setIsOpen function
export const Modal = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <ModalContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </ModalContext.Provider>
  )
}
// 🐨 create a ModalDismissButton component that accepts children which will be
// the button which we want to clone to set it's onClick prop to trigger the
// modal to close
// 📜 https://reactjs.org/docs/react-api.html#cloneelement
// 💰 to get the setIsOpen function you'll need, you'll have to useContext!
// 💰 keep in mind that the children prop will be a single child (the user's button)
export const ModalDismissButton = ({ children }) => {
  const { setIsOpen } = React.useContext(ModalContext);
  return React.cloneElement(children, { onClick: () => setIsOpen(false) })
}



// 🐨 create a ModalOpenButton component which is effectively the same thing as
// ModalDismissButton except the onClick sets isOpen to true
export const ModalOpenButton = ({ children }) => {
  const { setIsOpen } = React.useContext(ModalContext);
  return React.cloneElement(children, { onClick: () => setIsOpen(true) })
}

// 🐨 create a ModalContents component which renders the Dialog.
// Set the isOpen prop and the onDismiss prop should set isOpen to close
// 💰 be sure to forward along the rest of the props (especially children).
export const ModalContents = (props) => {
  const { isOpen, setIsOpen } = React.useContext(ModalContext);
  return (
    <Dialog
      isOpen={isOpen}
      onDismiss={() => setIsOpen(false)}
      {...props}
    />
  )
}

// 🐨 don't forget to export all the components here
