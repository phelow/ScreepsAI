//Imports
var gameInfoManager = require("GameInfoManager");
var roleHarvester = require("roleHarvester");
var roleUpgrader = require("roleUpgrader");
var spawnManager = require("SpawnManager");
//-----

module.exports.loop = function () {
    //read our environmental information
    //take our tally of population
    gameInfoManager.CacheEnvironment();
    spawnManager.SpawnCreeps(gameInfoManager);
    
    //run the creeps
    for(var creepIndex in Game.creeps){
        var creep = Game.creeps[creepIndex];
        
        if(creep.memory.role == "harvester"){
            roleHarvester.run(creep,gameInfoManager);
        }
        else if(creep.memory.role == "upgrader"){
            roleUpgrader.run(creep,gameInfoManager);
        }
    }
    
    //spawn the creeps
    
}