var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleFootman = require('role.footman');

var construction = require('construction');

var spawnCreep = function(type, spawn, energy) {
    var abilitiesArray = [MOVE, CARRY, WORK];
    
    energy -= 200;
    
    if(type == 'harvester')
    {
        while(energy >= 150){
            abilitiesArray.push(WORK);
            abilitiesArray.push(CARRY);
            console.log("e:" +energy);
            energy -= 150;
        }
        while(energy >= 100){
            abilitiesArray.push(WORK);
            energy -=100;
        }
        console.log("e:" + energy);
    }
    else if(type == 'upgrader')
    {
        while(energy >= 150){
            abilitiesArray.push(WORK);
            abilitiesArray.push(CARRY);
            energy -= 150;
        }
        while(energy >= 100){
            abilitiesArray.push(WORK);
            energy -=100;
        }
    }
    else if(type == 'builder')
    {
        while(energy >= 150){
            abilitiesArray.push(WORK);
            abilitiesArray.push(CARRY);
            energy -= 150;
        }
        while(energy >= 100){
            abilitiesArray.push(WORK);
            energy -=100;
        }
    }
    else if(type == 'footman')
    {
        while(energy >= 150){
            abilitiesArray.push(WORK);
            abilitiesArray.push(CARRY);
            energy -= 150;
        }
        while(energy >= 100){
            abilitiesArray.push(WORK);
            energy -=100;
        }
    }
    
    
    spawn.createCreep(abilitiesArray, undefined, {role: type});
}

module.exports.loop = function () {
    console.log("calling buildRoadToAllSources");
    construction.buildRoadToAllSources();
    construction.buildExtensions();
    
    
    var creepsCount = new Map();
    creepsCount.set('harvester',0);
    creepsCount.set('upgrader',0);
    creepsCount.set('builder',0);
    creepsCount.set('footman',0);
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            creepsCount.set('harvester', creepsCount.get('harvester') + 1);
            roleHarvester.run(creep);
        }
        else if(creep.memory.role == 'upgrader') {
            creepsCount.set('upgrader', creepsCount.get('upgrader') + 1);
            roleUpgrader.run(creep);
        }
        else if(creep.memory.role == 'builder') {
            creepsCount.set('builder', creepsCount.get('builder') + 1);
            roleBuilder.run(creep);
        }
        else if(creep.memory.role == 'footman') {
            creepsCount.set('footman', creepsCount.get('footman') + 1);
            roleFootman.run(creep);
        }
    }
    
    for(var s in Game.spawns){
        var spawn = Game.spawns[s];
        //only spawn at total capacity
        var totalEnergy = spawn.room.energyAvailable;
        var totalCapacity = spawn.room.energyCapacityAvailable;
        
        console.log("totalEnergy:"+totalEnergy+" totalCapacity:" + totalCapacity);


        var spawn= Game.spawns[s];
        console.log(totalCapacity*.9 + " "+ totalEnergy);
        if(totalCapacity*.9 <= totalEnergy){
            var min = 'harvester';
            var minValue = Number.MAX_VALUE;
            for (var [key, value] of creepsCount) {
                if(value < minValue){
                    minValue = value;
                    min = key;
                }
            }
            spawnCreep(min,spawn,totalEnergy);
        }
    }
    
    for(var i in Memory.creeps) {
        if(Object.keys(Memory.creeps[i]).length == 0) {
            delete Memory.creeps[i];
        }
    }
}
    
