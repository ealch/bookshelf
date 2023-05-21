import * as React from 'react';
import { Dialog } from './lib'


const ModalContext = React.createContext();

export const Modal = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <ModalContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </ModalContext.Provider>
  )
}

export const ModalDismissButton = ({ children }) => {
  const { props: { onClick } } = children;
  const { setIsOpen } = React.useContext(ModalContext);
  return React.cloneElement(children, {
    onClick: () => {
      onClick?.();
      setIsOpen(false)
    }
  })
}


export const ModalOpenButton = ({ children }) => {
  const { props: { onClick } } = children;
  const { setIsOpen } = React.useContext(ModalContext);
  return React.cloneElement(children, {
    onClick: () => {
      onClick?.();
      setIsOpen(true)
    }
  })
}

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
