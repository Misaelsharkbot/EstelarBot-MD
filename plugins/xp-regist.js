const { createHash } = require('crypto')
let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i
let handler = async function (m, { text, usedPrefix }) {
  let user = global.db.data.users[m.sender]
  if (user.registered === true) throw `Ya estás registrado \n¿Quieres volver a registrarte? ${usedPrefix}unreg <SN|Numero de serie>`
  if (!Reg.test(text)) throw `Formato erróneo\n*${usedPrefix}reg nombre.edad*`
  let [_, name, splitter, age] = text.match(Reg)
  if (!name) throw 'El nombre no puede estar vacío (apodo)'
  if (!age) throw 'La edad no puede estar vacía (Número)'
  age = parseInt(age)
  if (age > 120) throw 'Estas muy viejo 😂'
  if (age < 5) throw 'Los bebes pueden escribir ._.'
  user.name = name.trim()
  user.age = age
  user.regTime = + new Date
  user.registered = true
  let sn = createHash('md5').update(m.sender).digest('hex')
  m.reply(`
Daftar berhasil!

╭─「 Info 」
│ Nombre: ${name}
│ Edad: ${age} años 
╰────
Numero de Serie: 
${sn}
`.trim())
}
handler.help = ['reg', 'register'].map(v => v + ' <nombre>.<edad>')
handler.tags = ['xp']

handler.command = /^(rg|reg(ister)?)$/i

module.exports = handler
