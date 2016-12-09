/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roleClaimer');
 * mod.thing == 'a thing'; // true
 */
module.exports = {
    run: function(creep, gameInfoManager){
        for(var room in Game.rooms){
            if(typeof(room.controller) != 'undefined' && room.controller.my == false){
                pathManager.moveToNextStep(creep,room.controller);
                creep.claimController(room.controller);
                return;
            }
        }
    }
};