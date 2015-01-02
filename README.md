#Brute forcing Wordpress usernames and passwords.
How strong is your Wordpress?

Wordpress is great software. But like all great software, unfortunately,
it has a few short falls which can be amplified by inexperienced users.

By default, and as of writing this, Wordpress 4.1 does not have any built-in
mechanism to counter or block brute force login attempts. Further to this issue,
it's extremely easy to brute force an active username from Wordpress.

For the majority of the developer community, this is no issue, as they have the
necessary knowledge and skills to protect themselves from such an attack. However,
professionally, I have noticed that a lot of "content administrators" who lack
web development skills, have no idea about the risks involved.

I wrote HSIYWP purely to showcase to people I work with, how important it is to
ensure they have a secure login, and to have their Wordpress site hardened.

##Using your common sense
Use your common sense with this app. Don't execute it against a server / setup
that you don't explicity own - it's more than likely illegal in your Country.

##Installing and running

I haven't tried running this on anything other than Linux, but with the correct
nodeJS install, it should run anywhere compatible.

```
git clone https://github.com/isdampe/How-strong-is-your-Wordpress-.git
cd How-strong-is-your-Wordpress-
npm install request fs
chmod +x hsiywp.js
./hsiywp.js
```
