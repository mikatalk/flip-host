const fs = require('fs')
const pkg = require(__dirname + '/package.json')
const prompts = require('prompts')
const websites = pkg.websites

async function start() {
  
  const hostFile = fs.readFileSync('/etc/hosts', 'utf8')
  let head = hostFile.match(/(.*)(?:# BEGIN hosts added by flip-host)/s)
  const body = hostFile.match(/(?:# BEGIN hosts added by flip-host)(.*)(?:# END hosts added by flip-host)/s)
  const tail = hostFile.match(/(?:# END hosts added by flip-host)(.*)/s)

  if (body) {
    console.log(
      '- - - - - - - - - - - - - - - - - - - - - -\n' +
      '-               MANAGED HOSTS             -\n' +
      '- - - - - - - - - - - - - - - - - - - - - -' + 
      body[1] + 
      '- - - - - - - - - - - - - - - - - - - - - -'
    )
  } else {
    console.log('Oh, hello (first time user)')
    // original content moves to the head
    head = ['', hostFile]
  }

  let response = await prompts({
    type: 'select',
    name: 'value',
    message: 'Pick a website',
    choices: websites.map(el => ({title: el, value: el})),
    initial: Math.max(0, Math.min(websites.length-1, (pkg.settings['last-selected'] || 0)))
  })
  const website = response.value

  // save last choice
  pkg.settings['last-selected'] = Math.max(0, Math.min(websites.length-1, websites.indexOf(website)))
  fs.writeFileSync(__dirname + '/package.json', JSON.stringify(pkg, null, 2))

  response = await prompts({
    type: 'select',
    name: 'value',
    message: 'Pick a environment',
    choices: pkg.ips,
    initial: 0
  })
  const server = response.value

  if (!website || !server) {
    console.log('Not this time... Bye bye...')
    return
  }
  
  console.log(`Set host for '${website}' to '${server}'`)

  fs.writeFileSync('/etc/hosts', (head ? head[1] : '') +
  '# BEGIN hosts added by flip-host' +
  '\n' + (body ? body[1] : '').split('\n').filter(val => val.indexOf(website) === -1 && val !== '').join('\n') +
  '\n' + server + '\t' + website + '\n' + 
  '# END hosts added by flip-host' +
  (tail ? ('\n' + tail[1]) : '\n'))
}

start()
