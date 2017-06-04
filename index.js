'use strict'

const crypto = require('crypto')
const spawn = require('child_process').spawn

// create a local account by invoking some ruby code, as in the
// admin guide.  Complete and utter hack.
function create_local_account (username, email, pw) {
  return new Promise( (resolve, reject) => {
    if (!pw) pw = crypto.randomBytes(12).toString('base64')
    const options = {
      cwd: '/home/mastodon/live',  // not working :-(
      // use sudo instead of uid, so we can be running as someone
      // who has permission to sudo -u mastodon.
      env: { 'RAILS_ENV': 'production' },
      shell: true
    }
    let buf = ''
    const child = spawn('sudo', ['-E', '-u', 'mastodon', '/home/mastodon/.rbenv/shims/bundle', 'exec', 'rails', 'c'], options)
    child.stdout.on('data', (data) => {
      // console.log('stdout:', data.toString('utf8'))
      buf += data.toString('utf8')
    })
    child.stdout.on('end', () => {
      // console.log('DONE')
      if (buf.match(/Username has already been taken/)) {
        console.log('username taken')
        reject('username taken')
      } else if (buf.match(/Email has already been taken/)) {
        console.log('email taken')
        reject('email taken')
      } else if (buf.match(/Enqueued ActionMailer::DeliveryJob/)) {
        const m = buf.match(/Account id: (\d+), username: /)
        const id = parseInt(m[1])
        console.log('success, I think')
        resolve({
          username, email, pw, id
        })
      } else {
        console.log(buf)
        reject('unknown error')
      }
    })
    child.stderr.on('data', (data) => {
      console.log('stderr:', data.toString('utf8'))
    })
    child.stdin.write(`account = Account.create!(username: '${username}')\n`)
    child.stdin.write(`user = User.create!(email: '${email}', password: '${pw}', account: account)\n`)
    child.stdin.write(`user.confirm\n`)
    child.stdin.write(`account.save!\n`)
    child.stdin.write(`user.save!\n`)
    child.stdin.end()
  })
}

/*
create_local_account('test_5', 'sandro+test_5@w3.org')
  .then(data => {
    console.log(data)
  })
*/

module.exports.create_local_account = create_local_account
