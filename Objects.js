function Player(x, y){
    Body.call(this, x, y, 20, 28, .15, game.gravity*1.6);
    
    this.jumpt = false;
    this.timeSinceLastShoot = 0;
    this.dir = 1;
    
    this.shootDir = 0;
    this.shootX = 0;
    this.shootY = 0;
    this.shootRange = 100;
    this.shootAccuracy = 0.1;
    this.bulletSpeed = 5;
    
    this.isPlayer = true;
    
    this.portal1; 
    this.portal2;
    
    this.portalBullets = [];
}
Player.prototype = Object.create(Body.prototype);

Player.prototype.update= function(){
    this.wantsToJump = game.controls.keys.up;
    if(game.controls.keys.left){
        this.vel.x -= this.speed;
        this.dir = -1;
    }
    if(game.controls.keys.down) this.vel.y += this.speed;
    if(game.controls.keys.right){
        this.vel.x += this.speed;
        this.dir = 1;
    }
    if(game.controls.keys.shoot && this.timeSinceLastShoot > 10) this.shoot();
    
    ++this.timeSinceLastShoot;
    
    for(var i = 0; i < this.portalBullets.length; ++i){
        this.portalBullets[i].updatePos();
    }
    
    this.updatePos();
}
Player.prototype.checkShootDir = function(){
    
    var eX = game.eX - this.pos.x,
        eY = game.eY - this.pos.y;
                
    this.shootDir = Math.atan(eY/eX);
                
    if(eX < 0) this.shootDir += Math.PI;
                
    this.shootX = this.pos.x + this.shootRange * Math.cos(this.shootDir);
    this.shootY = this.pos.y + this.shootRange * Math.sin(this.shootDir);
}

Player.prototype.shoot = function(){
    var rad = this.shootDir + (Math.random()-0.5)*this.shootAccuracy;
    game.bullets.push(new Bullet(this.pos.x + this.size.w/2, this.pos.y+this.size.h/2, Math.cos(rad)*this.bulletSpeed, Math.sin(rad)*this.bulletSpeed));
    
    this.timeSinceLastShoot = 0;
    
    this.vel.x -= Math.cos(rad)*this.bulletSpeed/10;
}
Player.prototype.shootPortal = function(which){
    this.portalBullets.push(new PortalBullet(this, which));
}
Player.prototype.createPortal1 = function(bull, side){
    var x = bull.lastX * game.blockSize,
        y = bull.lastY * game.blockSize;
    
    switch(side){
        case 'top': y -= 3; break;
        case 'right': x += game.blockSize; break;
        case 'bottom': y += game.blockSize; break;
        case 'left': x -= 3; break;
    }
    
    this.portal1 = new Portal(x, y, side);
    
    if(this.portal2){
        this.portal2.connect(this.portal1);
        this.portal1.connect(this.portal2);
    }
}
Player.prototype.createPortal2 = function(bull, side){
    var x = bull.lastX * game.blockSize,
        y = bull.lastY * game.blockSize;
    
    switch(side){
        case 'top': y -= 3; break;
        case 'right': x += game.blockSize; break;
        case 'bottom': y += game.blockSize; break;
        case 'left': x -= 3; break;
    }
    
    this.portal2 = new Portal(x, y, side);
    
    if(this.portal1){
        this.portal1.connect(this.portal2);
        this.portal2.connect(this.portal1);
    }
}

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

function Turret(x, y, dir){
    ProjectileBody.call(this, x, y, 20, 20, Math.random()-0.5, 0);
    
    this.lastShot = Math.random()*100;
    this.dir = dir;
    this.shootSpeed = 3;
    this.accuracy = 10;
    
    this.frame = Math.random() < 0.5 ? 0 : .2;
}
Turret.prototype = Object.create(ProjectileBody.prototype);

Turret.prototype.update=function(){
    ++this.lastShot;
    if(this.lastShot>=100) this.shoot();
    
    this.updatePos();
}
Turret.prototype.shoot = function(){
    this.lastShot = 0;
    
    var err=(Math.random()-0.5)/this.accuracy;
    
    game.bullets.push(new Bullet(this.pos.x + this.size.w/2, this.pos.y + this.size.h/2, Math.cos(this.dir+err)*this.shootSpeed, Math.sin(this.dir+err)*this.shootSpeed, true))
}
Turret.prototype.stop = function(){
    this.vel.x *= -1;
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
    game.stopBullet(this);
}

function Portal(x, y, side){
    this.side = side;
    console.log(side);
    var w = ['top', 'bottom'].indexOf(side) > -1 ? game.blockSize : 3,
        h = ['left', 'right'].indexOf(side) > -1 ? game.blockSize * 2 : 3;
    StillBody.call(this, x, y, w, h);
    
    this.destination = false;
    
    this.center = {x:this.pos.x + this.size.w/2, y:this.pos.y + this.size.h/2};
    
    this.rot = ['top', 'right', 'bottom', 'left'].indexOf(side);
    this.finalRot = 0;
}
Portal.prototype = Object.create(StillBody.prototype);

Portal.prototype.update = function(){
    if(!this.destination) return;
    var ent = [game.player].concat(game.npcs, game.bullets, game.enemies);
    
    for(var i = 0; i < ent.length; ++i){
        
        if(checkCollision(this, ent[i]) && ent[i].inPortal !== this){
            game.transitions.push([ent[i].pos.x, ent[i].pos.y, this.destination.center.x, this.destination.center.y, this.type, ent[i].isPlayer ? 40 : 10]);
            
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
    
    this.finalRot = (10 + this.destination.rot - this.rot)%4;
}

function PortalBullet(par, prop){
    ProjectileBody.call(this, par.pos.x + par.size.w/2, par.pos.y + par.size.h/2, 9, 9, Math.cos(par.shootDir) * 5, Math.sin(par.shootDir) * 5);
    
    this.par = par; //parent
    this.prop = prop; //property
}
PortalBullet.prototype = Object.create(ProjectileBody.prototype);

PortalBullet.prototype.stop = function(side){
    this.par['createPortal' + this.prop](this, side);
    
    this.par.portalBullets.splice(this.par.portalBullets.indexOf(this), 1);
}