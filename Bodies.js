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
    
    this.frame = 0;
};
Body.prototype = {
    jump: function(){
        this.jumpt = true;
        this.updatesFromJump = 0;
        
        this.vel.y -= this.jumpPower*10;
        this.acc.y -= this.jumpPower;
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
        
        //if(this.pos.x > game.map[0].length * game.blockSize) return;
        this.notClipX(this.pos.x, this.pos.x += this.vel.x);
        
        //if(this.pos.y > game.map.length * game.blockSize) return;
        this.notClipY(this.pos.y, this.pos.y += this.vel.y, this.pos.x - this.vel.x);
        
        this.vel.x *= 0.92;
        this.acc.y *= 0.92;
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
            
                 if(game.map[y][newBlocks[0]])  this.collideX(oldBlocks[0] * game.blockSize);
            else if(game.map[yH][newBlocks[0]]) this.collideX(oldBlocks[0] * game.blockSize);
        } else if(oldBlocks[1] !== newBlocks[1]){
            
                 if(game.map[y][newBlocks[1]])  this.collideX((oldBlocks[1]+1) * game.blockSize - this.size.w -.001);
            else if(game.map[yH][newBlocks[1]]) this.collideX((oldBlocks[1]+1) * game.blockSize - this.size.w -.001);
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
        if(oldBlocks[0] !== newBlocks[0]){
            
                 if(game.map[newBlocks[0]][x])  this.collideY(oldBlocks[0] * game.blockSize);
            else if(game.map[newBlocks[0]][xW]) this.collideY(oldBlocks[0] * game.blockSize);
        } else if(oldBlocks[1] !== newBlocks[1]){
            
            if(this.jumpt) this.jumpt = false;
            
                 if(game.map[newBlocks[1]][x])  this.collideY((oldBlocks[1]+1) * game.blockSize - this.size.h -.001);
            else if(game.map[newBlocks[1]][xW]) this.collideY((oldBlocks[1]+1) * game.blockSize - this.size.h -.001);
                //not actually part of the algorithm, but still usefull
            else if(!this.jumpt) this.jumpt = true;
        }
    },
    getBlock: function(val){
        return (val / game.blockSize) | 0;
    },
    collideX: function(pos){
        this.vel.x = 0;
        this.acc.x *= 0.8;
        
        this.pos.x = pos;
        
        this.allignX();
    },
    collideY: function(pos){
        this.vel.y = 0;
        this.acc.y *= 0.8;
        
        this.pos.y = pos;
        
        this.allignY();
    },
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
            
            this.stop(side);
        }
        
        this.lastX = blockX;
        this.lastY = blockY;
    },
    getBlock: function(val){
        return (val / game.blockSize) | 0;
    },
    stop: function(){} 
}

function StillBody(x, y, w, h){
    this.pos = new Vec(x, y);
    
    this.size = {w:w, h:h};
    
    this.inPortal;
    
    this.frame = 0;
}
StillBody.prototype = {
    
}