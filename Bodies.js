function Vec(x, y){
    //vector
    
    this.x = x;
    this.y = y;
}
Vec.prototype = {
    update: function(x, y){
        this.x += x || 0;
        this.y += y || 0;
    },
    updateV: function(v){
        this.x += v.x;
        this.y += v.y;
    },
    reverseUpdateV: function(v){
        this.x -= v.x;
        this.y -= v.y;
    },
    set: function(x, y){
        this.x = x;
        this.y = y;
    }
}

function checkCollision(b1, b2){
    //aabb
    return !(
        b1.pos.x > b2.pos.x + b2.size.w ||
        b1.pos.x + b1.size.w < b2.pos.x ||
        
        b1.pos.y > b2.pos.y + b2.size.h ||
        b1.pos.y + b1.size.h < b2.pos.y
    )
}

function getDist(p1, p2){
    return Math.sqrt(
        (p2.x - p1.x) * (p2.x - p1.x) +
        (p2.y - p1.y) * (p2.y - p1.y)
    );
}

function compareDist(p1, p2, dist){
    return (
        ((p2.x - p1.x) * (p2.x - p1.x) +
        (p2.y - p1.y) * (p2.y - p1.y)) <= dist * dist
    )
}

function cenX(b){
    return b.pos.x + b.size.w/2;
}
function cenY(b){
    return b.pos.y + b.size.h/2;
}
function cen(b){
    return {x: cenX(b), y: cenY(b)};
}

