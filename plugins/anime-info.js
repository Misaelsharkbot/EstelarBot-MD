let fetch = require('node-fetch')
let handler = async(m, { conn, text }) => {
  if (!text) throw `Masukkan query!`
  let res = await fetch(global.API('https://api.jikan.moe', '/v3/search/anime', { q: text }))
  if (!res.ok) throw await res.text()
  let json = await res.json()
  let { title, members, synopsis, episodes, url, rated, score, image_url, type, start_date, end_date } = json.results[0]
let animeingfo = `✨️ *Titulo:* ${title}
🎆️ *Episodios:* ${episodes}
➡️ *Fecha de inicio:* ${start_date}
🔚 *Fecha finalizacion:* ${end_date}
💬 *Show Type:* ${type}
💌️ *Rating:* ${rated}
❤️ *Score:* ${score}
👥 *Miembros:* ${members}
💚️ *Synopsis:* ${synopsis}
🌐️ *URL*: ${url}`
  conn.sendFile(m.chat, image_url, '', animeingfo, m)
}
handler.help = ['anime <nombre>']
handler.tags = ['anime']
handler.command = /^(anime|animeinfo)$/i
//maapin fatur :<
module.exports = handler
