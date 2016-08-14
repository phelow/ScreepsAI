/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roleHarvester');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    ChangeHarvestState: function(){
        var totalCarry = _.sum(creep.carry);
        
        //if we are at 0 carry, start harvesting
        if(totalCarry == 0){
            creep.Memory.harvesting = true;
        }
        //if we are at full carry start returning
        else if (totalCarry == creep.carryCapacity)
        {
            creep.Memory.harvesting = false;
        }
    },
    
    ChooseHarvestIndex: function(gameInfoManager){
        
    },
    
    ChooseReturnIndex: function(gameInfoManager){
        
    },
    
    Return: function(gameInfoManager){
        
    },
    
    Harvest: function(gameInfoManager){
        
    },
    
    Explore: function(gameInfoManager){
        
    },
    
    run: function(creep,gameInfoManager){
        this.ChangeHarvestState();
        
        if(this.harvesting){
            //harvest
            if(typeof(this.harvestRoom) == 'undefined'){
                this.ChooseHarvestIndex(gameInfoManager);
            }
            
            if(typeof(this.harvestRoom) == 'undefined')
            {
                if(typeof(this.exploreIndex) == 'undeined'){
                    this.ChooseExploreIndex();
                }
                
                this.Explore();
            }
            else{
                this.Harvest(gameInfoManager);
            }
        }
        else if(this.harvesting == false){
            //return to a dropoff
            if(typeof(this.returnRoom) == 'undefined'){
                this.ChooseReturnIndex(gameInfoManager);
            }
            this.Return(gameInfoManager);
        }
    }
};