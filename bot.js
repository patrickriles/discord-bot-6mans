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
//let queue = ['HazardX','Zwicker', 'JP', 'Ricky', 'Julian', 'arkin', 'Max', 'George'];

let queue = [];
let queueRandomized = [];
let remainingPlayers = [];
let orange = [];
let blue = [];
let orangeCaptain = '';
let blueCaptain = '';
let captainsPicked = false;
let orangePick = false;
let bluePick = false;
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    /**********************
     *   Print Functions  *
     **********************/
    function printRemainingPlayers() {
        let rp = '';
        for (let i = 0; i < remainingPlayers.length; i++){
            if (i === remainingPlayers.length - 1){
                rp += i+1 + '. ' + remainingPlayers[i];
            } else {
                rp += i+1 + '. ' + remainingPlayers[i] + ', ';
            }
        }
        return rp;
    }
    function printTeamsAndRemaining(){
        bot.sendMessage({
            to: channelID,
            message: '```Orange Team: ' + orange + '\n' +
                'Blue Team: ' + blue + '```' +
                'Remaining Players: `' + printRemainingPlayers() + '`'
        });
    }
    function printTeamsAndLeftOut(){
        bot.sendMessage({
            to: channelID,
            message: '```Orange Team: ' + orange + '\n' + 'Blue Team: ' + blue + '```' +
                'Players sitting out: `' + printRemainingPlayers() + '`'
        });
    }
    function printTeams(){
        bot.sendMessage({
            to: channelID,
            message: '```Orange Team: ' + orange + '\n' + 'Blue Team: ' + blue + '```'
        });
    }
    function printNotEnoughPlayers() {
        bot.sendMessage({
            to: channelID,
            message: 'Not enough players in the queue! (Only ' + queue.length + ')'
        });
    }
    /********************
     *  Team Functions  *
     ********************/
    function randomizeTeams(){
        if (queue.length >= 6){
            queueRandomized = util.randomize(queue);
            orange = queueRandomized.slice(0,3);
            blue = queueRandomized.slice(3,6);
            if (queueRandomized.length > 6){
                remainingPlayers = queueRandomized.slice(6, queueRandomized.length);
                printTeamsAndLeftOut();
            } else {
                printTeams();
            }
        } else {
            printNotEnoughPlayers();
        }
    }
    function makeCaptains() {
        if (queue.length >= 6){
            captainsPicked = true;
            queueRandomized = util.randomize(queue);
            orangeCaptain = queueRandomized[0];
            //orangeCaptain = 'HazardX';
            blueCaptain = queueRandomized[5];
            //blueCaptain = 'arkin';
            orange.push(orangeCaptain);
            blue.push(blueCaptain);
            remainingPlayers = queueRandomized.slice(1,5);
            if (remainingPlayers.length > 0){
                printTeamsAndRemaining();
            } else {
                printTeams();
            }
        } else {
            printNotEnoughPlayers();
        }
    }
    function makePicks() {
        if (orangePick && user === orangeCaptain){
            if ((args[1]) > 0 && (args[1] - 1) < remainingPlayers.length){
                orange.push(remainingPlayers[args[1] - 1]);
                remainingPlayers.splice(args[1] - 1,1);
                orangePick = false;
                bluePick = true;
            }
            if (remainingPlayers.length > 0){
                printTeamsAndRemaining();
            } else {
                printTeams();
            }
        }
        else if (bluePick && user === blueCaptain){
            if ((args[1]) > 0 && (args[1] - 1) < remainingPlayers.length){
                blue.push(remainingPlayers[args[1] - 1]);
                remainingPlayers.splice(args[1] - 1,1);
                orangePick = true;
                bluePick = false;
            }
            if (remainingPlayers.length > 0){
                printTeamsAndRemaining();
            } else {
                printTeams();
            }
        }
        else if (captainsPicked === false){
            bot.sendMessage({
                to: channelID,
                message: 'Captains have not been selected!'
            });
        } else {
            bot.sendMessage({
                to: channelID,
                message: 'You are not a captain or it is not your teams pick.'
            });
        }
    }
    function help() {
        bot.sendMessage({
            to: channelID,
            message:
                '!help: Shows commands\n' +
                '!join: Adds user into the queue to play\n' +
                '!leave: Removes user from the queue\n' +
                '!show: Displays all users currently in queue\n' +
                '!random: Makes random teams (Need 6 players)\n' +
                '!captains: Assigns two captains from the queue (Need 6 players)\n' +
                '!pick (number): Picks a player to a team if user is a captain\n' +
                '!teams: Shows teams'
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
                message: user + ' has been removed from the queue. Current queue: ' + queue
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
                message: user + ' has been added to the queue. Current queue: ' + queue
            });
        } else {
            bot.sendMessage({
                to: channelID,
                message: 'User is already in the queue!'
            });
        }
    }
    /********************
     *     Commands     *
     ********************/
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
                orangePick = true;
                break;
            case 'clear':
                queue = [];
                clear();
                break;
            case 'pick':
                makePicks();
                break;
            case 'teams':
                printTeams();
                break;
         }
     }
});