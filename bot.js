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
var util = require('./util');
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
//let queue = ['Zwicker', 'JP', 'Bobby', 'Ricky', 'Julian', 'Bubbles', 'Max', 'George'];

let queue = [];
let queueRandomized = [];
let remainingPlayers = [];
let orange = [];
let blue = [];
let orangeCaptain = '';
let blueCaptain = '';
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    function randomizeTeams(){
        if (queue.length >= 6){
            queueRandomized = util.randomize(queue);
            orange = queueRandomized.slice(0,3);
            blue = queueRandomized.slice(3,6);
            if (queueRandomized.length > 6){
                remainingPlayers = queueRandomized.slice(6, queueRandomized.length);
                bot.sendMessage({
                    to: channelID,
                    message: '```Orange Team: ' + orange + '\n' + 'Blue Team: ' + blue + '```' +
                        'Players sitting out: `' + remainingPlayers + '`'
                });
            } else {
                bot.sendMessage({
                    to: channelID,
                    message: '```Orange Team: ' + orange + '\n' + 'Blue Team: ' + blue + '```'
                });
            }
        } else {
            bot.sendMessage({
                to: channelID,
                message: 'Not enough players in queue! (Only ' + queue.length + ')'
            });
        }
    }
    function makeCaptains() {
        if (queue.length >= 6){
            queueRandomized = util.randomize(queue);
            orangeCaptain = queueRandomized[0];
            blueCaptain = queueRandomized[5];
            remainingPlayers = queueRandomized.slice(1,5);
            bot.sendMessage({
                to: channelID,
                message: '```Orange Captain: ' + orangeCaptain + '\n' +
                    'Blue Captain: ' + blueCaptain + '```' +
                    'Remaining Players: `' + remainingPlayers + '`'
            });
        }
    }
    function help() {
        bot.sendMessage({
            to: channelID,
            message: '!join: Adds user into the queue to play\n' +
                '!leave: Removes user from the queue\n' +
                '!show: Displays all users currently in queue\n' +
                '!random: Makes random teams (Need 6 players)\n' +
                '!captains: Assigns two captains from the queue (Need 6 players)'
        });
    }
    function clear() {
        bot.sendMessage({
            to: channelID,
            message: 'Queue has been cleared.'
        });
    }
    function show() {
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
    }
    function leave(){
        if (queue.includes(user)){
            util.remove(queue, user);
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
    }
    function join() {
        if (!queue.includes(user)){
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
    }


    if (message.substring(0, 1) === '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        switch(cmd) {
            case 'help':
                help();
                break;
            case 'join':
                join();
                break;
            case 'leave':
                leave();
                break;
            case 'show':
                show();
                break;
            case 'random':
                orange = [];
                blue = [];
                queueRandomized = [];
                remainingPlayers = [];
                randomizeTeams();
                break;
            case 'captains':
                orangeCaptain = '';
                blueCaptain = '';
                orange = [];
                blue = [];
                remainingPlayers = [];
                queueRandomized = [];
                makeCaptains();
                break;
            case 'clear':
                queue = [];
                clear();
                break;
         }
     }
});