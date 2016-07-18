//TODO: find out why creeps in the northern room are getting confused and fix it
//TODO: **add containers and carriers plz
//TODO: train all units to steal from enemies
//TODO: globalize all searches
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleWarrior = require('role.warrior');

var construction = require('construction');

var spawnCreep = function(type, spawn, energy) {
    var abilitiesArray = [MOVE, CARRY, WORK];
    
    energy -= 200;
    
    if(type == 'harvester')
    {
        var w = 2*energy/6;
        var c = 2*energy/6;
        var m = 2 *energy/6;
        
        while(m >= 50){
            abilitiesArray.push(MOVE);
            m = m - 50;
        }
        w = w + m;
        while(w >= 100){
            abilitiesArray.push(WORK);
            w = w - 100;
        }
        
        c = c + w;
        while(c >= 50){
            abilitiesArray.push(CARRY);
            c = c - 50;
        }
        spawn.createCreep(abilitiesArray, undefined, {role: 'harvester'});
    }
    else if(type == 'upgrader')
    {
        var w = 2*energy/6;
        var c = 2*energy/6;
        var m = 2*energy/6;
        
        while(m >= 50){
            abilitiesArray.push(MOVE);
            m = m - 50;
        }
        w = w + m;
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
        
        spawn.createCreep(abilitiesArray, undefined, {role: 'upgrader'});
    }
    else if(type == 'builder')
    {
        var w = energy/3;
        var c = energy/3;
        var m = energy/3;
        
        
        while(m >= 50){
            abilitiesArray.push(MOVE);
            m = m - 50;
        }
        w = w + m;
        
        while(w >= 100){
            abilitiesArray.push(WORK);
            w = w - 100;
        }
        
        c = c + w;
        while(c >= 50){
            abilitiesArray.push(CARRY);
            c = c - 50;
        }
        spawn.createCreep(abilitiesArray, undefined, {role: 'builder'});
    }
    else if(type == 'footman')
    {
        var a = energy/4
        var w = energy/4;
        var c = energy/4;
        var m = energy/4;
        
        while(m >= 50){
            abilitiesArray.push(MOVE);
            m = m - 50;
        }
        a = a + m;
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
        spawn.createCreep(abilitiesArray, undefined, {role: 'footman'});
    }
    else if(type == 'warrior')
    {
        var a = energy/3;
        var m = energy/3;
        var c = energy/3;
        
        while(a >= 80){
            abilitiesArray.push(ATTACK);
            a = a - 80;
        }
        m = m + a;
        
        while(m >= 50){
            abilitiesArray.push(MOVE);
            m = m - 50;
        }
        
        c = c + m;
        while(c >= 50){
            abilitiesArray.push(CARRY);
            c = c - 50;
        }
        
        spawn.createCreep(abilitiesArray, undefined, {role: 'warrior'});
    }
    
    
}

