/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('PathManager');
 * mod.thing == 'a thing'; // true
 */

module.exports = { // store and reuse often used paths


    cleanCacheByUsage: function() {
        if(Memory.pathCache && _.size(Memory.pathCache) > 15000) { //1500 entries ~= 100kB
          var counter = 0;
          var use = 9999;
          for (var key in Memory.pathCache) {
            var cached = Memory.pathCache[key];
            if(cached.uses < use) {
              use = cached.uses;
            }
          }
          
          for (var key in Memory.pathCache) {
            var cached = Memory.pathCache[key];
            if(cached.uses < use) {
              Memory.pathCache[key] = undefined;
              counter += 1;
            }
          }
        }
    },
    addPath: function(from, to, path) {
        
    
        
        if(from == to || typeof(from) == 'undefined'){
            return;
        }
        var key = this.getPathKey(from, to);
        var cache = Memory.pathCache || {};
        if(cache[key]){
            return;
        }
        
        
        var cachedPath = {
          path: path[0].direction,
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
        
        
      var path = from.findPathTo(to);
      if(path.length > 0){
        this.addPath(from,to,path);
      }
      return this.getPath(from,to);
    },
    
    getNextStep: function(from, to){
        
        var path = this.getPath(from, to);
        return path['path']; //plzfix
    },
    
    moveToNextStep: function(creep, to){
        if(creep.memory.manualMove == true){
            creep.say("Path Moving");
            return creep.moveTo(to);
        }
        
        var p = this.getPath(creep.pos,to);
        if(p['path']){
            //TODO: calculate future position and don't movethere if there's a creep there.
            //var code = creep.moveTo( p['path'].x, p['path'].y); //TODO: replace with directional move
            var code = creep.move(p['path']);
            
            
            if(code != 0){
                return creep.moveTo(to);
            }
            return code;
        }
        else{
            creep.moveTo(to);
            return;
            
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
  },

  getPathKey: function(from, to) {
    return this.getPosKey(from) + '$' + this.getPosKey(to);
  },

  getPosKey: function(pos) {
    return pos.x + 'x' + pos.y + pos.roomName;
  }
};