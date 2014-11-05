function Controls(){
    
    var names = ['left', 'up', 'right', 'down', 'shoot', 'pause', 'reset', 'throwP1', 'throwP2'];
    var keyCodes = [
        [37, 38, 39, 40, 32, 80, 82, 81, 65],
        [65, 87, 68, 83, 32, 27, 82, 81, 69]
        
    ];
    
    this.keys = {};
    
    this.codeObjects = []
    
    this.setting = parseInt(prompt('keyboar setting? Arrows = 0, WASD = 1', 0)) || 0;
    
    for(var i = 0; i < keyCodes.length; ++i){
        this.codeObjects.push({});
    }
    
    this.specials = ['pause', 'reset'];
    
    for(var name = 0; name < names.length; ++name){
        this.keys[names[name]] = false;
        
        for(var i = 0; i < keyCodes.length; ++i){
            this.codeObjects[i][keyCodes[i][name]] = names[name];
        }
    }
}
Controls.prototype = {
    press: function(key){
        
        game.controls.keys[ game.controls.codeObjects[game.controls.setting][key.keyCode] ] = true;
        
        switch(game.controls.codeObjects[game.controls.setting][key.keyCode]){
            case 'pause': game.running ? game.pause() : game.unPause(); break;
            case 'reset': if(!game.running) game.start(true); break;
            case 'throwP1': if(game.running) game.player.shootPortal(1); break;
            case 'throwP2': if(game.running) game.player.shootPortal(2); break;
        }
    },
    unPress: function(key){
        game.controls.keys[ game.controls.codeObjects[game.controls.setting][key.keyCode] ] = false;
    }
};