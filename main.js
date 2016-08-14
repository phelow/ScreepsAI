//Imports
var gameInfoManager = require("GameInfoManager");
var roleHarvester = require("roleHarvester");
//-----

module.exports.loop = function () {
    //read our environmental information
    //take our tally of population
    gameInfoManager.CacheEnvironment();
    
    //run the creeps
    for(var creepIndex in Game.creeps){
        var creep = Game.creeps[creepIndex];
        
        if(creep.memory.role == "harvester"){
            roleHarvester.run(creep,gameInfoManager);
        }
    }
    
    //spawn the creeps
    
}