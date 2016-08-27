/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('SpawnManager');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    SpawnACreep: function(energy, spawn, gameInfoManager){
        var type = gameInfoManager.ChooseAClass();
        if(type == "archer"){
            spawn.createCreep([MOVE,RANGED_ATTACK], undefined, {role: type});
            return;
        }
        
        if(gameInfoManager.TotalSlots == 0 && spawn.room.energyAvailable < spawn.room.energyCapacityAvailable && (type == "harvester" || type == "footman")){
            return;
        }
        
        var abilitiesArray = [MOVE, CARRY, WORK];
        energy -= 200;
        var workEnergy = 3*energy/6;
        var carryEnergy = 2*energy/6;
        var moveEnergy = energy/6;
        var attackEnergy = 0;
        if(type == "footman"){
            workEnergy = 2*workEnergy/3 - 30;
            moveEnergy = 2*moveEnergy/3 - 20;
            carryEnergy =  2*carryEnergy/3 - 30;
            attackEnergy = 80 + workEnergy/3 + carryEnergy/3 + moveEnergy/3;
            
            if(attackEnergy < 80){
                abilitiesArray = [];
                attackEnergy = attackEnergy + 80;
                moveEnergy = moveEnergy + 120;
            }
        } else if(type == "carrier"){
            abilitiesArray = [MOVE, CARRY];
            carryEnergy = carryEnergy + 3*workEnergy/4 + 75;
            moveEnergy = moveEnergy + workEnergy/4 + 25;
            workEnergy = 0;
        } else if(type == "harvester"){
            workEnergy = workEnergy + moveEnergy + carryEnergy;
            moveEnergy = 0;
            carryEnergy = 0;
            
        }
        
        while(moveEnergy >= 50){
            abilitiesArray.unshift(MOVE);
            moveEnergy = moveEnergy - 50;
        }
        
        workEnergy = workEnergy + moveEnergy;
        while(workEnergy >= 100){
            abilitiesArray.unshift(WORK);
            workEnergy = workEnergy - 100;
        }
        
        carryEnergy = carryEnergy + workEnergy;
        while(carryEnergy >= 50){
            abilitiesArray.unshift(CARRY);
            carryEnergy = carryEnergy - 50;
        }
        
        attackEnergy = carryEnergy + attackEnergy;
        if(attackEnergy < 80 && type == "footman"){
            return;
        }
        
        while(attackEnergy >= 80){
            abilitiesArray.push(ATTACK);
            attackEnergy -= 80;
        }
        
        spawn.createCreep(abilitiesArray, undefined, {role: type});
    },
    
    SpawnCreeps: function(gameInfoManager)
    {
        for(var spawnIndex in Game.spawns){
            var spawn = Game.spawns[spawnIndex];
            
            var energyAvailable = spawn.room.energyAvailable;
            
            this.SpawnACreep(energyAvailable,spawn, gameInfoManager);
        }
        
    }
};