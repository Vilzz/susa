import axios from 'axios'
import { setAlert } from './alert'
import { REGISTER_SUCCESS, REGISTER_FAIL } from './types'
import setAuthToken from '../utils/setAuthToken'

export const register = ({ name, email, password }) => async (dispatch) => {
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
