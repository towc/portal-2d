function Game(){
    this.controls = new Controls();
    
    this.drawer = new Drawer(this);
    
    this.currMap = 0;
    
    this.blockSize = 40;
    this.maps = [
        {blocks:[[2,2,2,2,2,2,2],[2,0,0,0,0,0,2],[2,0,0,0,7,0,2],[2,1,1,1,1,1,2],[2,2,2,2,2,2,2]],tileData:[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],enemies:[],playerPos:{x:2,y:2},textTips:[{x:2,y:1,c:"Arrows or WASD to move",s:11}],hasPortals:false,hasGuns:false},
        {blocks:[[2,2,2,2,2,2,2],[2,0,0,0,7,0,2],[2,0,0,1,1,1,2],[2,2,1,1,1,1,2],[2,2,2,2,2,2,2]],tileData:[[0,0,0,0,0,0,0],[0,0,0,0,6,0,0],[0,0,0,5,9,6,0],[0,0,5,11,11,7,0],[0,0,0,0,0,0,0]],enemies:[],playerPos:{x:1,y:2},textTips:[{x:3,y:3,c:"Up or W to jump",s:11}],hasPortals:false,hasGuns:false},
        {blocks:[[2,2,2,2,2,2,2,2,2,2],[2,0,0,0,0,0,0,0,0,2],[2,0,0,0,0,0,0,7,0,2],[2,0,0,0,0,0,1,1,1,2],[2,0,0,1,0,0,1,1,1,2],[2,1,1,1,1,1,1,1,1,2],[2,2,2,2,2,2,2,2,2,2]],tileData:[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]],enemies:[],playerPos:{x:2,y:3},textTips:[],hasPortals:false,hasGuns:false},
        {blocks:[[2,2,2,2,2,2,2,2,2,2],[2,0,0,0,0,0,0,0,0,2],[2,0,0,0,0,0,0,7,0,2],[2,1,1,0,0,0,1,1,1,2],[2,0,0,1,0,1,0,0,0,2],[2,0,0,1,8,1,0,1,0,2],[2,2,2,2,2,2,2,2,2,2]],tileData:[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,5,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]],enemies:[{x:1,y:5,t:10},{x:7,y:4,t:10}],playerPos:{x:1,y:2},textTips:[{x:6,y:5,c:"say hi to turret",s:9},{x:3,y:5,c:"meet acid: it kills you",s:9}],hasPortals:false,hasGuns:false},
        {blocks:[[2,2,2,2,1,1,2,2,2,2],[2,0,0,0,0,0,0,0,0,2],[2,0,0,0,0,0,0,7,0,2],[2,0,0,0,2,2,2,2,2,2],[2,0,0,0,0,0,0,0,1,2],[2,0,0,0,0,0,0,0,1,2],[2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2]],tileData:[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,12,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]],enemies:[],playerPos:{x:2,y:4},textTips:[{x:2,y:6,c:"Q/A or Q/E to shoot the respective portals",s:10},{x:2,y:7,c:"they can only land on white blocks",s:10}],hasPortals:true,hasGuns:true},
        {blocks:[[2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,0,0,0,0,0,2,0,0,0,0,0,0,2],[2,0,0,0,0,0,2,0,0,0,0,0,0,2],[2,0,0,0,0,0,2,0,7,0,0,0,0,2],[2,2,2,2,0,0,2,2,2,2,0,0,0,2],[2,2,2,2,0,0,0,0,0,0,0,0,0,2],[2,2,2,2,0,0,0,2,4,4,2,0,0,2],[2,2,2,2,0,0,0,2,2,2,0,0,2,2],[2,2,2,2,0,0,0,0,0,0,0,2,2,2],[2,2,2,2,4,4,4,4,4,4,4,2,2,2]],tileData:[[0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,13,13,0,0,0,0,0,0,0,0,0,0,0],[0,13,13,0,0,0,0,0,0,0,0,0,0,0],[0,13,13,0,0,0,0,0,13,13,0,0,13,0],[0,13,13,0,0,0,0,0,0,0,0,13,13,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0]],enemies:[],playerPos:{x:2,y:3},textTips:[{x:6,y:1,c:"slimy blocks make you bounce and lessen friction",s:10}],hasPortals:false,hasGuns:false},
        {blocks:[[2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,0,0,0,0,0,0,0,0,0,0,0,0,2],[2,0,0,0,0,0,0,0,0,0,0,0,0,2],[2,0,0,0,0,0,0,0,0,0,0,0,0,2],[2,0,0,0,0,0,0,0,0,0,0,7,0,2],[2,2,2,2,2,5,5,5,5,2,2,2,2,2],[2,2,2,2,2,0,0,0,0,2,2,2,2,2],[2,2,2,2,2,0,0,0,0,2,2,2,2,2],[2,2,2,2,2,0,0,0,0,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2]],tileData:[[0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,13,13,13,0,0,0,0,0,0,13,13,13,0],[0,13,13,13,0,0,0,0,0,0,13,13,13,0],[0,13,13,13,0,0,0,0,0,0,13,13,13,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0]],enemies:[{x:6,y:8,t:10}],playerPos:{x:2,y:3},textTips:[{x:1,y:6,c:"shoot with space",s:10},{x:5,y:2,c:"projectiles can go through glass",s:10},{x:9,y:7,c:"try killing the turret",s:10}],hasPortals:false,hasGuns:true},
        {blocks:[[2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,5,2,2,2,2,2,2],[2,2,2,2,2,2,2,5,2,2,2,2,2,2],[2,0,0,0,0,0,0,5,0,2,2,2,2,2],[2,0,0,0,0,0,0,5,0,0,0,0,1,2],[2,2,2,2,2,1,1,2,0,0,0,0,1,2],[2,0,0,0,0,0,0,6,0,0,0,0,1,2],[2,0,0,0,0,0,0,6,0,2,2,2,2,2],[2,0,0,7,0,0,0,6,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2]],tileData:[[0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,13,13,13,13,13,0,0,0,13,13,13,13,0],[0,0,0,0,0,0,0,0,0,13,13,13,13,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,13,13,13,13,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0]],enemies:[],playerPos:{x:2,y:4},textTips:[{x:1,y:1,c:"even portal projectiles can pass through glass",s:10},{x:1,y:5,c:"but they get destroyed by separators",s:10}],hasPortals:true,hasGuns:false}
    ]
    
    this.dictionary = {
        air: 0,
        white: 1,
        black: 2,
        slimyWhite: 3,
        slimyBlack: 4,
        glass: 5,
        separator : 6,
        door : 7,
        acid : 8
    }
    
    var dic = this.dictionary;
    
    this.transparent = [dic.air, dic.glass];
    this.solid = [dic.white, dic.black, dic.slimyWhite, dic.slimyBlack, dic.glass];
    this.settable = [dic.white, dic.slimyWhite];
    this.slimy = [dic.slimyWhite, dic.slimyBlack];
    this.portalRemoving = [dic.separator];
    this.finishing = [dic.door];
    this.killing = [dic.acid];
                      
    this.interacting = this.solid.concat(this.portalRemoving, this.finishing, this.killing);
        
    this.updateMs = 10;
        
    this.gravity = 0.3;
    
    this.eX = 0;
    this.eY = 0;
    
    this.firstTimePlayed = [];
    for(var i = 0; i < this.maps.length; ++i) this.firstTimePlayed.push(true);
    
    document.addEventListener('mousemove', function(e){
        game.eX = e.clientX / game.drawer.ratio;
        game.eY = e.clientY / game.drawer.ratio;
    })
}
Game.prototype = {
    //this is first fired from the drawer on Drawer.js, when all of the images have been loaded
    start: function(loop){
        this.controls.keys.reset = false;
        
        this.score = 0;
        
        var map = this.maps[this.currMap];
        
        
        
        this.map = map.blocks;
        this.tileData = map.tileData;
        
        this.ww = this.map[0].length*this.blockSize;
        this.hh = this.map.length   *this.blockSize;
        
        this.drawer.setLevel();
        this.drawer.el.gameOver.classList.remove('visible');
        
        this.player = new Player(map.playerPos.x * this.blockSize + 0.01, map.playerPos.y * this.blockSize + 0.01);
        
        this.npcs=[];
        this.bullets = [];
        this.lasers = [];
        
        this.enemiesObjs = map.enemies.slice(0);
        this.enemies = [];
        
        for(var i = 0; i < this.enemiesObjs.length; ++i){
            var obj = this.enemiesObjs[i];
            this.enemies.push(new Turret(obj.x * this.blockSize, obj.y * this.blockSize, obj.t * this.blockSize));
        }
        
        this.texts = map.textTips.slice(0);

        this.portalsEnabled = map.hasPortals;
        this.gunsEnabled = map.hasGuns;
        
        this.portals = [];
        
        this.portalTypes = [];
        this.transitions = [];
        
        this.firstTimePlayed[i]
        
        if(loop) this.unPause();
    },
    loop: function(){
        if(this.controls.keys.reset) return this.start(true);
        
        //keeps on looping if the game is paused
        if(this.running) window.requestAnimationFrame(this.loop.bind(this));
        else return false;
        
        var now = Date.now();
        this.elapsedTime += now - this.lastTick;
    
        
        //check if player is afk or changed tab
        if(this.elapsedTime > 100 * this.updateMs) return this.pause();
        
        this.player.checkShootDir();
        
        while(this.elapsedTime - this.updateMs >= 0){
            
            this.update();
            this.elapsedTime -= this.updateMs;
        }
        
        this.draw();
        
        this.lastTick = Date.now();
    },
    update: function(){
        this.player.update();
        for(var i=0; i<this.npcs.length; ++i){
            this.npcs[i].update();
        }
        for(var i=0; i< this.enemies.length; ++i){
            this.enemies[i].update();
        }
        
        var projectiles = this.bullets.concat(this.lasers);
        for(var i=0; i < projectiles.length; ++i){
            var bull = projectiles[i];
            bull.update();
            
            for(var j = 0; j < this.npcs.length; ++j){
                var npc = this.npcs[j];
                
                if(checkCollision(bull, npc)){
                    npc.kil();
                    
                    this.score += 1;
                    
                    //bull.pierce -= 1;
                }
            }
            
            if(checkCollision(bull, this.player) && bull.isEnemy) this.gameOver();
            
            if(!bull.isEnemy) 
                for(var j = 0; j < this.enemies.length; ++j){
                var en = this.enemies[j];
                    
                if(checkCollision(bull, en)){
                    
                    en.kill();
                    this.score += 2;
                }
            }
        }
        
        for(var i = 0; i < this.lasers.length; ++i){
            var ls = this.lasers[i];
            
            game.transitions.push(new Transition(
                ls.pos,
                ls.lastPos,
                'rgba(255, 0, 0, 0.5)',
                4,
                0.2
            ))
        }
        
        /*for(var i=0; i<this.portals.length; ++i){
            this.portals[i].update();
        }*/
        if(this.player.portal1) this.player.portal1.update();
        if(this.player.portal2) this.player.portal2.update();
    },
    draw: function(){
        this.drawer.draw();
    },
    stopBullet: function(bull){
        this.bullets.splice(this.bullets.indexOf(bull), 1);
    },
    stopLaser: function(laser){
        this.lasers.splice(this.lasers.indexOf(laser), 1);
    },
    gameOver: function(){
        this.running = false;
        
        this.drawer.gameOver();
    },
    pause: function(){
        this.running = false;
        
        this.drawer.pause();
    },
    unPause: function(){
        this.running = true;
        this.lastTick = Date.now();
        this.elapsedTime = 0;
        
        this.loop();
        
        this.drawer.unPause();
    },
    nextLevel: function(){
        ++this.currMap;
        
        this.start(true);
    }
};

function genLevel(){
    var ar = [];
    
    for(var i = 0; i < 20; ++i){
        ar.push([]);
        
        for(var j = 0; j < 30; ++j){
            
            var n = (Math.random() < 0.3 || i === 0 || i === 19 || j === 0 || j === 29) ? ((Math.random()*4)|0)+1 : 0;
            
            ar[i].push(n);
        }
    }
    
    return ar;
}
function getNullStr(w, h){
    var str = '['
    for(var i = 0; i < h; ++i){
        str+='[';
        for(var j = 0; j < w; ++j){
            var is = j < w-1;
            str+= '0' + (is ? ',' : '');
        }
        is = i < h-1;
        str+=']' + (is ? ',' : '');
    }
    return str + ']'
}
function getNullArr(w, h){
    var end = [];
    
    for(var i = 0; i < h; ++i){
        end.push([]);
        
        for(var j = 0; j < w; ++j){
            end[i].push(0);
        }
    }
    
    return end;
}