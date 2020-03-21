/**
 *
 * @type {Discord}
 * Title: 6Mans Bot
 * Created by: patrickriles
 * Date: 2020/03/20
 * Email: patrickriles@hotmail.com
 */

var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
//Test Queue
let queue = ['Zwicker', 'JP', 'Bobby', 'Ricky', 'Julian', 'Bubbles'];
//let queue = [];
let queueRandomized = [];
let remainingPlayers = [];
let orange = [];
let blue = [];
let captains = false;
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    function remove(arr) {
        var what, a = arguments, L = a.length, ax;
        while (L > 1 && arr.length) {
            what = a[--L];
            while ((ax= arr.indexOf(what)) !== -1) {
                arr.splice(ax, 1);
            }
        }
        return arr;
    }

    // This is Durstenfeld shuffle, an optimized version of Fisher-Yates shuffle algorithm
    function randomize(arr) {
        let tempArr = arr;
        for (var i = tempArr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = tempArr[i];
            tempArr[i] = tempArr[j];
            tempArr[j] = temp;
        }
        return tempArr;
    }

    if (message.substring(0, 1) === '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        switch(cmd) {
            case 'help':
                bot.sendMessage({
                    to: channelID,
                    message: '!join: Adds user into the queue to play\n' +
                             '!leave: Removes user from the queue\n' +
                             '!show: Displays all users currently in queue\n' +
                             '!random: Makes random teams (Need 6 players)\n' +
                             '!captains: Assigns two captains from the queue (Need 6 players)'
                });
                break;
            case 'join':
                if (!queue.includes(user) && queue.length <= 6){
                    queue.push(user);
                    bot.sendMessage({
                        to: channelID,
                        message: user + ' has been added to queue. Current queue: ' + queue
                    });
                } else {
                    bot.sendMessage({
                        to: channelID,
                        message: 'User is already in queue!'
                    });
                }
                break;
            case 'leave':
                if (queue.includes(user)){
                    remove(queue, user);
                    bot.sendMessage({
                        to: channelID,
                        message: user + ' has been removed from queue. Current queue: ' + queue
                    });
                } else {
                    bot.sendMessage({
                        to: channelID,
                        message: 'User is not in queue!'
                    });
                }
                break;
            case 'show':
                if (queue.length > 0){
                    bot.sendMessage({
                        to: channelID,
                        message: 'Current Queue: ' + queue
                    });
                } else {
                    bot.sendMessage({
                        to: channelID,
                        message: 'Queue is empty!'
                    });
                }
                break;
            case 'random':
                orange = [];
                blue = [];
                queueRandomized = [];
                if (queue.length === 6){
                    queueRandomized = randomize(queue);
                    orange = queueRandomized.slice(0,3);
                    blue = queueRandomized.slice(3,6);
                    bot.sendMessage({
                        to: channelID,
                        message: '```Orange Team: ' + orange + '\n' + 'Blue Team: ' + blue + '```'
                    });
                } else {
                    bot.sendMessage({
                        to: channelID,
                        message: 'Not enough players in queue! (Only ' + queue.length + ')'
                    });
                }
                break;
            case 'captains':
                let orangeCaptain = '';
                let blueCaptain = '';
                orange = [];
                blue = [];
                remainingPlayers = [];
                queueRandomized = [];
                if (queue.length === 6){
                    captains = true;
                    queueRandomized = randomize(queue);
                    orangeCaptain = queueRandomized[0];
                    blueCaptain = queueRandomized[5];
                    remainingPlayers = queueRandomized.slice(1,5);
                    bot.sendMessage({
                        to: channelID,
                        message: '```Orange Captain: ' + orangeCaptain + '\n' +
                            'Blue Captain: ' + blueCaptain + '```' +
                            '```Remaining Players: ' + '\n' +
                            remainingPlayers[0] + '\n' +
                            remainingPlayers[1] + '\n' +
                            remainingPlayers[2] + '\n' +
                            remainingPlayers[3] + '```'
                    });
                }
                break;
         }
     }
});