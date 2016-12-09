/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('PathManager');
 * mod.thing == 'a thing'; // true
 */

module.exports = { // store and reuse often used paths

    addPath: function(from, to, path) {
        if(from == to || typeof(from) == 'undefined'){
            return;
        }
        this.cleanCacheByUsage();
        var key = this.getPathKey(from, to);
        var cache = Memory.pathCache || {};
        var cachedPath = {
          path: path,
          uses: 1
        }
        cache[key] = cachedPath;
        Memory.pathCache = cache;
        this.addPath(path[1],to,path.slice(1,path.length));
    },

    getPath: function(from, to) {
        
        var cache = Memory.pathCache;
        if(cache) {
          var cachedPath = cache[this.getPathKey(from, to)];
          if(cachedPath) {
            cachedPath.uses += 1;
            Memory.pathCache = cache;
            return cachedPath;
          }
        }
        
      this.addPath(from,to,from.findPathTo(to));
      return this.getPath(from,to);
    },
    
    getNextStep: function(from, to){
        
        var path = this.getPath(from, to);
        
        return path['path'][0]; //plzfix
    },
    
    moveToNextStep: function(creep, to){
        var p = this.getNextStep(creep.pos,to);
        console.log(p);
        if(p){
            var code = creep.moveTo(p.x,p.y);
            
            if(code == -2){
                return creep.moveTo(to);
            }
            return code;
        }
        else{
            console.log("pathfinding failure");
            creep.moveTo(to);
            return;
            
        }
    },

    cleanCacheByUsage: function() {
        if(Memory.pathCache && _.size(Memory.pathCache) > 1500) { //1500 entries ~= 100kB
          var counter = 0;
          for (var key in Memory.pathCache) {
            var cached = Memory.pathCache[key];
            if(cached.uses === usage) {
              Memory.pathCache[key] = undefined;
              counter += 1;
            }
          }
        }
    },

  // require('pathCache').showCacheUsage();
  showCacheUsage: function() {
    var usageCountCounter = {};
    var howManyTimesCacheUsed = 0;
    for (var key in Memory.pathCache) {
      var cached = Memory.pathCache[key];
      usageCountCounter['used'+cached.uses] = usageCountCounter['used'+cached.uses] + 1 || 1;
      howManyTimesCacheUsed += cached.uses;
    }

    console.log(JSON.stringify(usageCountCounter));
    console.log('howManyTimesCacheUsed: ' + howManyTimesCacheUsed);
    console.log('cache size: ' + _.size(Memory.pathCache));
  },

  getPathKey: function(from, to) {
    //console.log("getPathKey= "+getPosKey(from) + '$' + getPosKey(to));
    return this.getPosKey(from) + '$' + this.getPosKey(to);
  },

  getPosKey: function(pos) {
    return pos.x + 'x' + pos.y + pos.roomName;
  }
};