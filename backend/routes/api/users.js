const express = require('express')
const router = express.Router();

fetch('/api/session', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "XSRF-TOKEN": `<value of XSRF-TOKEN cookie>`
    },
    body: JSON.stringify({ credential: 'Demo-lition', password: 'password' })
  }).then(res => res.json()).then(data => console.log(data));

  fetch('/api/session', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "XSRF-TOKEN": `<value of XSRF-TOKEN cookie>`
    },
    body: JSON.stringify({ credential: 'demo@user.io', password: 'password' })
  }).then(res => res.json()).then(data => console.log(data));

  fetch('/api/session', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "XSRF-TOKEN": `<value of XSRF-TOKEN cookie>`
    },
    body: JSON.stringify({ credential: 'Demo-lition', password: 'Hello World!' })
  }).then(res => res.json()).then(data => console.log(data));

module.exports = router;