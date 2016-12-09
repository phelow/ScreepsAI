/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roleCarrier');
 * mod.thing == 'a thing'; // true
 */
var pathManager = require("PathManager");
var roleHarvester = require("roleHarvester");

module.exports = {
    ChooseTransferTarget: function(creep,gameInfoManager){
        var energy = 0;
        delete creep.memory.transferTargetName;

        var leastDistance = Infinity;
        //pick the nearest creep with any amount of energy
        for(var c in Game.creeps){
            
            
            var totalCarry = _.sum(Game.creeps[c].carry);
            var thisDistance = creep.pos.getRangeTo(Game.creeps[c]);
            if(typeof(Game.creeps[c].helped) == 'undefined' &&  
            totalCarry > Game.creeps[c].carryCapacity * .6 &&
            thisDistance <= leastDistance 
            && Game.creeps[c].memory.role == "harvester")
            {
                leastDistance = thisDistance;
                energy = totalCarry;
                creep.memory.transferTargetName = c;
            }
        }
        if(typeof(creep.memory.transferTargetName) != 'undefined' ){
            Game.creeps[creep.memory.transferTargetName].helped = true;
        }
    },
    
    run: function(creep, gameInfoManager){//TODO: if another unit is closer than a dropoff point go to that instead
        roleHarvester.ChangeHarvestState(creep);
        
        //if harvesting search for the nearest creep with energy, prioritize miners
        if(creep.memory.harvesting){
            if(typeof(Game.creeps[creep.memory.transferTargetName]) == 'undefined' ||_.sum(Game.creeps[creep.memory.transferTargetName].carry) ==0){
                this.ChooseTransferTarget(creep,gameInfoManager);
            }
            if(typeof(Game.creeps[creep.memory.transferTargetName]) == 'undefined'){
                return;
            }
            var result = Game.creeps[creep.memory.transferTargetName].transfer(creep,RESOURCE_ENERGY,_.sum(Game.creeps[creep.memory.transferTargetName].carry));
            if(result == -6){
                this.ChooseTransferTarget(creep,gameInfoManager);
            }
            Game.creeps[creep.memory.transferTargetName].helped = true;
            
            pathManager.moveToNextStep(creep,Game.creeps[creep.memory.transferTargetName]);
            result = Game.creeps[creep.memory.transferTargetName].transfer(creep,RESOURCE_ENERGY,_.sum(Game.creeps[creep.memory.transferTargetName].carry));
            if(result == -6){
                this.ChooseTransferTarget(creep,gameInfoManager);
            }
            creep.say("48:" + result);
            //creep.memory.harvesting = false;
            
        }
        //else
        else{
            //run harvester
            roleHarvester.run(creep, gameInfoManager);
        }
    }
};