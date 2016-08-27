/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roleFootman');
 * mod.thing == 'a thing'; // true
 */

var roleHarvester = require("roleHarvester");

module.exports = {
    
    findNearestTargetCreep: function(creep, gameInfoManager){
        var closestRange = Infinity;
        this.killRoom  = 0;
        
        for(var roomName in gameInfoManager.World){
            for(var constructionSite in gameInfoManager.World[roomName].hostileCreeps){
                var curRange = creep.pos.getRangeTo(gameInfoManager.World[roomName].hostileCreeps[constructionSite].pos);
                if(curRange <= closestRange && !(gameInfoManager.World[roomName].hostileCreeps[constructionSite].hitsMax > creep.hitsMax * 5 
                && gameInfoManager.World[roomName].hostileCreeps[constructionSite].hitsMax == 5000)){
                    closestRange = curRange;
                    this.killRoom = roomName;
                    this.killSite = constructionSite;
                }
            }
        }
    },
    
    
    findNearestTargetStructure: function(creep, gameInfoManager){
        var closestRange = Infinity;
        this.killRoom  = 0;
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
        
        if(this.killRoom !=0 &&
        roleHarvester.GetDistanceTo(creep,gameInfoManager.World[
            this.killRoom].hostileCreeps[this.killSite]) < 1 + creep.pos.getRangeTo(gameInfoManager.World[this.killRoom].hostileCreeps[this.killSite])){ //TODO: see if this works when you're next to a unit
			creep.moveTo(gameInfoManager.World[this.killRoom].hostileCreeps[this.killSite])
			creep.attack(gameInfoManager.World[this.killRoom].hostileCreeps[this.killSite]);
        }
        else if(this.findNearestTargetStructure(creep,gameInfoManager) == true){
			creep.moveTo(gameInfoManager.World[this.killRoom].hostileStructures[this.killSite]);
			creep.attack(gameInfoManager.World[this.killRoom].hostileStructures[this.killSite]);
        }
        else{
            if(creep.carryCapacity == 0){ 
                roleHarvester.Explore(creep,gameInfoManager);
                return;
            }
            roleHarvester.run(creep,gameInfoManager);        
        }
    }
};