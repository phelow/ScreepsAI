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
        spawn.createCreep(abilitiesArray, undefined, {role: 'harvester'});
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
        spawn.createCreep(abilitiesArray, undefined, {role: 'upgrader'});
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
        spawn.createCreep(abilitiesArray, undefined, {role: 'builder'});
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
    
    var slots = [[]];
    var droppedEnergy = [[]];
    var sourcesAll = [[]];
    var roomss = [];
    roomss.push(Game.spawns.Spawn1.room);
    for(var s in Game.creeps){
        console.log(Game.creeps[s].room);
        roomss.push(Game.creeps[s].room);
        console.log(roomss[0]);
    }
    
    var roomss =new Set(roomss);
    console.log(roomss);
    for (let item of roomss) console.log(item);
    
    for(let r of roomss)
    {
        console.log("186" + r);
        var y = 0;
        var sources = r.find(FIND_SOURCES);
        
        for(var source in sources)
        {
            if(!slots[r.name])
            {
                slots[r.name] = [0];
            }
            slots[r.name].push(0);        
            droppedEnergy[r.name] = (r.find(FIND_DROPPED_RESOURCES));
            sourcesAll[r.name] = (r.find(FIND_SOURCES));
            console.log(slots + r.name);
            var pos = sources[source].pos;
            
            if(Game.map.getTerrainAt(pos.x + 1,pos.y,sources[source].room.name) != 'wall')
            {
                slots[r.name][y] = slots[r.name][y] + 1;
            }
            
            if(Game.map.getTerrainAt(pos.x + 1,pos.y - 1,sources[source].room.name) != 'wall')
            {
                slots[r.name][y] = slots[r.name][y] + 1;
            }
            
            if(Game.map.getTerrainAt(pos.x + 1,pos.y + 1,sources[source].room.name) != 'wall')
            {
                slots[r.name][y] = slots[r.name][y] + 1;
            }
            
            if(Game.map.getTerrainAt(pos.x - 1,pos.y,sources[source].room.name) != 'wall')
            {
                slots[r.name][y] = slots[r.name][y] + 1;
            }
            
            
            if(Game.map.getTerrainAt(pos.x - 1,pos.y + 1,sources[source].room.name) != 'wall')
            {
                slots[r.name][y] = slots[r.name][y] + 1;
            }
            
            
            if(Game.map.getTerrainAt(pos.x - 1,pos.y - 1,sources[source].room.name) != 'wall')
            {
                slots[r.name][y] = slots[r.name][y] + 1;
            }
            y = y + 1;
        }
    }
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
    
        
        if(creep.memory.role == 'harvester') {
            creep.memory.harvesting = true;
            creepsCount.set('harvester', creepsCount.get('harvester') + .2);
            slots = roleHarvester.run(creep,slots,droppedEnergy[creep.room.name],sourcesAll[creep.room.name]);
        }
        else if(creep.memory.role == 'upgrader') {
            Game.spawns.Spawn1.transferEnergy(creep,creep.energyCapacity);
            creep.memory.harvesting = true;
            creepsCount.set('upgrader', creepsCount.get('upgrader') + .6);
            slots = roleUpgrader.run(creep,slots,droppedEnergy[creep.room.name],sourcesAll[creep.room.name]);
        }
        else if(creep.memory.role == 'builder') {
            Game.spawns.Spawn1.transferEnergy(creep,creep.energyCapacity);
            creep.memory.harvesting = true;
            creepsCount.set('builder', creepsCount.get('builder') + .6);
            slots = roleBuilder.run(creep,slots,droppedEnergy[creep.room.name],sourcesAll[creep.room.name]);
        }
        else if(creep.memory.role == 'footman') {
            creep.memory.harvesting = true;
            creepsCount.set('footman', creepsCount.get('footman') + .1);
            slots = roleFootman.run(creep,slots,droppedEnergy[creep.room.name],sourcesAll[creep.room.name]);
        }
        else if(creep.memory.role == 'warrior') {
            creep.memory.harvesting = true;
            creepsCount.set('warrior', creepsCount.get('warrior') + 1);
            slots = roleWarrior.run(creep,slots,droppedEnergy[creep.room.name],sourcesAll[creep.room.name]);
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
    }
    /*
    for(var i in Memory.creeps) {
        if(Object.keys(Memory.creeps[i]).length == 0) {
            delete Memory.creeps[i];
        }
    }
    
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }*/
}
    
