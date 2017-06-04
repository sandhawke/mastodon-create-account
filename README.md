Create a mastodon user account when you're on the local server.

It's a slow kludge at the moment.

## Command Line

```sh
# npm install -g mastodon-create-account
# mastodon-create-account test7 sandro+test7@example.org
success, I think
account-details-test7.json written
# cat account-details-test7.json
{
  "username": "test7",
  "email": "sandro+test7@example.org",
  "pw": "/aasdfasdfasdfhiEH",
  "id": 680
}
```

## Library

```sh
$ npm install --save mastodon-create-account
```

```js
const acct = require('mastodon-create-account')

acct.create_local_account('test7', 'sandro+test7@example.org')
  .then(data => {
     // use data.pw, etc...
  })
```

## Permissions

Works as root or someone who can sudo to the mastodon user.

For example, if you want to run this as user `botmaster`, put this in /etc/sudoers:

`botmaster ALL = (mastodon) ALL`

## It's slow

Calls the ruby code on a pipe.  Crazy, I know.

Slow because of how ruby bundle works.  I bet with a tiny bit of ruby knowledge it could be made fast, by like saving the bundle or something.



