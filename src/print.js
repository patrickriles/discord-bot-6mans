module.exports = {
    printHelp: function(bot, channelID) {
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
    },
     printClearMsg: function (bot, channelID) {
         bot.sendMessage({
             to: channelID,
             message: 'Queue has been cleared.'
         });
    },
    printEmptyQueue: function(bot, channelID) {
        bot.sendMessage({
            to: channelID,
            message: 'Queue is empty!'
        });
    },
    printCurrentQueueAfterUserLeave: function(bot, channelID, user, queue) {
        bot.sendMessage({
            to: channelID,
            message: user + ' has been removed from the queue. Current queue: ' + queue
        });
    },
    printUserNotInQueue: function(bot, channelID) {
        bot.sendMessage({
            to: channelID,
            message: 'User is not in queue!'
        });
    },
    printUserAlreadyInQueue: function(bot, channelID) {
        bot.sendMessage({
            to: channelID,
            message: 'User is already in the queue!'
        });
    },
    printCurrentQueue: function(bot, channelID, queue) {
        bot.sendMessage({
            to: channelID,
            message: 'Current Queue: ' + queue
        });
    },
    printCurrentQueueAfterUserJoin: function(bot, channelID, user, queue) {
        bot.sendMessage({
            to: channelID,
            message: user + ' has been added to the queue. Current queue: ' + queue
        });
    },
    printQueueIsFull: function(bot,channelID) {
        bot.sendMessage({
            to: channelID,
            message: 'Queue is full!'
        });
    },
     printRemainingPlayers: function(remainingPlayers) {
        let rp = '';
        for (let i = 0; i < remainingPlayers.length; i++){
            if (i === remainingPlayers.length - 1){
                rp += i+1 + '. ' + remainingPlayers[i];
            } else {
                rp += i+1 + '. ' + remainingPlayers[i] + ', ';
            }
        }
        return rp;
    },
    printTeamsAndRemaining: function(bot, channelID, blue, orange, remainingPlayers){
        bot.sendMessage({
            to: channelID,
            message: '```Orange Team: ' + orange + '\n' +
                'Blue Team: ' + blue + '```' +
                'Remaining Players: `' + printRemainingPlayers(remainingPlayers) + '`'
        });
    },
    printTeamsAndLeftOut: function(bot, channelID, blue, orange, remainingPlayers){
        bot.sendMessage({
            to: channelID,
            message: '```Orange Team: ' + orange + '\n' + 'Blue Team: ' + blue + '```' +
                'Players sitting out: `' + printRemainingPlayers(remainingPlayers) + '`'
        });
    },
    printTeams: function(bot, channelID, blue, orange){
        bot.sendMessage({
            to: channelID,
            message: '```Orange Team: ' + orange + '\n' + 'Blue Team: ' + blue + '```'
        });
    },
    printNotEnoughPlayers: function(bot, channelID, queue) {
        bot.sendMessage({
            to: channelID,
            message: 'Not enough players in the queue! (' + queue.length + ')'
        });
    },
    printNotOnePlayerOnEachTeam: function(bot, channelID) {
        bot.sendMessage({
            to: channelID,
            message: 'There isn\'t at least one player on each team!'
        });
    },
    printCaptainsNotSelected: function(bot, channelID) {
        bot.sendMessage({
            to: channelID,
            message: 'Captains have not been selected!'
        });
    },
    printTeamsAreFull:function(bot, channelID) {
        bot.sendMessage({
            to: channelID,
            message: 'Teams have already been selected.'
        });
    },
    printNotCaptainOrNotTeamPick: function(bot, channelID) {
        bot.sendMessage({
            to: channelID,
            message: 'You are not a captain or it is not your teams pick.'
        });
    }
};
