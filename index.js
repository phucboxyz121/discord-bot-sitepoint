require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;

bot.login(TOKEN);

const http = require('http');
var users = [];

http.createServer(function (req, res) {
  res.write(JSON.stringify(users));
  res.end();
}).listen(3000);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
  console.log('Go to http://localhost:3000');
});

bot.on('error', err => {
  console.error(err);
})

bot.on('disconnect', bot => {
  console.error('disconnect')
});

bot.on('message', msg => {
  if (msg.author.username !== bot.user.username) {
    let index = users.findIndex(x => x.id == msg.channel.id);
    if (index == -1) {
      let chanel = {
        id: msg.channel.id,
        name: msg.channel.name,
        member: []
      }

      /** send msg to member */
      const members = msg.client.users;
      let msgResponse = "Hello ";
      members.forEach(element => {
        if (!element.bot) {
          chanel.member.push({
            user: element.username,
            status: element.presence.status
          });
          users.push(chanel);
          msgResponse += element.username + '(' + element.presence.status + ') ';
        }
      });

      msg.channel.send(msgResponse);
    }
  }
});

