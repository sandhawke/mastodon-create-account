Create a mastodon user account when you're on the local server as a
user who can sudo to the mastodon login.

Like if this will be running as user botmaster, /etc/sudoers should have:

`botmaster ALL = (mastodon) ALL`

Calls the ruby code on a pipe.  Crazy, I know.

Slow because of how ruby bundle works.  I bet with a tiny bit of ruby knowledge it could be made fast, by like saving the bundle or something.



