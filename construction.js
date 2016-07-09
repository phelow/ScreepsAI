/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('construction');
 * mod.thing == 'a thing'; // true
 */
 
module.exports = {
	buildRoads: function(from, to)
	{
		var path = Game.spawns.Spawn1.room.findPath(from, to, { ignoreCreeps: true });
		for(var i in path)
		{
			var result = Game.spawns.Spawn1.room.createConstructionSite(path[i].x, path[i].y, STRUCTURE_ROAD);
		}
	},
	
	buildExtensions: function()
	{
		for(var spawn in Game.spawns)
		{
		    var sources = Game.spawns[spawn].room.find(FIND_SOURCES);
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
	},
	

	buildRoadToAllSources: function()
	{
		var sources = Game.spawns.Spawn1.room.find(FIND_SOURCES);
		for(var i in sources)
		{
		    var extensions = Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES);
		    for(var e in extensions){
			    this.buildRoads(extensions[e].pos, sources[i].pos);
		    }
			this.buildRoads(Game.spawns.Spawn1.pos, sources[i].pos);
		}
		
		
	},
};