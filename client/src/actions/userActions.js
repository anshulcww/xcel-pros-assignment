import { NEW_USER, FETCH_USERS } from './types';
// import history from './history';
import axios from 'axios';
import history from '../history';
let baseUrl = 'http://localhost:5000'

// Delete User
export const deleteUser = (userId) => async dispatch => {
  let token = localStorage.getItem('token');
  console.log(token)
  return await axios.delete(baseUrl + '/user/' + userId,  { 'headers': { 'Authorization': token } })
    .then((res) => {
      if (res.status === 201 && res.data.success) {
          console.log(res.data, 'datatsdak')
          dispatch(getUsers())
          history.push('/')
        }
    })
    .catch((error) => {
      console.log(error)
    })
}



// Edit User Details
export const editUser = (userdet) => async dispatch => {
  let token = localStorage.getItem('token');
  console.log(token)
  return await axios.put(baseUrl + '/user/edit_user', userdet, { 'headers': { 'Authorization': token } })
    .then((res) => {
      if (res.status === 201 && res.data.success) {
          console.log(res.data, 'datatsdak')
          dispatch(getUsers())
          history.push('/')
        }
    })
    .catch((error) => {
      console.log(error)
    })
}


//Get All Registered Users
export const getUsers = () => async dispatch => {
    let token = localStorage.getItem('token');
    return await axios.get(baseUrl + '/user/users', { 'headers': { 'Authorization': token } })
      .then((res) => {
        if (res.status === 201 && res.data.success) {
            //console.log(res.data.users)
          dispatch({
              type : FETCH_USERS,
              payload : res.data.users
          })
        }
      })
  }


// Registration function
export const createUser = userData => async dispatch => {
    console.log(userData, "login data")
    return await axios.post(baseUrl + '/user/register', userData)
      .then(res => {
        //console.log(res.data.success , 'data')
        if (res.data.success === true) {
            console.log('anshul registered')
          dispatch({
            type: NEW_USER,
            payload: res.data.user
          })
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('userId', res.data.user._id)
          history.push('/');
        }
      }
      )
      .catch((e) => {
        alert('Invalid authentication')
      })
  
  };

 // Login Function 
export const createLogin = loginData => async dispatch => {
    console.log(loginData, "login data")
    return await axios.post(baseUrl + '/user/login', loginData)
      .then(res => {
        //console.log(res.data.success , 'data')
        if (res.data.success === true) {
          dispatch({
            type: NEW_USER,
            payload: res.data.user
          })
          let name =  res.data.user.firstName ? res.data.user.firstName : 'Hello'
          console.log(name)
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('userId', res.data.user._id)
          localStorage.setItem('userName', name)
          history.push('/');
          localStorage.setItem('loginTime', Date.now())
          setTimeout(() => {
            console.log('anshul')
            dispatch(logout())
          }, 60000)
        }
      }
      )
      .catch((e) => {
        alert('Invalid authentication')
        
      })
  
  };

  export const logout = () => async dispatch => {
    let token = localStorage.getItem('token');
    console.log(token, 'token')
    return axios.post(baseUrl + '/user/logout', "", { headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" } })
      .then((response) => {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.setItem('loginTime', Date.now())
        history.push('/login')
        window.onpopstate = (url) => {
          console.log(url)
          let token = localStorage.getItem('token');
          if (!token) {
            history.push('/login')
          }
        }
      })
      .catch(error => {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.setItem('loginTime', Date.now())
        history.push('/login')
        window.onpopstate = (url) => {
          console.log(url)
          let token = localStorage.getItem('token');
          if (!token) {
            history.push('/')
          }
        }
        console.log(error, 'error')
      })
  }