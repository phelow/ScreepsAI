//Imports
//TODO: make a stationary miner
//TODO: use http://support.screeps.com/hc/en-us/articles/207023879-PathFinder

//TODO: have "carriers" with no work and no move. There job is to find harvesters, grab their energy and give it to the nearest harvester, builder, or dropoff point.
//As part of this, have harvesters run carrier protocols when they have no available targets

var gameInfoManager = require("GameInfoManager");
var constructionManager = require("ConstructionManager");
var roleHarvester = require("roleHarvester");
var roleUpgrader = require("roleUpgrader");
var roleBuilder = require("roleBuilder");
var roleFootman = require("roleFootman");
var roleCarrier = require("roleCarrier");
var roleTower = require("roleTower");
var roleArcher = require("roleArcher");
var spawnManager = require("SpawnManager");
var pathManager = require("PathManager");
//-----

module.exports.loop = function () {
    
    //read our environmental information
    //take our tally of population
    
    gameInfoManager.CacheEnvironment();
    var hashSet = {};
    
    for(var creepIndex in Game.creeps){
        var creep = Game.creeps[creepIndex];
        creep.memory.manualMove = false;
        
        for(var xPlus = -1; xPlus < 2; xPlus++){
            
            for(var yPlus = -1; yPlus < 2; yPlus++){
                var x = creep.pos.x + xPlus;
                var y =  creep.pos.y + yPlus;
                var hash = creep.room + " " + x + " " + y;
                if(hash in hashSet){
                   hashSet[ hash].memory.manualMove = true; 
                   creep.memory.manualMove = true;
                }
                hashSet[hash] = creep;
            }
        }
        
    }
    //run the creeps
    for(var creepIndex in Game.creeps){
        var creep = Game.creeps[creepIndex];
        creep.memory.spawned = true;
        if(creep.memory.role == "harvester"){
            roleHarvester.run(creep,gameInfoManager);
        }
        else if(creep.memory.role == "upgrader"){
            roleUpgrader.run(creep,gameInfoManager);
        }
        else if(creep.memory.role == "builder"){
            roleBuilder.run(creep,gameInfoManager);
        }
        else if(creep.memory.role == "footman"){
            roleFootman.run(creep,gameInfoManager);
        }else if(creep.memory.role == "archer"){
            roleArcher.run(creep,gameInfoManager);
        }else if(creep.memory.role == "carrier"){
            roleCarrier.run(creep,gameInfoManager);
        }
    }
    
    //run the towers
    for(var room in gameInfoManager.World){
        for(var tower in gameInfoManager.World[room].myTowers){
            roleTower.run(tower,gameInfoManager);
            
        }
    }
    
    if(Game.cpu.bucket > 9000 || typeof(Memory.lastBucket) == 'undefined' || Memory.lastBucket == Game.cpu.tickLimit 
    || gameInfoManager.MaxEnergy){
        spawnManager.SpawnCreeps(gameInfoManager);
        constructionManager.BuildSites(gameInfoManager);
        for(var i in Memory.creeps) {
            if(!Game.creeps[i] && Memory.creeps[i].spawned == true) {
                delete Memory.creeps[i];
            }
        }
    
        pathManager.cleanCacheByUsage();
    }
    
    Memory.lastBucket = Game.cpu.tickLimit;
    //spawn the creeps
    
}