module.exports.loop = function () {
    Game.flags.Flag1.memory.creeps = 0;
    
    var pop = 0;
    for (var i in Game.creeps) { pop++ }
    
    
    var roleHarvester = require('role.harvester');
    var roleUpgrader = require('role.upgrader');
    var roleBuilder = require('role.builder');
    
    var creepsCount = new Map();
    creepsCount.set('harvester',0);
    creepsCount.set('upgrader',0);
    creepsCount.set('builder',0);
    creepsCount.set('footman',0);
    creepsCount.set('warrior',0);
    
    var slots = [[]];
    var constructionSites = [[]];
    var droppedEnergy = [[]];
    var sourcesAll = [[]];
    var roomss = [];
    var sourcesChecking = [[]];
    var structures = [[]];
    var targets = [[]];
    var enemyStructures = [[]];
    var energyDropoffPoints = [[]];
    var energyNeeded = [[]];
    
    roomss.push(Game.spawns.Spawn1.room);
    for(var h in Game.creeps){
        var s = Game.creeps[h];
        roomss.push(s.room);
        if(typeof(s.memory.roomName) != "undefined"){
            
            if(typeof(Game.rooms[s.memory.roomName]) != "undefined"){
                roomss.push(Game.rooms[s.memory.roomName])
            }
        }
    }
    
    var roomss =new Set(roomss);
    
    
    for(let r of roomss)
    {
        if(typeof(r) == "undefined"){
            continue;
        }
        
        var towers = r.find(STRUCTURE_TOWER);
        var tower = towers[0];
        if(tower) {
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
            }
        }
        
        
        var sources = r.find(FIND_SOURCES);
        construction.buildExtensions(sources);
        constructionSites[r.name] = r.find(FIND_CONSTRUCTION_SITES);
        droppedEnergy[r.name] = (r.find(FIND_DROPPED_RESOURCES));
        sourcesChecking[r.name] = r.find(FIND_CONSTRUCTION_SITES);
        structures[r.name] = r.find(FIND_STRUCTURES);
        targets[r.name] = r.find(FIND_HOSTILE_CREEPS);
        enemyStructures[r.name] = r.find(FIND_HOSTILE_STRUCTURES);
        sourcesAll[r.name] = sources;
        energyNeeded[r.name] = [];
        energyDropoffPoints[r.name] = [];
        
        //This needs to be moved out
        energyDropoffPoints[r.name] = r.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER ) 
                            && structure.energy < structure.energyCapacity;
                }
        });
        
        
        var energyDropOffPointsFound = r.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_SPAWN) 
                        && structure.energy < structure.energyCapacity;
            }
        });
        
        for(var t in energyDropOffPointsFound){
            energyDropoffPoints[r.name].push(energyDropOffPointsFound[t]);
        }
        
        
        energyDropOffPointsFound = r.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ) 
                            && structure.energy < structure.energyCapacity;
                }
        });
        
        
        for(var t in energyDropOffPointsFound){
            energyDropoffPoints[r.name].push(energyDropOffPointsFound[t]);
        }
        
        
        for (var t in energyDropoffPoints[r.name]){
            energyNeeded[r.name].push(energyDropoffPoints[r.name][t].energyCapacity - energyDropoffPoints[r.name][t].energy);
        }
        
        slots[r.name] = [];
        slots[r.name][0] = 0;
        
        for(var source in sources)
        {
            slots[r.name][source] = 0;        
            var pos = sources[source].pos;
            
            if(Game.map.getTerrainAt(pos.x + 1,pos.y,sources[source].room.name) != 'wall')
            {
                slots[r.name][source] = slots[r.name][source] + 1;
            }
            
            if(Game.map.getTerrainAt(pos.x + 1,pos.y - 1,sources[source].room.name) != 'wall')
            {
                slots[r.name][source] = slots[r.name][source] + 1;
            }
            
            if(Game.map.getTerrainAt(pos.x + 1,pos.y + 1,sources[source].room.name) != 'wall')
            {
                slots[r.name][source] = slots[r.name][source] + 1;
            }
            
            if(Game.map.getTerrainAt(pos.x - 1,pos.y,sources[source].room.name) != 'wall')
            {
                slots[r.name][source] = slots[r.name][source] + 1;
            }
            
            
            if(Game.map.getTerrainAt(pos.x - 1,pos.y + 1,sources[source].room.name) != 'wall')
            {
                slots[r.name][source] = slots[r.name][source] + 1;
            }
            
            
            if(Game.map.getTerrainAt(pos.x - 1,pos.y - 1,sources[source].room.name) != 'wall')
            {
                slots[r.name][source] = slots[r.name][source] + 1;
            }
            
        }
    }
    
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(!creep.memory.role){
            creep.memory.role = 'footman';
            
        }
        
        if(creep.memory.role == 'harvester') {
            creep.memory.harvesting = true;
            creepsCount.set('harvester', creepsCount.get('harvester') + .2);
            slots = roleHarvester.run(creep,slots,droppedEnergy[creep.room.name],sourcesAll,true,enemyStructures[creep.room.name],energyDropoffPoints,energyNeeded);
            creep.memory.lastPos = creep.pos;
        }
        else if(creep.memory.role == 'upgrader') {
            creep.memory.harvesting = true;
            creepsCount.set('upgrader', creepsCount.get('upgrader') + .6);
            slots = roleUpgrader.run(creep,slots,droppedEnergy[creep.room.name],sourcesAll,pop,enemyStructures[creep.room.name],energyDropoffPoints,energyNeeded);
            creep.memory.lastPos = creep.pos;
        }
        else if(creep.memory.role == 'builder') {
            creep.memory.harvesting = true;
            creepsCount.set('builder', creepsCount.get('builder') + .6);
            slots = roleBuilder.run(creep,slots,droppedEnergy[creep.room.name],sourcesAll,sourcesChecking[creep.room.name],structures[creep.room.name],pop,enemyStructures[creep.room.name],
                    constructionSites[creep.room.name],energyDropoffPoints,energyNeeded);
            creep.memory.lastPos = creep.pos;
        }
        else if(creep.memory.role == 'footman') {
            creep.memory.harvesting = true;
            creepsCount.set('footman', creepsCount.get('footman') + .1);
            slots = roleWarrior.run(creep,slots,droppedEnergy[creep.room.name],sourcesAll,targets[creep.room.name],enemyStructures[creep.room.name],energyDropoffPoints,energyNeeded);
            creep.memory.lastPos = creep.pos;
        }
        else if(creep.memory.role == 'warrior') {
            creep.memory.harvesting = true;
            creepsCount.set('warrior', creepsCount.get('warrior') + 1);
            slots = roleWarrior.run(creep,slots,droppedEnergy[creep.room.name],sourcesAll,targets[creep.room.name],enemyStructures[creep.room.name],energyDropoffPoints,energyNeeded);
            creep.memory.lastPos = creep.pos;
        }
    }
    
    for(var s in Game.spawns){
        var spawn = Game.spawns[s];
        //only spawn at total capacity
        var totalEnergy = spawn.room.energyAvailable;
        var totalCapacity = spawn.room.energyCapacityAvailable;


        var spawn= Game.spawns[s];
        spawn.memory.lastSpawn++;
        if(totalCapacity == totalEnergy || spawn.memory.lastSpawn > 200 || pop < 5){
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
    }
    /*
    for(var i in Memory.creeps) {
        if(!Game.creeps[Memory.creeps[i]] ) {
            delete Memory.creeps[i];
        }
    }*/
    
}
    
