# flip-host
Utility to quickly modify hosts file

### Important
This script was tested on MacOS only, use at your own risk. 
Also please consider backing up `/etc/hosts` file before use.

### Config
Modify `package.json`

Update environments info:
```
"ips": [
  {
    "title": "local",
    "value": "127.0.0.1"
  },
  {
    "title": "staging",
    "value": "90.678.45.1234"
  },
  {
    "title": "production",
    "value": "12.345.678.90"
  }
]
```

Update your website list:
```
"websites": [
  "www.my-cool-site.com",
  "www.some-project.io",
  "and.so.on"
]
```

### Usage
```
# install deps
npm i
# run with npm:
npm start
# run with node
sudo node index.js
```
