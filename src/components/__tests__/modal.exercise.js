// 🐨 you're gonna need this stuff:
import React from 'react';
import userEvent from '@testing-library/user-event'
import { Modal, ModalContents, ModalOpenButton } from '../modal'
import { render, within } from '@testing-library/react'

test('can be opened and closed', async () => {

    const open = 'Open'
    const label = 'Modal Label'
    const title = 'Modal Title'
    const content = 'Modal content'

    const component = render(
        <Modal>
            <ModalOpenButton>
                <button>{open}</button>
            </ModalOpenButton>
            <ModalContents aria-label={label} title={title}>
                <p>{content}</p>
            </ModalContents>
        </Modal>
    )

    // Open
    const openButton = component.getByRole("button", { name: open });
    await userEvent.click(openButton);

    // Render
    const modal = component.getByRole("dialog");
    expect(modal).toHaveAttribute('aria-label', label)

    const modalWrapper = within(modal);
    expect(modalWrapper.getByRole('heading', { name: title })).toBeInTheDocument()
    expect(modalWrapper.getByText(content)).toBeInTheDocument()

    // Close
    const closeButton = modalWrapper.getByRole("button", { name: "Close" })
    await userEvent.click(closeButton)
    expect(modal).not.toBeInTheDocument();

})
