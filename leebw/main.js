// dotenv 사용 예시
import dotenv from 'dotenv';
import { base_url, api_key, user_name, admin_email } from './db.js';
dotenv.config();
window.localStorage.clear()
// console.log('BASE_URL:', process.env.BASE_URL);
// console.log('API_KEY:', process.env.API_KEY);
// console.log('USER_NAME:', process.env.USER_NAME);
// console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);

// console.log({ base_url, api_key, user_name, admin_email });

// id가 뭘까 "OlyevGkhhbGU03iJxw5f"

const headers = {
  'content-type': 'application/json',
  'apikey': api_key,
  'username': user_name
}

const btnGetList = document.querySelector('.getlist')
const btnCreateAccount = document.querySelector('.createAccount') 
const temporaryEl = document.querySelector('.temporary')
const divAccountNumber = document.querySelector('.accountNumber')
const divPhoneNumber = document.querySelector('.phoneNumber')
btnGetList.textContent = '은행 목록 가져오기'
const signature = true


btnGetList.addEventListener('click', async () => {
  await getUserAccounts()
  const bankList = await getBankList()
  console.log(bankList)
  createBankAccountList(bankList)
  temporaryEl.style.display = 'none'
  btnCreateAccount.style.display = 'block'
  createBankAccountInputs()
  
})

btnCreateAccount.addEventListener('click', async () => {
  const bankCode = getSelectBank()
  console.log(bankCode, document.querySelector('.input-account').value,document.querySelector('.input-phone').value)
  const res = await fetch(`${base_url}/account`, {
    method: 'POST',
    headers: {
      ...headers,
      Authorization: `Bearer ${window.localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      bankCode: bankCode,
      accountNumber: document.querySelector('.input-account').value,
      phoneNumber: document.querySelector('.input-phone').value,
      signature: true
    })
  })
  const json = await res.json()
  console.log(json)
})

const getBankList = async () => {
  console.log('Get Bank List!', `Bearer ${window.localStorage.getItem('token')}`)
  const res = await fetch(`${base_url}/account/banks`, {
    method: 'GET',
    headers: {
      ...headers,
      Authorization: `Bearer ${window.localStorage.getItem('token')}`
    }
  })
  const json = await res.json()

  return json
}

const createBankAccountList = (data) => {
  const ulEl = document.querySelector('ul')
  const liEls = data.map(_data => {
    const liEl = document.createElement('li')
    liEl.innerHTML = /* html */ `
    <input type="radio" name="bank" class="selectBank">
    ${_data.name}, ${_data.code}, [${_data.digits}], ${_data.disabled}
    `
    liEl.dataset.id = _data.code


    return liEl
  })
  ulEl.append(...liEls)

}

const createBankAccountInputs = () => {
  // 계좌번호
  const span = document.createElement('span')
  span.innerText = '계좌번호'
  const inputAccount = document.createElement('input')
  inputAccount.classList.add('input-account')
  divAccountNumber.append(span)
  divAccountNumber.append(inputAccount)

  // 핸드폰 번호
  const span2 = document.createElement('span')
  span2.innerText = '핸드폰번호'
  const inputAccount2 = document.createElement('input')
  inputAccount2.classList.add('input-phone')
  divPhoneNumber.append(span2)
  divPhoneNumber.append(inputAccount2)
}

const getSelectBank = () => {
  const checkBoxs = document.querySelectorAll('.selectBank')
  const bchecked = Array.from(checkBoxs).every(x => x.checked === false)
  
  if(bchecked === true){
    alert('Check')
    return
  }
  else{
    const liEl = Array.from(checkBoxs).find(x => x.checked === true).parentElement
    return liEl.dataset.id
  }  
}

const getUserAccounts = async () => {
  const res = await fetch(`${base_url}/account`, {
    method: 'GET',
    headers: {
      ...headers,
      Authorization: `Bearer ${window.localStorage.getItem('token')}`
    }
  })
  const json = await res.json()
  console.log(json)
}










// const 

// 엑세스 토큰때문에 임시..
const idEl = document.querySelector('.id')
const passwordEl = document.querySelector('.password')
const displayNameEl = document.querySelector('.display-name')
const submitEl = document.querySelector('.signup')
const authorizationEl = document.querySelector('.authorization')
const loginEl = document.querySelector('.login')

let id = ''
let pw = ''
let displayName = ''

idEl.addEventListener('input', event => {
  id = event.target.value
})
passwordEl.addEventListener('input', event => {
  pw = event.target.value
})
displayNameEl.addEventListener('input', event => {
  displayName = event.target.value
})
submitEl.addEventListener('click', () => {
  console.log(id, pw, displayName)
  request({
    url: 'https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/signup',
    method: 'POST',
    data: {
      email: id,
      password: pw,
      displayName: displayName,
    }
  })
})
authorizationEl.addEventListener('click', async () => {
  request({
    url: 'https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/me',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      masterKey: true
    }
  })
})
loginEl.addEventListener('click', () => {
  request({
    url: 'https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/login',
    method: 'POST',
    data: {
      email: id,
      password: pw
    }
  })
})

async function request(options) {
  const defaultOptions = {
    method: 'GET',
    headers: {
      "content-type": "application/json",
      "apikey": "FcKdtJs202301",
      "username": user_name
    }
  }
  const headers = options.headers || {}
  const res = await fetch(options.url, {
    method: options.method || defaultOptions.method,
    headers: {
      ...defaultOptions.headers,
      ...headers
    },
    body: options.data
      ? JSON.stringify(options.data)
      : undefined
  })
  const json = await res.json()
  console.log(json)
  window.localStorage.setItem('token', json.accessToken)
}