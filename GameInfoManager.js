
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
        this.roomsCache = []
        
        for(var spawnIndex in Game.spawns){
            this.roomsCache.push(Game.spawns[spawnIndex].room);
        }
        
        for(var creepIndex in Game.creeps){
            var creep = Game.creeps[creepIndex];
            this.roomsCache.push(Game.rooms[creep.room.name])
        }

        this.roomsCache = new Set(this.roomsCache);
        
        for(let room of this.roomsCache){
            this.World[room.name] = {};
            this.World[room.name].room = room;
            
            if(typeof(room.controller) == 'undefined' || room.controller.owner.username == 'keyboardkommander'){
                this.World[room.name].sources = room.find(FIND_SOURCES);
            }
            else
            {
                this.World[room.name].sources = new Set([]);
            }
            
            this.World[room.name].roomExits = room.find(FIND_EXIT);
            
            this.World[room.name].constructionSites = room.find(FIND_CONSTRUCTION_SITES,{filter: (site) => {return (site.my)}});
            this.World[room.name].droppedEnergy = room.find(FIND_DROPPED_RESOURCES);
            this.World[room.name].myStructures = room.find(FIND_STRUCTURES,{filter: (structure) => {return (structure.my)}});
            this.World[room.name].hostileCreeps = room.find(FIND_HOSTILE_CREEPS);
            this.World[room.name].hostileStructures = room.find(FIND_HOSTILE_STRUCTURES);
            
            if(typeof(room.controller) != 'undefined' && room.controller.my){
                this.World[room.name].upgradeableController = room.controller;
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
            
            this.World[creep.memory.harvestRoom].harvestSlots[creep.memory.harvestSource] = this.World[creep.memory.harvestRoom].harvestSlots[creep.memory.harvestSource] - 1;
        }
        
    },
    
    ChooseAClass: function(){
        var choice = Math.min(this.UpgraderDemand(), this.HarvesterDemand(), this.BuilderDemand(), this.FootmanDemand());
        
        if(choice == this.HarvesterDemand()){
            return "harvester";
        }
        else if (choice == this.BuilderDemand()){
            return "builder";
        }
        else if (choice == this.FootmanDemand()){
            return "footman";
        }
        else{
            return "upgrader";
        }
    },
    
    UpgraderDemand: function(){
        return this.numUpgraders * .2;
    },
    
    HarvesterDemand: function(){
        return this.numHarvesters * .02;
    },
    BuilderDemand: function(){
        return this.numBuilders * .3;
    },
    FootmanDemand: function(){
        return this.numFootmen * .02;
    },
    
    TallyPopulation: function(){
        this.numHarvesters = 0;
        this.numUpgraders = 0;
        this.numFootmen = 0;
        this.numBuilders = 0;
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