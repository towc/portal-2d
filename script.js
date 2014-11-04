;(function(){
    var game;
    
    window.addEventListener('load', function(){
        game=new Game();
        
        window.game = game;
        
        document.addEventListener('keydown', game.controls.press);
        document.addEventListener('keyup', game.controls.unPress);
    });
})();