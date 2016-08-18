//Imports
var gameInfoManager = require("GameInfoManager");
var constructionManager = require("ConstructionManager");
var roleHarvester = require("roleHarvester");
var roleUpgrader = require("roleUpgrader");
var roleBuilder = require("roleBuilder");
var roleFootman = require("roleFootman");
var spawnManager = require("SpawnManager");
//-----

module.exports.loop = function () {
    //read our environmental information
    //take our tally of population
    
    gameInfoManager.CacheEnvironment();
    spawnManager.SpawnCreeps(gameInfoManager);
    constructionManager.BuildSites(gameInfoManager);
    
    //run the creeps
    for(var creepIndex in Game.creeps){
        var creep = Game.creeps[creepIndex];
        
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
        }
    }
    
    //spawn the creeps
    
}