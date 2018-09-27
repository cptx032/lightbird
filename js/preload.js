var preload = function(game){}
preload.prototype = {
	preload: function()
	{
		this.game.debug.text("CARREGANDO...",this.game.world.centerX,this.game.world.centerY);
		this.game.stage.backgroundColor = 0xeeeeee;
		var loadingBar = this.add.sprite(0,480,"loading");
		loadingBar.anchor.setTo(0.0,1.0);
		this.load.setPreloadSprite(loadingBar);
		this.game.load.image('tree01', 'assets/imgs/tree01.png');
		this.game.load.image('tree02', 'assets/imgs/tree02.png');
		this.game.load.image('gnd', 'assets/imgs/ground.png');
		this.game.load.image('particle', 'assets/imgs/particle.png');
		this.game.load.image('white', 'assets/imgs/white.bmp');
		this.game.load.image('key-up', 'assets/imgs/key-board-arrow.png');
		this.game.load.image('smoke', 'assets/imgs/smoke.png');

		this.game.load.image('bg', 'assets/imgs/bg.png');
		this.game.load.image('tree_group', 'assets/imgs/tree_group.png');
		this.game.load.spritesheet('flag', 'assets/imgs/flag.png',202,324);

		this.game.load.spritesheet('rain', 'assets/imgs/rain.png', 480, 270);
		this.game.load.spritesheet('crowfly', 'assets/imgs/crowfly.png', 86, 93);
		this.game.load.spritesheet('demonhand', 'assets/imgs/demonhand.png', 100, 88);

		this.game.load.audio('bg-music', 'assets/audio/churchbell.wav');
		this.game.load.audio('crowroar', 'assets/audio/crow.wav');
	},
	create: function()
	{
		this.game.state.start('Game');
	},
	update: function() {
		/*
		if (this.cache.isSoundDecoded('music') && this.ready == false) {
			this.ready = true;
			this.state.start('MainMenu');
		}
		*/
	}
}