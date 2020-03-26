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
var auth = require('../auth.json');
var util = require('./util');
var print = require('./print');
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
let snake = false;
let linear = true;
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
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
                print.printTeamsAndLeftOut(bot, channelID, blue, orange, remainingPlayers);
            } else {
                print.printTeams(bot, channelID, blue, orange);
            }
        } else {
            print.printNotEnoughPlayers(bot,channelID,queue);
        }
    }
    function makeCaptains() {
        if (queue.length >= 6){
            captainsPicked = true;
            queueRandomized = util.randomize(queue);
            orangeCaptain = queueRandomized[0];
            blueCaptain = queueRandomized[queueRandomized.length - 1];
            orange.push(orangeCaptain);
            blue.push(blueCaptain);
            remainingPlayers = queueRandomized.slice(1,queueRandomized.length - 1);
            if (remainingPlayers.length > 0){
                if (blue.length === 3 && orange.length === 3){
                    print.printTeamsAndLeftOut(bot, channelID, blue, orange, remainingPlayers);
                } else {
                    print.printTeamsAndRemaining(bot, channelID, blue, orange, remainingPlayers);
                }
            } else {
                print.printTeams(bot, channelID, blue, orange);
            }
        } else {
            print.printNotEnoughPlayers(bot, channelID, queue);
        }
    }
    function makePicks() {
        if (captainsPicked === false){
            print.printCaptainsNotSelected(bot, channelID);
        }
        else if (blue.length === 3 && orange.length === 3){
            print.printTeamsAreFull(bot, channelID);
        }
        else if (isNaN(Number(args[1])) || args[1] < 0 || args[1] > remainingPlayers.length + 1){
            print.printInvalidPick(bot, channelID);
        }
        else if (orangePick && user === orangeCaptain){
            if ((args[1]) > 0 && (args[1] - 1) < remainingPlayers.length){
                orange.push(remainingPlayers[args[1] - 1]);
                remainingPlayers.splice(args[1] - 1,1);
                orangePick = false;
                bluePick = true;
                if (remainingPlayers.length > 0){
                    print.printTeamsAndRemaining(bot, channelID, blue, orange, remainingPlayers);
                } else {
                    print.printTeams(bot, channelID, blue, orange);
                }
            }
        }
        else if (bluePick && user === blueCaptain){
            if ((args[1]) > 0 && (args[1] - 1) < remainingPlayers.length){
                blue.push(remainingPlayers[args[1] - 1]);
                remainingPlayers.splice(args[1] - 1,1);
                if (!snake || blue.length >= 3) {
                    orangePick = true;
                    bluePick = false;
                }
                if (remainingPlayers.length > 0){
                    if (snake){
                        print.printTeamsAndRemainingSnake(bot, channelID, blue, orange, remainingPlayers);
                    } else {
                        print.printTeamsAndRemaining(bot, channelID, blue, orange, remainingPlayers);
                    }
                    if (blue.length >= 2){
                        snake = false;
                    }
                } else {
                    print.printTeams(bot, channelID, blue, orange);
                }
            }
        } else {
            print.printNotCaptainOrNotTeamPick(bot, channelID);
        }
    }
    function help() {
        print.printHelp(bot, channelID);
    }
    function clear() {
        if (user === orangeCaptain || user === blueCaptain){
            queue = [];
            print.printClearMsg(bot, channelID);
        } else {
            print.printNotCaptain(bot,channelID);
        }
    }
    function show() {
        if (queue.length > 0){
            print.printCurrentQueue(bot, channelID, queue);
        } else {
            print.printEmptyQueue(bot, channelID);
        }
    }
    function leave(){
        if (queue.includes(user)){
            util.remove(queue, user);
            print.printCurrentQueueAfterUserLeave(bot, channelID, user, queue);
        } else {
            print.printUserNotInQueue(bot, channelID);
        }
    }
    function join() {
        if (!queue.includes(user) && queue.length < 6){
            queue.push(user);
            print.printCurrentQueueAfterUserJoin(bot, channelID, user, queue);
        }
        else if (queue.length >= 6){
            print.printQueueIsFull(bot,channelID);
        }
        else {
            print.printUserAlreadyInQueue(bot, channelID);
        }
    }
    function showTeams() {
        if (orange.length > 0 && blue.length > 0){
            print.printTeams(bot, channelID, blue, orange);
        } else {
            print.printNotOnePlayerOnEachTeam(bot, channelID);
        }
    }
    function draftType() {
        if (user === orangeCaptain || user === blueCaptain){
            if (args[1] === '1'){
                linear = true;
                snake = false;
                print.printLinearDraftType(bot, channelID)
            }
            else if (args[1] === '2'){
                linear = false;
                snake = true;
                print.printSnakeDraftType(bot, channelID);
            }
            else {
                print.printInvalidDraftType(bot, channelID);
            }
        }
        else if (captainsPicked === true) {
            print.printNotCaptain(bot, channelID);
        } else {
            print.printCaptainsNotSelected(bot, channelID);
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
                clear();
                break;
            case 'pick':
                makePicks();
                break;
            case 'teams':
                showTeams();
                break;
            case 'draft':
                draftType();
                break;
         }
     }
});