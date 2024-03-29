import axios from 'axios'
import { setAlert } from './alert'
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOG_OUT,
} from './types'
import setAuthToken from '../utils/setAuthToken'

export const logout = () => (dispatch) => {
  dispatch({ type: LOG_OUT })
}

export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token)
    try {
      const res = await axios.get('/api/v1/auth/me')
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      })
    } catch (err) {
      dispatch({
        type: AUTH_ERROR,
      })
    }
  } else {
    dispatch({
      type: AUTH_ERROR,
    })
  }
}

export const login = (data) => async (dispatch) => {
  //const { email, password } = data
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  //const body = JSON.stringify({ email, password })
  //console.log(body)
  try {
    const res = await axios.post('/api/v1/auth/login', data, config)

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    })
    dispatch(loadUser())
  } catch (err) {
    const errors = err.response.data.error.split(',')
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error, 'danger')))
    }
    dispatch({ type: LOGIN_FAIL })
  }
}

export const register = ({ name, email, password }, history) => async (
  dispatch
) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const body = JSON.stringify({ name, email, password })
  try {
    const res = await axios.post('/api/v1/auth/register', body, config)
    dispatch({
      type: REGISTER_SUCCESS,
      payload: {
        token: res.data.token,
        isAuthenticated: res.data.isAuthenticated,
        success: res.data.success,
      },
    })
    dispatch(loadUser())
    dispatch(
      setAlert(`Пользователь ${name} успешно зарегистрирован`, 'success')
    )
    history.push('/userdashboard')
  } catch (err) {
    const errors = err.response.data.error.split(',')
    if (errors) {
    }
    errors.forEach((error) => dispatch(setAlert(error, 'danger', 2000)))
  }
  dispatch({
    type: REGISTER_FAIL,
  })
}
