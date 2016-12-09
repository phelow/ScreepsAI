//TODO: replace slots with a "time to availability" object This will be a summation of the pathRange + carryCapacity/harvest rate of each creep mining a source.
//Then when iterating over the harvesters match a harvester and his distance with the time to availability and his "buddies" name. When his buddy leaves replace
//his time to availability with the avialability of the new creep. Keep track of which miner's have buddies with a boolean array of "has buddy".

//TODO: on each harvester store a distance value for the currently assigned carrier, only pick a carrier if it's closer than that distance
module.exports = {
    TallyTotals: function(){
        this.TallyPopulation();
    },
    
    CacheEnvironment: function(){
        this.TallyTotals();
        this.GatherRooms();
    },
    
    GatherRooms: function(){
        this.World = [];
        this.MaxEnergy = false;
        this.TotalSlots = 0;
        this.GlobalControl = 0;
        
        for(var roomIndex in Game.rooms){
            var room = Game.rooms[roomIndex];
            this.World[room.name] = {};
            this.World[room.name].room = room;
            
            if(typeof(room.controller) == 'undefined' ||typeof(room.controller.owner) == 'undefined' || room.controller.my){
                this.World[room.name].sources = room.find(FIND_SOURCES, {filter: (source) => {return (source.energy > 0)}});
            }
            else
            {
                this.World[room.name].sources = new Set([]);
            }
            
            this.World[room.name].roomExits = room.find(FIND_EXIT);
            
            this.World[room.name].constructionSites = room.find(FIND_CONSTRUCTION_SITES,{filter: (site) => {return (site.my)}});
            this.World[room.name].droppedEnergy = room.find(FIND_DROPPED_RESOURCES);
            this.World[room.name].myStructures = room.find(FIND_STRUCTURES,{
                filter: (structure) => {return (structure.my)}});
            this.World[room.name].myDamagedStructures = room.find(FIND_STRUCTURES,{
                filter: (structure) => {return (structure.my || structure.structureType == STRUCTURE_ROAD) && structure.hits < structure.hitsMax}});
            this.World[room.name].hostileStructures = 
                room.find(FIND_STRUCTURES,
                {filter: (structure) => {
                return (!structure.my && 
                structure.structureType != STRUCTURE_ROAD &&
                structure.structureType != STRUCTURE_KEEPER_LAIR &&
                typeof(structure.owner) != 'undefined' &&
                structure.structureType != STRUCTURE_CONTROLLER)}});
                
            this.World[room.name].sourceKeepers = 
                room.find(FIND_STRUCTURES,
                {filter: (structure) => {
                return structure.structureType == STRUCTURE_KEEPER_LAIR}});
            this.World[room.name].hostileCreeps = room.find(FIND_HOSTILE_CREEPS);
            this.World[room.name].exits = room.find(FIND_EXIT, {filter: (position) => {return Game.map.getTerrainAt(position.pos, room.name) != 'wall'}});
            console.log(this.World[room.name].exits);
            this.World[room.name].myTowers = room.find(STRUCTURE_TOWER, {filter: (structure) => {return (structure.my)}});
            
            if(typeof(room.controller) != 'undefined' && room.controller.my){
                this.World[room.name].upgradeableController = room.controller;
                if(this.GlobalControl < room.controller.level){
                    this.GlobalControl = room.controller.level;
                }
            }
            else{
                this.World[room.name].upgradeableController = null;
            }
            
            this.World[room.name].returnStructures = room.find(FIND_STRUCTURES, {
                filter: (structure) => { 
                    return structure.energy < structure.energyCapacity && structure.my && (structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION);
                }
            });
            
            this.World[room.name].harvestSlots = [];
            
            //Assemble the slots
            for(var source of this.World[room.name].sources){
                var numSlots = 0;
                
                for(var x = -1; x <= 1; x++){
                    for(var y = -1; y <= 1; y++){
                        if(Game.map.getTerrainAt(source.pos.x + x, source.pos.y + y, room.name) != 'wall'){
                            numSlots++;
                            this.TotalSlots++;
                        }
                    }
                }
                this.World[room.name].harvestSlots.push(numSlots);
            }
        }
        
        for(var creepIndex in Game.creeps){
            var creep = Game.creeps[creepIndex];
            if(creep.memory.harvestRoom == 'undefined' || typeof(creep.memory.harvestRoom) == 'undefined' || creep.memory.harvestRoom == 0 || creep.memory.harvesting == false){
                continue;
            }
            if(typeof(this.World[creep.memory.harvestRoom]) != 'undefined'){
                this.World[creep.memory.harvestRoom].harvestSlots[creep.memory.harvestSource] = this.World[creep.memory.harvestRoom].harvestSlots[creep.memory.harvestSource] - 1;
            }
        }
        
        for(var s in Game.spawns){
            if(Game.spawns[s].energy == Game.spawns[s].energyCapacity){
                this.MaxEnergy = true;
            }
        }
    },
    
    ChooseAClass: function(energy){
        var choice = Math.min(this.UpgraderDemand(), this.HarvesterDemand(),
        this.BuilderDemand(), this.FootmanDemand(), this.ArcherDemand(), this.CarrierDemand(energy));
        
        if(choice == this.HarvesterDemand()){
            return "harvester";
        }
        else if (choice == this.BuilderDemand()){
            return "builder";
        }
        else if (choice == this.UpgraderDemand()){
            return "upgrader";
        } else if (choice == this.ArcherDemand()){
            return "archer"
        }
        else if (choice == this.FootmanDemand()){
            return "footman";
        }else if(choice == this.CarrierDemand()){
            return "carrier";
        }else if (choice == this.ClaimerDemand(energy)){
            return "claimer";
        }
    },
    
    ArcherDemand: function(){
        return this.numArchers * 48;
    },
    
    UpgraderDemand: function(){
        return this.numUpgraders * 18;
    },
    
    HarvesterDemand: function(){
        return this.numHarvesters * 6;
    },
    BuilderDemand: function(){
        return this.numBuilders * 18;
    },
    FootmanDemand: function(){
        return this.numFootmen * 48;
    },
    CarrierDemand: function(){
        return 24 + this.numCarriers * 36 - this.numHarvesters*12;
    },
    
    ClaimerDemand: function(energy){
        if(this.GlobalControl >= 7 || energy < 650){
            return 99999;
        }
        else{
            return 99999 * this.numClaimers;
        }
    },
    
    
    TallyPopulation: function(){
        this.numHarvesters = 0;
        this.numUpgraders = 0;
        this.numFootmen = 0;
        this.numBuilders = 0;
        this.numArchers = 0;
        this.numCarriers = 0;
        this.numClaimers = 0;
        
        for(var i in Game.creeps){
            var creep = Game.creeps[i];
            
            if(creep.memory.role == "harvester"){
                this.numHarvesters++;
            }
            else if(creep.memory.role == "upgrader"){
                this.numUpgraders++;
            }
            else if(creep.memory.role == "builder"){
                this.numBuilders++;
            }
            else if(creep.memory.role == "footman"){
                this.numFootmen++;
            } else if(creep.memory.role == "archer"){
                this.numArchers++;
            } else if(creep.memory.role == "carrier"){
                this.numCarriers++;
            } else if (creep.memory.role == "claimer"){
                this.numClaimers++;
            }
        }    
    },
    
    GetHarvestersPopulation: function(){
        return this.numHarvesters;
    },
    
    GetTotalPopulation: function(){
        return GetHarvestersPopulation();
    }
};