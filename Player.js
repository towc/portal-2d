function Player(x, y){
    Body.call(this, x, y, 20, 28, .15, game.gravity*1.8);
    
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
    
    var eX = game.eX - this.pos.x - this.size.w/2,
        eY = game.eY - this.pos.y - this.size.h/2;
                
    this.shootDir = Math.atan(eY/eX);
                
    if(eX < 0) this.shootDir += Math.PI;
                
    this.shootX = this.pos.x + this.size.w/2 + this.shootRange * Math.cos(this.shootDir);
    this.shootY = this.pos.y + this.size.h/2 + this.shootRange * Math.sin(this.shootDir);
}

Player.prototype.shoot = function(){
    if(!game.gunsEnabled) return;
    
    var rad = this.shootDir + (Math.random()-0.5)*this.shootAccuracy;
    game.bullets.push(new Bullet(this.pos.x + this.size.w/2, this.pos.y+this.size.h/2, Math.cos(rad)*this.bulletSpeed, Math.sin(rad)*this.bulletSpeed));
    
    this.timeSinceLastShoot = 0;
    
    this.vel.x -= Math.cos(rad)*this.bulletSpeed/10;
}
Player.prototype.shootPortal = function(which){
    if(game.portalsEnabled){
        var center = cen(this);
        
        var bull = new InstantProjectileBody(center.x, center.y, this.shootDir);
        
        bull.use();
        
        game.transitions.push(new Transition(center, bull.pos, which - 1 ? 'rgba(100, 100, 255, 0.4)' : 'rgba(255, 100, 100, 0.4)', 6, 0.1));
        
        if(game.settable.indexOf(bull.endBlock) > -1) this['createPortal' + which](bull);
    }
}
Player.prototype.createPortal1 = function(bull){
    var x = bull.lastX * game.blockSize,
        y = bull.lastY * game.blockSize;
    
    var side = bull.side;
    
    switch(side){
        case 'top': y -= 3; break;
        case 'right': x += game.blockSize; break;
        case 'bottom': y += game.blockSize; break;
        case 'left': x -= 3; break;
    }
    
    this.portal1 = new Portal(x, y, side);
    
    if(this.portal2){
        if(checkCollision(this.portal1, this.portal2)){
            this.portal2 = false;
           
        } else {
            this.portal2.connect(this.portal1);
            this.portal1.connect(this.portal2);
        }
    }
}
Player.prototype.createPortal2 = function(bull){
    var x = bull.lastX * game.blockSize,
        y = bull.lastY * game.blockSize;
    
    var side = bull.side;
    
    switch(side){
        case 'top': y -= 3; break;
        case 'right': x += game.blockSize; break;
        case 'bottom': y += game.blockSize; break;
        case 'left': x -= 3; break;
    }
    
    this.portal2 = new Portal(x, y, side);
    
    if(this.portal1){
        if(checkCollision(this.portal1, this.portal2)){
            this.portal1 = false;
        } else {
            this.portal1.connect(this.portal2);
            this.portal2.connect(this.portal1);
        }
    }
}
Player.prototype.removePortals = function(){
    this.portal1 = this.portal2 = false;
    this.portalBullets = [];
}
Player.prototype.kill = function(){
    game.gameOver();
}