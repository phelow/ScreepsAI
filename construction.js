/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('construction');
 * mod.thing == 'a thing'; // true
 */
 
module.exports = {
	buildExtensions: function(sources)
	{
		for(var spawn in sources)
		{
		    for(var source in sources)
		    {
        		var spawnPos= sources[source].pos;
        		//TODO: pick better spawn points
        		var xOffset = Math.round(Math.random() * 10 -5);
        		var yOffset = Math.round(Math.random() * 10 -5);
                var result = Game.spawns.Spawn1.room.createConstructionSite(spawnPos.x + xOffset, spawnPos.y + yOffset, STRUCTURE_TOWER);
                var result = Game.spawns.Spawn1.room.createConstructionSite(spawnPos.x + xOffset, spawnPos.y + yOffset, STRUCTURE_SPAWN);
        		
                var result = Game.spawns.Spawn1.room.createConstructionSite(spawnPos.x + xOffset, spawnPos.y + yOffset, STRUCTURE_EXTENSION);
		    }
           
		}
	}
};