export const login = ({email, password}) =>
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({email, password}),
  })

export default {login}
