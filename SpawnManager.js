/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('SpawnManager');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    SpawnACreep: function(energy, spawn, type){
        var abilitiesArray = [MOVE, CARRY, WORK];
        energy -= 200;
        var workEnergy = 2*energy/6;
        var carryEnergy = 2*energy/6;
        var moveEnergy = 2 *energy/6;
        var attackEnergy = 0;
        
        if(type == "footman"){
            attackEnergy = workEnergy/2;
        }
        
        while(attackEnergy >= 80){
            abilitiesArray.push(ATTACK);
            attackEnergy -= 80;
        }
        
        
        while(moveEnergy >= 50){
            abilitiesArray.push(MOVE);
            moveEnergy = moveEnergy - 50;
        }
        
        workEnergy = workEnergy + moveEnergy;
        while(workEnergy >= 100){
            abilitiesArray.push(WORK);
            workEnergy = workEnergy - 100;
        }
        
        carryEnergy = carryEnergy + workEnergy;
        while(carryEnergy >= 50){
            abilitiesArray.push(CARRY);
            carryEnergy = carryEnergy - 50;
        }
        
        spawn.createCreep(abilitiesArray, undefined, {role: type});
        
    },
    
    SpawnCreeps: function(gameInfoManager)
    {
        for(var spawnIndex in Game.spawns){
            var spawn = Game.spawns[spawnIndex];
            
            var maxEnergy = spawn.room.energyCapacityAvailable;
            var energyAvailable = spawn.room.energyAvailable;
            
            if(energyAvailable == maxEnergy){
                this.SpawnACreep(energyAvailable,spawn, gameInfoManager.ChooseAClass());
            }
        }
    }
};