/** @jsx jsx */
import { jsx } from '@emotion/core'

import * as React from 'react';
import VisuallyHidden from '@reach/visually-hidden'
import { CircleButton, Dialog } from 'components/lib'


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

export const ModalContentsBase = (props) => {
  const { isOpen, setIsOpen } = React.useContext(ModalContext);
  return (
    <Dialog
      isOpen={isOpen}
      onDismiss={() => setIsOpen(false)}
      {...props}
    />
  )
}

export const CloseButton = () => (
  <div css={{ display: 'flex', justifyContent: 'flex-end' }}>
    <ModalDismissButton>
      <CircleButton>
        <VisuallyHidden>Close</VisuallyHidden>
        <span aria-hidden>×</span>
      </CircleButton>
    </ModalDismissButton>
  </div>
)


export const ModalContents = ({ title, children, ...props }) => {
  return (
    <ModalContentsBase {...props}>
      <CloseButton />
      <h3 css={{ textAlign: 'center', fontSize: '2em' }}>{title}</h3>
      {children}
    </ModalContentsBase>
  )
}

// 🐨 don't forget to export all the components here
