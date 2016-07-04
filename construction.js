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
	    console.log("buidling road from:" + from + " to: " + to);
		var path = Game.spawns.Spawn1.room.findPath(from, to, { ignoreCreeps: true });
		for(var i in path)
		{
			var result = Game.spawns.Spawn1.room.createConstructionSite(path[i].x, path[i].y, STRUCTURE_ROAD);
			console.log(result);
		}
	},

	buildRoadToAllSources: function()
	{
	    console.log("buildRoadToAllSources");
		var sources = Game.spawns.Spawn1.room.find(FIND_SOURCES);
        console.log(sources + ":");
		for(var i in sources)
		{
		    console.log(sources[i].pos);
			this.buildRoads(Game.spawns.Spawn1.pos, sources[i].pos);
		}
	}
};