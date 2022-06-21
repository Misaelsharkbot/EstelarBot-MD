const { default: makeWASocket, BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, downloadContentFromMessage, downloadHistory, proto, getMessage, generateWAMessageContent, prepareWAMessageMedia } = require('@adiwajshing/baileys')
const { servers, yta, ytv } = require('../lib/y2mate')
let fs = require('fs')
let yts = require('yt-search')
let fetch = require('node-fetch')
let handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) throw `uhm.. ¿qué estás buscando?\n\nejemplo:\n${usedPrefix + command} california`
  let chat = global.db.data.chats[m.chat]
  let results = await yts(text)
  let vid = results.all.find(video => video.seconds < 3600)
  if (!vid) throw 'Contenido no encontrado'
  let isVideo = /2$/.test(command)
  let yt = false
  let yt2 = false
  let usedServer = servers[0]
  for (let i in servers) {
    let server = servers[i]
    try {
      yt = await yta(vid.url, server)
      yt2 = await ytv(vid.url, server)
      usedServer = server
      break
    } catch (e) {
      m.reply(`Server ${server} error!${servers.length >= i + 1 ? '' : '\nprobando con otro servidor...'}`)
    }
  }
  if (yt === false) throw 'todos los servidores fallan'
  if (yt2 === false) throw 'todos los servidores fallan'
  let { dl_link, thumb, title, filesize, filesizeF } = yt
let anu =  `
*Titulo:* ${title}
*Peso en Audio:* ${filesizeF}
*Peso en Video:* ${yt2.filesizeF}
*Servidor y2mate:* ${usedServer}
*Link:* 
${vid.url}

`
     let message = await prepareWAMessageMedia({ image: await (await require('node-fetch')(thumb)).buffer()}, { upload: conn.waUploadToServer }) 
      const template = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
      templateMessage: {
          hydratedTemplate: {
            imageMessage: message.imageMessage, 
            hydratedContentText: anu,
            hydratedFooterText: wm, 
            hydratedButtons: [{
             urlButton: {
               displayText: 'Join Here',
               url: gc
             }

           },
               {
             quickReplyButton: {
               displayText: 'Video 360p',
               id: `.ytmp4 ${vid.url}`,
             }

            },
               {
             quickReplyButton: {
               displayText: 'Video 720p',
               id: `.ytv720 ${vid.url}`,
             }

            },
               {
             quickReplyButton: {
               displayText: 'Audio',
               id: `.ytmp3 ${vid.url}`,
             }

           }]
         }
       }
     }), { userJid: m.sender, quoted: m });
    //conn.reply(m.chat, text.trim(), m)
    return await conn.relayMessage(
         m.chat,
         template.message,
         { messageId: template.key.id }
     )
}
handler.help = ['play'].map(v => v + ' <pencarian>')
handler.tags = ['downloader']
handler.command = /^(p|play)$/i

handler.exp = 0

module.exports = handler

