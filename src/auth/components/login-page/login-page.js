import React, {useState, useContext} from 'react'
import {Redirect} from 'react-router-dom'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Snackbar from '@material-ui/core/Snackbar'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import Avatar from '@material-ui/core/Avatar'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/core/styles'

import {login} from '../../services'

import {ADMIN_ROLE, EMPLOYEE_ROLE} from '../../../consts/index'
import {AuthContext} from '../../../utils/contexts/auth-context'
import {validateEmail, validatePassword} from '../../../utils/helpers'

// styles
const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

// password validation message
const passwordValidationsMsg =
  'The password must contain at least 8 characters, one upper case letter, one number and one special character'

const LoginPage = () => {
  // styles
  const classes = useStyles()

  const {handleSuccessLogin, user} = useContext(AuthContext)

  // state
  const [emailValidationMessage, setEmailValidationMessage] = useState('')
  const [passwordValidationMessage, setPasswordValidationMessage] = useState('')
  const [formValues, setFormValues] = useState({email: '', password: ''})
  const [isFetching, setIsFetching] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // validate empty fields
  const validateForm = () => {
    const {email, password} = formValues

    const isEmailEmpty = !email
    const isPasswordEmpty = !password

    if (isEmailEmpty) {
      setEmailValidationMessage('The email is required')
    }

    if (isPasswordEmpty) {
      setPasswordValidationMessage('The password is required')
    }

    return isEmailEmpty || isPasswordEmpty
  }

  // handle validation messages
  const handleSubmit = async e => {
    e.preventDefault()

    if (validateForm()) {
      return
    }

    const {email, password} = formValues

    try {
      setIsFetching(true)
      const response = await login({email, password})
      if (!response.ok) {
        throw response
      }
      const {
        user: {role, username},
      } = await response.json()
      handleSuccessLogin({role, username})
    } catch (err) {
      const data = await err.json()
      setErrorMessage(data.message)
      setIsOpen(true)
    } finally {
      setIsFetching(false)
    }
  }

  const handleChange = ({target: {value, name}}) => {
    setFormValues({...formValues, [name]: value})
  }

  const handleBlurEmail = () => {
    if (!validateEmail(formValues.email)) {
      setEmailValidationMessage(
        'The email is invalid. Example: john.doe@mail.com',
      )
      return
    }

    setEmailValidationMessage('')
  }

  const handleBlurPassword = () => {
    if (!validatePassword(formValues.password)) {
      setPasswordValidationMessage(passwordValidationsMsg)
      return
    }

    setPasswordValidationMessage('')
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  if (!isFetching && user.role === ADMIN_ROLE) {
    return <Redirect to="/admin" />
  }

  if (!isFetching && user.role === EMPLOYEE_ROLE) {
    return <Redirect to="/employee" />
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login Page
        </Typography>
        {isFetching && <CircularProgress data-testid="loading-indicator" />}
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="email"
            id="email"
            name="email"
            helperText={emailValidationMessage}
            onChange={handleChange}
            onBlur={handleBlurEmail}
            value={formValues.email}
            error={!!emailValidationMessage}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="password"
            id="password"
            type="password"
            name="password"
            helperText={passwordValidationMessage}
            onChange={handleChange}
            onBlur={handleBlurPassword}
            value={formValues.password}
            error={!!passwordValidationMessage}
          />
          <Button
            type="submit"
            disabled={isFetching}
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Send
          </Button>
        </form>
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={isOpen}
          autoHideDuration={6000}
          onClose={handleClose}
          message={errorMessage}
        />
      </div>
    </Container>
  )
}

export default LoginPage