function Body(x, y, sizeW, sizeH, speed, jumpPower){
    this.pos = new Vec(x, y);
    this.vel = new Vec(0, 0);
    this.acc = new Vec(0, 0);
    
    this.size = {w:sizeW, h:sizeH};
    
    this.speed = speed;
    
    this.jumpt = false;
    this.updatesFromJump = 0;
    this.wantsToJump = false;
    this.jumpPower = jumpPower;
    
    this.inPortal;
    this.isSlimy = false;
    
    this.frame = 0;
};
Body.prototype = {
    jump: function(){
        this.jumpt = true;
        this.updatesFromJump = 0;
        
        this.vel.y -= this.jumpPower*15;
    },
    getBlock:function(val){
        return (val / game.blockSize) | 0;
    },
    updatePos:function(){
        
        if(!this.jumpt) ++this.updatesFromJump;
        if(this.wantsToJump && this.updatesFromJump > 10 && !this.jumpt) this.jump();
        
        //gravity, which can't be added to other accelleration 
        this.vel.y += game.gravity;
        
        this.vel.updateV(this.acc);
        
        var blockX = this.getBlock(this.pos.x);
        var blockY = this.getBlock(this.pos.y);
        
        this.isSlimy = false;
        
        //if(this.pos.x > game.map[0].length * game.blockSize) return;
        this.notClipX(this.pos.x, this.pos.x += this.vel.x);
        
        //if(this.pos.y > game.map.length * game.blockSize) return;
        this.notClipY(this.pos.y, this.pos.y += this.vel.y, this.pos.x - this.vel.x);
        
        var perc = this.isSlimy ? 0.99 : 0.92;
        
        this.vel.x *= perc;
        this.acc.y *= perc;
        
        if(isNaN(this.acc.y)) this.acc.y = 0;
        if(isNaN(this.acc.x)) this.acc.x = 0;
        
        if(Math.abs(this.vel.x) < 0.01) this.vel.x = 0;
        if(Math.abs(this.vel.y) < 0.01) this.vel.y = 0;
    },
    notClipX: function(x, nX){
        var oldBlocks = [
            this.getBlock(x),
            this.getBlock(x + this.size.w)
        ];
        var newBlocks = [
            this.getBlock(nX),
            this.getBlock(nX + this.size.w)
        ];
        
        var y = this.getBlock(this.pos.y);
        var yH = this.getBlock(this.pos.y + this.size.h);
        var neg = nX < x;
        if(oldBlocks[0] !== newBlocks[0]){
            
                 if(game.interacting.indexOf(game.map[y][newBlocks[0]]) > -1)  this.collideX(oldBlocks[0] * game.blockSize, game.map[y][newBlocks[0]]);
            else if(game.interacting.indexOf(game.map[yH][newBlocks[0]]) > -1) this.collideX(oldBlocks[0] * game.blockSize, game.map[yH][newBlocks[0]]);
        } else if(oldBlocks[1] !== newBlocks[1]){
            
                 if(game.interacting.indexOf(game.map[y][newBlocks[1]]) > -1)  this.collideX((oldBlocks[1]+1) * game.blockSize - this.size.w -.001, game.map[y][newBlocks[1]]);
            else if(game.interacting.indexOf(game.map[yH][newBlocks[1]]) > -1) this.collideX((oldBlocks[1]+1) * game.blockSize - this.size.w -.001, game.map[yH][newBlocks[1]]);
        }
    },
    notClipY: function(y, nY, x){
        var oldBlocks = [
            this.getBlock(y),
            this.getBlock(y + this.size.h)
        ];
        var newBlocks = [
            this.getBlock(nY),
            this.getBlock(nY + this.size.h)
        ];
        
        var xW = this.getBlock(x + this.size.w);
        var x = this.getBlock(x);
        
        var neg = nY < y;
        //if(oldBlocks[0] !== newBlocks[0]){
            this.jumpt = false;
            
                 if(game.interacting.indexOf(game.map[newBlocks[0]][x]) > -1)  this.collideY(oldBlocks[0] * game.blockSize, game.map[newBlocks[0]][x]);
            else if(game.interacting.indexOf(game.map[newBlocks[0]][xW]) > -1) this.collideY(oldBlocks[0] * game.blockSize, game.map[newBlocks[0]][xW]);
            else this.jumpt = true;
        //} else if(oldBlocks[1] !== newBlocks[1]){
            
            this.jumpt = false;
            
                 if(game.interacting.indexOf(game.map[newBlocks[1]][x]) > -1)  this.collideY((oldBlocks[1]+1) * game.blockSize - this.size.h -.001, game.map[newBlocks[1]][x]);
            else if(game.interacting.indexOf(game.map[newBlocks[1]][xW]) > -1) this.collideY((oldBlocks[1]+1) * game.blockSize - this.size.h -.001, game.map[newBlocks[1]][xW]);
                //not actually part of the algorithm, but still usefull
            else this.jumpt = true;
        //}
    },
    getBlock: function(val){
        return (val / game.blockSize) | 0;
    },
    collideX: function(pos, block){
        this.collide(block);
        
        if(game.solid.indexOf(block) !== -1){
            if(this.isSLimy){
                this.vel.x *= -0.8;
                this.acc.x *= -0.2;
            }else{
                this.vel.x = 0;
                this.acc.x *= 0.8;
            }

            this.pos.x = pos;

            this.allignX();
        }
    },
    collideY: function(pos, block){
        this.collide(block);
        
        if(game.solid.indexOf(block) !== -1){
            if(this.isSlimy){
                this.vel.y *= -0.8;
                this.acc.y *= -0.2;
            }else{
                this.vel.y = 0;
                this.acc.y *= 0.8;
            }

            this.pos.y = pos;

            this.allignY();
        } else //if(this.vel.y > 0)
            this.jumpt = true;
    },
    collide: function(block){
        
        this.isSlimy = game.slimy.indexOf(block) > -1;
        
        if(this.isPlayer && game.portalRemoving.indexOf(block) > -1) this.removePortals();
        if(game.killing.indexOf(block) > -1) this.kill();
        if(this.isPlayer && game.finishing.indexOf(block) > -1) game.nextLevel();
    },
    kill: function(){},
    allignX:function(){},
    allignY:function(){}
}
function ProjectileBody(x, y, w, h, sX, sY){
    this.pos = new Vec(x, y);
    this.vel = new Vec(sX, sY);
    this.acc = new Vec(0, 0);
    
    this.size={w:w, h:h};
    
    this.inPortal;
    
    this.frame = 0;
    
    this.lastX = 0;
    this.lastY = 0;
    
    this.lastPos = new Vec(x, y);
}
ProjectileBody.prototype = {
    jump: function(){
        this.jumpt = true;
        this.updatesFromJump = 0;
        
        this.vel.y -= this.jumpPower;
    },
    getBlock:function(val){
        return (val / game.blockSize) | 0;
    },
    updatePos:function(){
        
        this.lastPos.x = this.pos.x;
        this.lastPos.y = this.pos.y;
        
        this.vel.updateV(this.acc);
        this.pos.updateV(this.vel);
        
        var blockX = this.getBlock(this.pos.x + this.size.w/2);
        var blockY = this.getBlock(this.pos.y + this.size.h/2);
        
        
        if(game.transparent.indexOf(game.map[blockY][blockX]) === -1){
            var side = 'bottom';
            
            if(this.lastX < blockX) side = 'left';
            else if(this.lastX > blockX) side = 'right';
            else if(this.lastY < blockY) side = 'top';
            
            this.lastX = blockX;
            this.lastY = blockY;
            
            this.stop(side, game.map[blockY][blockX]);
        }
        
        this.lastX = blockX;
        this.lastY = blockY;
    },
    getBlock: function(val){
        return (val / game.blockSize) | 0;
    },
    stop: function(){} 
}
function InstantProjectileBody(x, y, dir){
    ProjectileBody.call(this, x, y, 1, 1, Math.cos(dir), Math.sin(dir));
    
    this.hasHit = false;
    this.side = false;
    this.endBlock = false;
}
InstantProjectileBody.prototype = Object.create(ProjectileBody.prototype);

InstantProjectileBody.prototype.stop = function(side, block){
    this.hasHit = true;
    this.side = side;
    this.endBlock = block;
}
InstantProjectileBody.prototype.use = function(){
    while(!this.hasHit){
        this.updatePos();
    }
}

function StillBody(x, y, w, h){
    this.pos = new Vec(x, y);
    
    this.size = {w:w, h:h};
    
    this.inPortal;
    
    this.frame = 0;
}
StillBody.prototype = {
    
}

function Transition(p1, p2, color, width, decayStep){
    this.width = width;
    this.p1 = p1;
    this.p2 = p2;
    this.color = color;
    this.decayStep = decayStep;
}