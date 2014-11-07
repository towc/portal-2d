function Npc(x, y, pow){
    Body.call(this, x, y, 15, 15, .2, pow);
    
    this.wantsToJump=true;
    this.dir=((Math.random()<0.5)-0.5)*2;
    
    this.type = (Math.random()*3)|0;
}
Npc.prototype = Object.create(Body.prototype);

Npc.prototype.update = function(){
    this.vel.x = this.dir;
    
    this.updatePos();
}
Npc.prototype.allignX = function(){
    this.dir*=-1;
}
Npc.prototype.kill = function(){
    game.npcs.splice(game.npcs.indexOf(this), 1);
}

function Turret(x, y, trackingDist){
    Body.call(this, x, y, 15, 30, 0, 0);
    
    this.lastShot = Math.random()*100;
    
    this.trackingDist = trackingDist;
    this.tracking = false;
    this.dir = 0;
    
    this.shootSpeed = 3;
    this.accuracy = 10;
    
    this.frame = Math.random() < 0.5 ? 0 : .2;
}
Turret.prototype = Object.create(Body.prototype);

Turret.prototype.update=function(){
    var tCen = cen(this),
        pCen = cen(game.player);
    
    this.tracking = compareDist(tCen, pCen, this.trackingDist);
    
    if(this.tracking){
        var x = pCen.x - tCen.x,
            y = pCen.y - tCen.y;
        
        this.dir = Math.atan(y/x);
        
        if(isNaN(this.dir)) this.dir = 0;
        
        if(x < 0) this.dir += Math.PI;
        
        ++this.lastShot;
        if(this.lastShot >=100 ) this.shoot();
        
    }
    
    this.updatePos();
}
Turret.prototype.shoot = function(){
    this.lastShot = 0;
    
    var err=(Math.random()-0.5)/this.accuracy;
    
    game.lasers.push(new Bullet(cenX(this), cenY(this), Math.cos(this.dir+err)*this.shootSpeed, Math.sin(this.dir+err)*this.shootSpeed, true))
}
Turret.prototype.kill = function(){
    game.enemies.splice(game.enemies.indexOf(this), 1);
}
   
function Bullet(x, y, vX, vY, isEnemy){
    var sizeW = sizeH = 9;
    ProjectileBody.call(this, x - sizeW/2, y - sizeH/2, sizeW, sizeH, vX, vY);
    
    this.isEnemy = isEnemy;
}
Bullet.prototype = Object.create(ProjectileBody.prototype);

Bullet.prototype.update = function(){
    this.updatePos();
}

Bullet.prototype.stop = function(){
    this.isEnemy ? game.stopLaser(this) : game.stopBullet(this);
}

function Portal(x, y, side){
    this.side = side;
    
    var nextX = 0;
    if(side === 'left') nextX = 4;
    if(side === 'right') nextX = -4;
    
    var below = 1 + (game.settable.indexOf(
        game.map[game.player.getBlock(y + game.blockSize + 0.1)][game.player.getBlock(x + nextX)]
    ) > -1);
    
    var w = ['top', 'bottom'].indexOf(side) > -1 ? game.blockSize : 3,
        h = ['left', 'right'].indexOf(side) > -1 ? game.blockSize * below : 3;
    
    StillBody.call(this, x, y, w, h);
    
    this.destination = false;
    
    this.center = cen(this);
    
    this.rot = ['top', 'right', 'bottom', 'left'].indexOf(side);
    this.finalRot = 0;
}
Portal.prototype = Object.create(StillBody.prototype);

Portal.prototype.update = function(){
    if(!this.destination) return;
    var ent = [game.player].concat(game.npcs, game.bullets, game.enemies);
    
    for(var i = 0; i < ent.length; ++i){
        
        if(checkCollision(this, ent[i]) && ent[i].inPortal !== this){
            
            game.transitions.push(new Transition(Object.create(this.center), Object.create(this.destination.center), 'rgba(200, 255, 200, 0.4)', ent[i].isPlayer ? 40 : 10, 2));
            
            var x = this.destination.pos.x, y = this.destination.pos.y;
            switch(this.destination.rot){
                case 'top': y -= ent[i].size.h; break;
                case 'right': x += 0.1; break;
                case 'bottom': y += 0.1; break;
                case 'left': x -= ent[i].size.w; break;
            }
            ent[i].pos.set(x, y);
            ent[i].inPortal = this.destination;
            
            //changing entities' velocity
            var dir = Math.atan(ent[i].vel.y / ent[i].vel.x);
            
            if(isNaN(dir)) dir = 0;
            
            if(ent[i].vel.x < 0) dir *= -1;
            
            var dist = Math.sqrt(ent[i].vel.x * ent[i].vel.x + ent[i].vel.y * ent[i].vel.y);
            dir += (Math.PI*2 / this.finalRot);
            
            ent[i].vel.x = Math.cos(dir) * dist;
            ent[i].vel.y = Math.sin(dir) * dist;
            
            //changing entities' accelleration
            if(!ent[i].acc) return;
            dir = Math.atan(ent[i].acc.y / ent[i].acc.x);
            
            if(isNaN(dir)) dir = 0;
            
            if(ent[i].acc.x < 0) dir *= -1;
            
            dist = Math.sqrt(ent[i].acc.x * ent[i].acc.x + ent[i].acc.y * ent[i].acc.y);
            dir += (Math.PI*2 / this.finalRot);
            
            ent[i].acc.x = Math.cos(dir) * dist;
            ent[i].acc.y = Math.sin(dir) * dist;
            
        } else if(!checkCollision(this, ent[i]) && ent[i].inPortal === this) {
            ent[i].inPortal = false;
        }
    }
}
Portal.prototype.connect = function(p2){
    this.destination = p2;
    
    this.finalRot = this.destination.rot - this.rot;
}

function PortalBullet(par, prop){
    InstantProjectileBody.call(this, par.pos.x + par.size.w/2, par.pos.y + par.size.h/2, 9, 9, par.shootDir, par.shootDir);
    
    this.par = par; //parent
    this.prop = prop; //property
}
PortalBullet.prototype = Object.create(ProjectileBody.prototype);

PortalBullet.prototype.stop = function(side, block){
    if(game.settable.indexOf(block) > -1) this.par['createPortal' + this.prop](this, side);
    
    this.par.portalBullets.splice(this.par.portalBullets.indexOf(this), 1);
}