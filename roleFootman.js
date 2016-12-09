/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roleFootman');
 * mod.thing == 'a thing'; // true
 */

var pathManager = require("PathManager");
var roleHarvester = require("roleHarvester");

module.exports = {
    
    findNearestTargetCreep: function(creep, gameInfoManager){
        var closestRange = Infinity;
        this.killCreepRoom  = -1;
        
        for(var roomName in gameInfoManager.World){
            for(var constructionSite in gameInfoManager.World[roomName].hostileCreeps){
                var curRange = creep.pos.getRangeTo(gameInfoManager.World[roomName].hostileCreeps[constructionSite].pos);
                if(curRange <= closestRange && !(gameInfoManager.World[roomName].hostileCreeps[constructionSite].hitsMax > creep.hitsMax * 5 
                && gameInfoManager.World[roomName].hostileCreeps[constructionSite].hitsMax == 5000 )){
                    closestRange = curRange;
                    this.killCreepRoom = roomName;
                    this.killCreepSite = constructionSite;
                }
            }
        }
    },
    
    
    findNearestTargetStructure: function(creep, gameInfoManager){
        this.killRoom = -1;
        var closestRange = Infinity;
        var roomName = creep.room.name;
        for(var constructionSite in gameInfoManager.World[roomName].hostileStructures){
            var curRange = creep.pos.getRangeTo(gameInfoManager.World[roomName].hostileStructures[constructionSite].pos);
            if(curRange <= closestRange){
                closestRange = curRange;
                this.killRoom = roomName;
                this.killSite = constructionSite;
            }
        }
        
        return this.killRoom != 0;
    },
    
    run: function(creep, gameInfoManager){
        this.findNearestTargetCreep(creep, gameInfoManager);
        this.findNearestTargetStructure(creep,gameInfoManager);
        
        if((this.killRoom == -1 && this.killCreepRoom == -1) || (typeof(gameInfoManager.World[this.killCreepRoom]) == 'undefined' && typeof(gameInfoManager.World[this.killRoom]) == 'undefined')){
            
            if(creep.carryCapacity == 0){ 
                roleHarvester.Explore(creep,gameInfoManager);
                return;
            }
            roleHarvester.run(creep,gameInfoManager);    
            return;
        }
        
        
        if(typeof(gameInfoManager.World[this.killCreepRoom]) != 'undefined'){ //TODO: see if this works when you're next to a unit
			creep.say("C");
			pathManager.moveToNextStep(creep,gameInfoManager.World[this.killCreepRoom].hostileCreeps[this.killCreepSite])
			creep.attack(gameInfoManager.World[this.killCreepRoom].hostileCreeps[this.killCreepSite]);
        }
        else{
            creep.say("S");
			pathManager.moveToNextStep(creep,gameInfoManager.World[this.killRoom].hostileStructures[this.killSite]);
			creep.attack(gameInfoManager.World[this.killRoom].hostileStructures[this.killSite]);
        }
    }
};