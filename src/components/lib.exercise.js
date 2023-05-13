/** @jsx jsx */
import styled from '@emotion/styled/macro'
import { Dialog as ReachDialog } from '@reach/dialog'
import { FaSpinner } from 'react-icons/fa'
import { keyframes } from '@emotion/core'
import * as mq from 'styles/media-queries';
import * as colors from 'styles/colors';
import * as misc from 'styles/misc';




// Button:
//   padding: '10px 15px',
//   border: '0',
//   lineHeight: '1',
//   borderRadius: '3px',

// Button variant="primary" (in addition to the above styles)
//   background: '#3f51b5',
//   color: 'white',

// Button variant="secondary" (in addition to the above styles)
//   background: '#f1f2f7',
//   color: '#434449',
const buttonVariants = {
  primary: {
    background: colors.indigo,
    color: colors.base,
  },
  secondary: {
    background: colors.gray,
    color: colors.text,
  }
}

const Button = styled.button({
  padding: '10px 15px',
  border: '0',
  lineHeight: '1',
  borderRadius: '3px',
}, ({ variant = 'primary' }) => buttonVariants[variant]);


// Input
//   borderRadius: '3px',
//   border: '1px solid #f1f1f4',
//   background: '#f1f2f7',
//   padding: '8px 12px',

const Input = styled.input({
  borderRadius: '3px',
  border: misc.border,
  background: colors.gray,
  padding: '8px 12px',
});


// FormGroup
//   display: 'flex',
//   flexDirection: 'column',

const FormGroup = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

// 💰 I'm giving a few of these to you:
const CircleButton = styled.button({
  borderRadius: '30px',
  padding: '0',
  width: '40px',
  height: '40px',
  lineHeight: '1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: colors.base,
  color: colors.text,
  border: misc.border,
  cursor: 'pointer',
})

const Dialog = styled(ReachDialog)({
  maxWidth: '450px',
  borderRadius: '3px',
  paddingBottom: '3.5em',
  boxShadow: misc.boxShadow,
  margin: '20vh auto',
  [mq.small]: {
    width: '100%',
    margin: '10vh auto',
  },
})

const spin = keyframes`
  0%  {-webkit-transform: rotate(0deg);}
  100% {-webkit-transform: rotate(360deg);}   
`
const Spinner = styled(FaSpinner)({
  animation: `${spin} 1s linear infinite`,
})

export { Button, Input, FormGroup, CircleButton, Dialog, Spinner }
