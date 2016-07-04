var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleFootman = require('role.footman');

var construction = require('construction');

var spawn = function(type) {
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
        Game.spawns.Spawn1.createCreep([WORK,CARRY,MOVE], undefined, {role: 'builder'});
    }
    else if(type == 'footman')
    {
        Game.spawns.Spawn1.createCreep([MOVE,CARRY, ATTACK, WORK], undefined, {role: 'footman'});
    }
}

module.exports.loop = function () {
    console.log("calling buildRoadToAllSources");
    construction.buildRoadToAllSources();
    
    
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
    
    var min = 'harvester';
    var minValue = Number.MAX_VALUE;
    for (var [key, value] of creepsCount) {
        if(value < minValue){
            minValue = value;
            min = key;
        }
    }
    spawn(min);
}
    
