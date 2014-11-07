function Game(){
    this.controls = new Controls();
    
    this.drawer = new Drawer(this);
    
    this.currMap = 0;
    
    this.blockSize = 40;
    this.maps = [
        
        [
            [[2,2,2,2,2,2,2],[2,0,0,0,0,0,2],[2,1,0,0,0,7,2],[2,1,1,1,1,1,2],[2,2,2,2,2,2,2]], //actual map
            getNullArr(7, 5), //tile data
            [], //turrets
            [2, 2], //player position
            [new Text(this.blockSize - 10, this.blockSize - 20, 'Arrows or WASD to move into the door', 11)], //text tips
            false, //has portals
            false //has gun
        ],[
            [[2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,0,0,0,0,0,0,0,0,0,0,0,0,2],[2,0,0,0,0,0,0,0,0,0,0,7,0,2],[2,0,0,0,0,0,0,0,0,0,1,1,1,2],[2,0,0,0,0,1,0,0,1,1,1,1,1,2],[2,0,0,0,1,1,0,0,1,1,1,1,1,2],[2,1,1,1,1,1,1,1,1,1,1,1,1,2],[2,1,1,1,1,1,1,1,1,1,1,1,1,2],[2,1,1,1,1,1,1,1,1,1,1,1,1,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2]],
            getNullArr(14, 10),
            [],
            [2, 5],
            [
                new Text(this.blockSize *2, this.blockSize *2, 'Press UP or W to jump up to 2 blocks', 11),
                new Text(this.blockSize * 2, this.blockSize *3, '(depends on your settings)', 9)
            ],
            false,
            false
        ],[[[2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,0,0,0,0,0,0,0,0,0,0,0,0,2],[2,0,0,0,0,0,0,0,0,0,0,0,0,2],[2,0,0,0,0,0,0,0,0,0,0,0,0,2],[2,0,0,0,0,0,0,0,0,0,0,7,0,2],[2,1,1,1,1,1,0,1,1,1,1,1,1,2],[2,0,0,0,0,1,8,1,0,0,0,0,0,2],[2,0,0,0,0,1,8,1,0,0,0,0,0,2],[2,0,1,0,0,1,8,1,0,0,1,0,0,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2]],getNullArr(14, 10),[new Turret(this.blockSize*2+0.01,this.blockSize*6+0.01,7),new Turret(this.blockSize*10+0.01,this.blockSize*7+0.01,7*this.blockSize)],[2,3],[new Text(this.blockSize*1.5,this.blockSize*1.5,'Those are turrets with a tracking distance of 7 blocks',10),new Text(this.blockSize*1.5,this.blockSize*2.5,' You don\'t want to get touched by their laser',11),new Text(this.blockSize*4,this.blockSize*7,'Here\'s some acid, in case you needed some',9)],false,false],
        [[[2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,0,0,0,0,0,1,1,0,0,0,0,0,2],[2,0,0,0,0,0,0,0,0,0,0,0,0,2],[2,0,0,0,0,0,0,0,0,0,0,7,0,2],[2,0,0,0,0,0,2,2,2,2,2,2,2,2],[2,0,0,0,0,0,0,0,0,0,0,0,1,2],[2,0,0,0,0,0,0,0,0,0,0,0,1,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,0,0,0,0,0,0,0,0,0,0,0,0,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2]],getNullArr(14, 10),[],[2,6],[new Text(this.blockSize*1.25,this.blockSize*8.25,'Press Q/A or Q/E to shoot portals, which can only be set on white blocks',10)],true,false],
        [[[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],[2,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],[2,1,1,1,1,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],[2,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,2],[2,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,2],[2,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,2],[2,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,2],[2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,2],[2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,2],[2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,2],[2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,2],[2,0,0,0,0,0,0,0,0,0,0,1,1,1,3,3,3,3,3,3,1,1,1,1,0,0,0,0,0,2],[2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],[2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],[2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],[2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],[2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],[2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],[2,2,2,2,2,2,2,4,4,4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]],getNullArr(30, 20),[],[2,2],[new Text(this.blockSize*6,this.blockSize*14,'green blocks make you bounce and have almost no friction',30)],false,false],
        [[[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],[2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],[2,0,0,2,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,2],[2,0,0,2,0,0,0,0,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,2],[2,0,0,2,0,0,0,0,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,2],[2,0,0,2,0,0,0,0,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,2],[2,2,2,2,5,5,5,2,2,2,2,2,2,1,1,2,0,0,0,0,2,2,5,5,2,0,0,0,0,2],[2,0,0,0,0,0,0,0,1,0,0,0,0,0,0,2,8,8,8,8,2,2,0,0,2,0,0,0,0,2],[2,0,0,0,0,0,0,0,1,0,0,0,0,0,0,2,8,8,8,8,2,2,0,0,2,0,0,0,0,2],[2,0,0,0,0,0,0,0,1,0,0,0,0,0,0,2,8,8,8,8,2,2,0,0,2,0,0,0,0,2],[2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,2,2,2,2,2,2,2,0,0,2,0,0,0,0,2],[2,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,2,0,0,0,0,2],[2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,1,0,0,0,0,2],[2,0,0,0,0,0,0,0,2,0,7,0,0,0,0,0,0,0,0,0,6,0,0,0,1,0,0,0,0,2],[2,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,2,0,0,0,0,2],[2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],[2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],[2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]],getNullArr(30, 20),[],[2,10],[],true,false]
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
        
        this.map = map[0];
        this.tileData = map[1]
        
        this.ww = this.map[0].length*this.blockSize;
        this.hh = this.map.length   *this.blockSize;
        
        this.drawer.setLevel();
        this.drawer.el.gameOver.classList.remove('visible');
        
        this.player = new Player(map[3][0] * this.blockSize + 0.01, map[3][1] * this.blockSize + 0.01);
        
        this.npcs=[];
        this.bullets = [];
        this.lasers = [];
        this.enemies = map[2].slice(0);
        this.texts = map[4].slice(0);
        
        this.portalsEnabled = map[5];
        this.gunsEnabled = map[6];
        
        this.portals = [];
        
        this.portalTypes = [];
        this.transitions = [];
        
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