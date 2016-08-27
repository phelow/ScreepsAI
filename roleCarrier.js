/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roleCarrier');
 * mod.thing == 'a thing'; // true
 */
var roleHarvester = require("roleHarvester");

module.exports = {
    ChooseTransferTarget: function(creep,gameInfoManager){
        var energy = 0;

        var leastDistance = Infinity;
        //pick the nearest creep with any amount of energy
        for(var c in Game.creeps){
            
            
            var totalCarry = _.sum(Game.creeps[c].carry);
            var thisDistance = creep.pos.getRangeTo(Game.creeps[c]);
            console.log(creep.name + "typeof(Game.creeps[c].helped):" + typeof(Game.creeps[c].helped));
            if(typeof(Game.creeps[c].helped) == 'undefined' && 
            (totalCarry > Math.min(energy,creep.carryCapacity) || 
            totalCarry == Math.min(energy,creep.carryCapacity &&
            thisDistance < leastDistance))
            && Game.creeps[c].memory.role == "harvester")
            {
                leastDistance = thisDistance;
                energy = totalCarry;
                creep.memory.transferTargetName = c;
            }
        }
        if(typeof(creep.memory.transferTargetName) != 'undefined'){
            Game.creeps[creep.memory.transferTargetName].helped = true;
        }
    },
    
    run: function(creep, gameInfoManager){
        roleHarvester.ChangeHarvestState(creep);
        
        //if harvesting search for the nearest creep with energy, prioritize miners
        if(creep.memory.harvesting){
            
            this.ChooseTransferTarget(creep,gameInfoManager);
            Game.creeps[creep.memory.transferTargetName].helped = true;
            creep.moveTo(Game.creeps[creep.memory.transferTargetName]);
            Game.creeps[creep.memory.transferTargetName].transfer(creep,RESOURCE_ENERGY,Game.creeps[creep.memory.transferTargetName].energy);
            creep.memory.harvesting = false;
            
        }
        //else
        else{
            //run harvester
            roleHarvester.run(creep, gameInfoManager);
        }
    }
};