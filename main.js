var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

spawn = function(type) {
    if(type == 'harvester')
    {
        Game.spawns.Spawn1.createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester'});
    }
    else if(type == 'upgrader')
    {
        Game.spawns.Spawn1.createCreep([WORK,CARRY,MOVE], undefined, {role: 'upgrader'});
    }
    else if(type == 'builder')
    {
        Game.spawns.Spawn1.createCreep([WORK,CARRY,MOVE], undefined, {role: 'upgrader'});
    }
}

module.exports.loop = function () {
    
    var tower = Game.getObjectById('a8b7ffef999574de55d6cce3');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
    var creepsCount = new Map();
    creepsCount.set('harvester',0);
    creepsCount.set('upgrader',0);
    creepsCount.set('builder',0);
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            creepsCount.set('harvester', creepsCount.get('harvester') + 1);
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
            creepsCount.set('upgrader', creepsCount.get('upgrader') + 1);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
            creepsCount.set('builder', creepsCount.get('builder') + 1);
        }
    }
    var min = 'harvester';
    var minValue = Math.max;
    for (var [key, value] of creepsCount) {
        if(value < minValue){
            minValue = value;
            min = key;
        }
        
        console.log(key + " = " + value);
    }
    spawn(min);
}
    
