var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleFootman = require('role.footman');
var roleWarrior = require('role.warrior');

var construction = require('construction');

var spawnCreep = function(type, spawn, energy) {
    var abilitiesArray = [MOVE, CARRY, WORK];
    
    energy -= 200;
    
    if(type == 'harvester')
    {
        var w = energy/3;
        var c = energy/3;
        var m = energy/3;
        
        while(w >= 100){
            abilitiesArray.push(WORK);
            w = w - 100;
        }
        
        c = c + w;
        while(c >= 50){
            abilitiesArray.push(CARRY);
            c = c - 50;
        }
        m = m + c;
        
        while(m >= 50){
            abilitiesArray.push(MOVE);
            m = m - 50;
        }
    }
    else if(type == 'upgrader')
    {
        var w = energy/3;
        var c = energy/3;
        var m = energy/3;
        
        while(w >= 100){
            abilitiesArray.push(WORK);
            w = w - 100;
        }
        
        c = c + w;
        while(c >= 50){
            abilitiesArray.push(CARRY);
            c = c - 50;
        }
        m = m + c;
        
        while(m >= 50){
            abilitiesArray.push(MOVE);
            m = m - 50;
        }
    }
    else if(type == 'builder')
    {
        var w = energy/3;
        var c = energy/3;
        var m = energy/3;
        
        while(w >= 100){
            abilitiesArray.push(WORK);
            w = w - 100;
        }
        
        c = c + w;
        while(c >= 50){
            abilitiesArray.push(CARRY);
            c = c - 50;
        }
        m = m + c;
        
        while(m >= 50){
            abilitiesArray.push(MOVE);
            m = m - 50;
        }
    }
    else if(type == 'footman')
    {
        var a = energy/4
        var w = energy/4;
        var c = energy/4;
        var m = energy/4;
        
        while(a >= 80){
            abilitiesArray.push(ATTACK);
            a = a - 80;
        }
        w = w + a;
        
        while(w >= 100){
            abilitiesArray.push(WORK);
            w = w - 100;
        }
        
        c = c + w;
        while(c >= 50){
            abilitiesArray.push(CARRY);
            c = c - 50;
        }
        m = m + c;
        
        while(m >= 50){
            abilitiesArray.push(MOVE);
            m = m - 50;
        }
    }
    else if(type == 'warrior')
    {
        var a = energy/2;
        var m = energy/2;
        
        while(a >= 80){
            abilitiesArray.push(ATTACK);
            a = a - 80;
        }
        w = w + a;
        
        while(w >= 100){
            abilitiesArray.push(WORK);
            w = w - 100;
        }
        
        c = c + w;
        while(c >= 50){
            abilitiesArray.push(CARRY);
            c = c - 50;
        }
        m = m + c;
        
        while(m >= 50){
            abilitiesArray.push(MOVE);
            m = m - 50;
        }
    }
    
    
    spawn.createCreep(abilitiesArray, undefined, {role: type});
}

module.exports.loop = function () {
    construction.buildRoadToAllSources();
    construction.buildExtensions();
    
    var roleHarvester = require('role.harvester');
    var roleUpgrader = require('role.upgrader');
    var roleBuilder = require('role.builder');

    var towers = Game.spawns.Spawn1.room.find(STRUCTURE_TOWER);
    var tower = towers[0];
    if(tower) {
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
    
    
    var creepsCount = new Map();
    creepsCount.set('harvester',0);
    creepsCount.set('upgrader',0);
    creepsCount.set('builder',0);
    creepsCount.set('footman',0);
    creepsCount.set('warrior',0);
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        if(Game.spawns.Spawn1.renewCreep(creep) == 0){
            Memory.lastSpawn = 0;
            console.log("creep successfully renewed")
        }
        
        if(creep.memory.role == 'harvester') {
            creep.memory.harvesting = true;
            creepsCount.set('harvester', creepsCount.get('harvester') + 1);
            roleHarvester.run(creep);
        }
        else if(creep.memory.role == 'upgrader') {
            creep.memory.harvesting = true;
            creepsCount.set('upgrader', creepsCount.get('upgrader') + 1);
            roleUpgrader.run(creep);
        }
        else if(creep.memory.role == 'builder') {
            creep.memory.harvesting = true;
            creepsCount.set('builder', creepsCount.get('builder') + 1);
            roleBuilder.run(creep);
        }
        else if(creep.memory.role == 'footman') {
            creep.memory.harvesting = true;
            creepsCount.set('footman', creepsCount.get('footman') + 1);
            roleFootman.run(creep);
        }
        else if(creep.memory.role == 'warrior') {
            creep.memory.harvesting = true;
            creepsCount.set('warrior', creepsCount.get('warrior') + 1);
            roleWarrior.run(creep);
        }
    }
    for(var s in Game.spawns){
        var spawn = Game.spawns[s];
        //only spawn at total capacity
        var totalEnergy = spawn.room.energyAvailable;
        var totalCapacity = spawn.room.energyCapacityAvailable;


        var spawn= Game.spawns[s];
        if(totalCapacity == totalEnergy || spawn.memory.lastSpawn > 200){
            spawn.memory.lastSpawn = 0;
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
        else if(spawn.energy == spawn.energyCapacity){
            spawn.memory.lastSpawn = spawn.memory.lastSpawn + 1;
        }
    }
    
    for(var i in Memory.creeps) {
        if(Object.keys(Memory.creeps[i]).length == 0) {
            delete Memory.creeps[i];
        }
    }
}
    
