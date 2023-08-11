import { useState, useEffect, useRef } from 'react'
import './App.css'
import { FcCheckmark } from 'react-icons/fc'
import { RxCross2 } from 'react-icons/rx'
import { FaInfoCircle } from 'react-icons/fa'

import axios from './api/axios'

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

//endpoint for registration in the backend api
// REGISTER_URL = '/register'

function App() {

  const [user, setUser] = useState('')
  const [validName, setValidName] = useState(false)
  const [userFocus, setUserFocus] = useState(false)

  const [pwd, setPwd] = useState('')
  const [validPwd, setValidpwd] = useState(false)
  const [pwdFocus, setPwdFocus] = useState(false)

  const [matchPwd, setMatchpwd] = useState('')
  const [validMatch, setValidMatch] = useState(false)
  const [matchFocus, setMatchFocus] = useState(false)

  const [errMsg, setErrMsg] = useState('')
  const [success, setSuccess] = useState(false)

  const userRef = useRef()
  const errRef = useRef()

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    setValidName(USER_REGEX.test(user))
  }, [user])

  useEffect(() => {
    setValidpwd(PWD_REGEX.test(pwd))
    setValidMatch(pwd === matchPwd)
  }, [pwd, matchPwd])


  async function handleSubmit(event) {
    event.preventDefault()
    //if button enabled with js hack
    const v1 = USER_REGEX.test(user)
    const v2 = PWD_REGEX.test(pwd)
    if(!v1 || !v2) {
      setErrMsg("Invalid Entry")
      return 
    }
   
    try {
      //not typing the entire url as it will append base url
      const response = await axios.post(REGISTER_URL, 
        //payload = data that we are sending 
        //backend is expecting user & pwd property as protery:key are same => just sending destructured {user:user, pwd}
        JSON.stringify({user, pwd}), 
      {
        headers: {'content-type': 'application/json'},
        withCredentials: true
      }
    )
    //response.data => we get from axios
    console.log(JSON.stringify(response)) // if not we get object object
    console.log(response?.data)
    console.log(response?.accessToken)
    setSuccess(true)
    //clear input fields
    setUser('')
    setPwd('')
    setMatchpwd('')
    } catch(err) {
      if(!err?.response) { //if there is such thing as error check for .response 
        setErrMsg("No server response")
      }else if(err.response.status === 409) {
          setErrMsg('user taken')
      }else {
        setErrMsg('registration failed')
      }
      errRef.current.focus()
    }
  }

  return (
    <>
      {
        success ? (
          <section>
            <h1>Success</h1>
            <p><a>Sign in</a></p>
          </section>
        ) : (
        <div className='App'>
          <section>
            <p className={errMsg ? 'errmsg' : 'offscreen'} ref={errRef}>{errMsg}</p>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
              <label htmlFor='username'>
                Username:
                <FcCheckmark className={validName ? 'valid' : 'hide'} />
                  <RxCross2 color='red' className={!user || validName ? 'hide' : 'valid'} />
              </label>
              <input 
                type='text'
                required
                autoComplete='off'
                value={user}
                onChange={(e) => setUser(e.target.value)}
                // onFocus={() => setUserFocus(true)}
                ref={userRef}
                id='username'
              />
              <p className={user && !validName ? 'instructions' : 'offscreen'}>
                <FaInfoCircle size={16} style={{marginRight: '10px'}} />
                4 to 24 characters. <br />
                Must begin with a letter. <br />
                Letters, numbers, underscores, hyphens allowed.
              </p>
            

              <label htmlFor='password'>
                Password:
                <FcCheckmark className={validPwd ? 'valid' : 'hide'} />
                <RxCross2 color='red' className={validPwd || !pwd ? 'hide' : 'valid'}  />
              </label>
              <input 
                type='password'
                id='password'
                required
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
              />

              <p className={pwd && !validPwd ? 'instructions' : 'offscreen'}>
                <FaInfoCircle size={16} style={{marginRight: '10px'}} />
                8 to 24 characters. <br />
                Must include uppercase and lowercase letters, a number and a special character.
              </p>

              <label htmlFor='match_pwd'>
                Confirm password: 
                <FcCheckmark className={validMatch && matchPwd ? 'valid' : 'hide'} />
                <RxCross2 color='red' className={validMatch || !matchPwd ? 'hide' : 'valid'}  />
              </label>
              <input 
                type='password'
                id='match_pwd'
                required
                value={matchPwd}
                onChange={(e) => setMatchpwd(e.target.value)}
              />
              <button disabled={!validName || !validPwd || !validMatch ? true : false}>Sign Up</button>
            </form>
          </section>
        </div>
        )
      }
    </>
    
  )
  
}

export default App
