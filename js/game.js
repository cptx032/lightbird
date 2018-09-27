//////////////////////////////////////////////////////////////////////////////////////
// http://opengameart.org/content/background-voices

// http://opengameart.org/content/rpg-sound-pack
// http://opengameart.org/content/dark-ambiences
// http://opengameart.org/content/ghost
// http://opengameart.org/content/excited-horror-sound
// http://opengameart.org/content/4-atmospheric-ghostly-loops
//////////////////////////////////////////////////////////////////////////////////////
function randint(min, max)
{
	return ~~(min + ((max-min)*Math.random()));
}
function lerp(a, b, x) {
	return a + ((b-a)*x);
}
function enable_fullscreen()
{
	var elem = document.documentElement;
	if (elem.requestFullscreen)
	{
		elem.requestFullscreen();
	}
	else if (elem.msRequestFullscreen)
	{
		elem.msRequestFullscreen();
	}
	else if (elem.mozRequestFullScreen)
	{
		elem.mozRequestFullScreen();
	}
	else if (elem.webkitRequestFullscreen)
	{
		elem.webkitRequestFullscreen();
	}
}
var KMAP = {};
var UP_KEY = 38;
var DOWN_KEY = 40;
var LEFT_KEY = 37;
var RIGHT_KEY = 39;
var W_KEY = 87;
var S_KEY = 83;

var ON_KEY_DOWN = [];

document.documentElement.onkeydown = function(key)
{
	key = key || window.key;
	KMAP[key.keyCode] = true;
	for(var i=0; i < ON_KEY_DOWN.length; i++)
	{
		ON_KEY_DOWN[i](key);
	}
};
document.documentElement.onkeyup = function(key)
{
	key = key || window.key;
	KMAP[key.keyCode] = false;
};
//////////////////////////////////////////////////////////////////////////////////////
var INTRO_TEXT_PT = "Texto introdutório";
// fixme > profissional revision
var INTRO_TEXT_EN = "";
var INTRO_TEXT = INTRO_TEXT_PT;
var CROW_COLOR = 0x000000;
//////////////////////////////////////////////////////////////////////////////////////
var TextFader = function(game, x, y)
{
	// o valor que eh decrementado do alpha do texto
	this.velocity = 0.002;
	this.game = game;
	this.text = '';
	// o indice do texto
	this.index = 0;
	this.style = { font: "40px Times New Roman", fill: "#ffffff", align: "center" };
	this.sprite = this.game.add.text(x, y, this.text[0], this.style);
	this.sprite.anchor.set(0.5);
	this.sprite.alpha = 0;
	// 'in' quando eh fadein 'out' quando eh fadeout
	this.state = 'in'; // in|out
	// indica se a animacao chegou ao fim
	this.end = true;
};
TextFader.prototype.update = function()
{
	if(this.end) {
		return;
	}

	if(this.state == 'in')
	{
		this.sprite.alpha += this.velocity;
		if(this.sprite.alpha >= 0.5)
		{
			this.state = 'out';
		}
	}
	else if(this.state == 'out')
	{
		this.sprite.alpha -= this.velocity;
		if(this.sprite.alpha <= 0)
		{
			this.state = 'in';
			this.index += 1;
			if (this.index >= this.text.length) {
				this.end = true;
			}
			else {
				this.sprite.text = this.text[this.index];
			}
		}
	}
};
TextFader.prototype.restart = function(text)
{
	this.text = text.split('\n');
	this.index = 0;
	this.state = 'in';
	this.sprite.alpha = 0.0;
	this.sprite.text = this.text[0];
	this.end = false;
};
//////////////////////////////////////////////////////////////////////////////////////
var HorizontaTile = function(game, imageName)
{
	this.img_left = game.add.sprite(0,0,imageName);
	this.img_right = game.add.sprite(this.img_left.width,0,imageName);
	this.set_tint(0xe4b57b);
};
HorizontaTile.prototype.update = function()
{
	if(this.img_left.x < -this.img_left.width)
	{
		this.img_left.x = this.img_right.x + this.img_right.width;
	}
	if(this.img_right.x < -this.img_right.width)
	{
		this.img_right.x = this.img_left.x + this.img_left.width;
	}
};
HorizontaTile.prototype.scroll = function(value)
{
	this.img_left.x += value;
	this.img_right.x += value;
	this.update();
};
HorizontaTile.prototype.set_tint = function(value)
{
	this.img_left.tint = value;
	this.img_right.tint = value;
};
HorizontaTile.prototype.set_alpha = function(value)
{
	this.img_left.alpha = value;
	this.img_right.alpha = value;
};
//////////////////////////////////////////////////////////////////////////////////////
var SimpleParticle = function(game, x, y, vel, sprite_name)
{
	this.game = game;
	this.vel = vel;
	this.sprite = this.game.add.sprite(x, y, sprite_name);
	this.sprite.scale.setTo(4,4);
	this.sprite.anchor.setTo(0.5,0.5);
};
SimpleParticle.prototype.update = function()
{
	this.sprite.alpha -= 0.02;
	this.sprite.x += this.vel[0];
	this.sprite.y += this.vel[1];
};
var SimpleEmissor = function(game, x, y, max_particles, sprite_name)
{
	this.game = game;
	this.x = x;
	this.y = y;
	// if rotate is true the particles rotates in update function
	this.rotate = false;
	// if scale is true the particles scale down in update function
	this.scale = false;
	// when the particle dies it reborn with the following alpha
	this.max_alpha = 0.5;
	this.particles = [];
	for (var i=0;i<max_particles;i++)
	{
		var new_particle = new SimpleParticle(this.game, this.x, this.y, [-4,0], sprite_name);
		new_particle.sprite.alpha = Math.random();
		new_particle.sprite.tint = CROW_COLOR;
		this.particles.push( new_particle );
	}
};
SimpleEmissor.prototype.update = function()
{
	for(var i=0;i < this.particles.length; i++)
	{
		this.particles[i].update();
		if (this.particles[i].sprite.alpha <= 0.0)
		{
			this.particles[i].sprite.alpha = this.max_alpha;
			this.particles[i].sprite.x = this.x + (Math.random()*10);
			this.particles[i].sprite.y = this.y + (Math.random()*10);

			if(this.rotate) {
				this.particles[i].sprite.rotation += randint(10,12);
			}
		}
	}
};
SimpleEmissor.prototype.set_tint = function(value)
{
	for(var i=0; i < this.particles.length; i++)
	{
		this.particles[i].sprite.tint = value;
	}
};
SimpleEmissor.prototype.set_alpha = function(value)
{
	this.max_alpha = value;
};
SimpleEmissor.prototype.set_scale = function(value)
{
	for(var i=0; i< this.particles.length; i++)
	{
		this.particles[i].sprite.scale.setTo(value, value);
	}
};
SimpleEmissor.prototype.set_velocity = function(value)
{
	for(var i=0; i < this.particles.length; i++)
	{
		this.particles[i].vel = value;
	}
};
//////////////////////////////////////////////////////////////////////////////////////
var DemonHand = function(game)
{
	this.game = game;
	this.sprite = this.game.add.sprite(500,this.game.world.height,'demonhand',8);
	this.sprite.alpha = 1.0;
	this.sprite.anchor.setTo(0.5, 0.0);
	this.sprite.animations.add('handfly');
	this.state = 'dead'; // live|dead
};
DemonHand.prototype.stop_animation = function()
{
	this.sprite.animations.currentAnim.stop();
	this.sprite.alpha = 1.0;
	this.sprite.y = this.game.world.height;
	this.state = 'dead';
};
DemonHand.prototype.alpha_tween = function()
{
	var t = this.game.add.tween(this.sprite);
	t.to({ alpha: 0.0 }, randint(1300,2200), 'Linear');
	t.onComplete.add(this.stop_animation, this);
	t.start();
};
DemonHand.prototype.start = function()
{
	this.state = 'live';
	var tween = this.game.add.tween( this.sprite );
	tween.to({ y: this.game.world.height-this.sprite.height-15 }, 800, 'Linear');
	tween.onComplete.add(this.alpha_tween, this);
	tween.start();
	this.sprite.animations.currentAnim.play(randint(8,12), true);
};
var DemonHandGroup = function(phase, max_hands)
{
	if(!max_hands) {
		max_hands = 5;
	}
	this.phase = phase;
	this.hands = [];
	for (var i=0; i < max_hands; i++)
	{
		var hand = new DemonHand(this.phase.game);
		this.hands.push(hand);
	}
	this.delay = 20;
	this.delay_counter = 0;
};
DemonHandGroup.prototype.update = function()
{
	this.delay_counter += 1;
	if (this.delay_counter < this.delay) {
		return;
	}

	this.delay_counter = 0;
	var spacing = 120;
	if ( this.phase.crow.sprite.y >= (this.phase.game.world.height-this.hands[0].sprite.width - spacing) )
	{
		for (var i=0; i < this.hands.length; i++)
		{
			if ( this.hands[i].state == 'dead' )
			{
				this.hands[i].sprite.x = this.phase.crow.sprite.x + randint(350, 450);
				this.hands[i].start();
				break;
			}
		}
	}
};
DemonHandGroup.prototype.overlapping = function()
{
	var crow_bounds = this.phase.crow.sprite.getBounds();
	for (var i=0; i < this.hands.length; i++)
	{
		if (Phaser.Rectangle.intersects(this.hands[i].sprite.getBounds(), crow_bounds)) {
			return true;
		}
	}
	return false;
};
DemonHandGroup.prototype.scroll = function(value)
{
	for(var i=0; i<this.hands.length; i++)
	{
		if(this.hands[i].state == 'live')
		{
			this.hands[i].sprite.x += value;
		}
	}
};
//////////////////////////////////////////////////////////////////////////////////////
var MenuButton = function(game, x, y, text, event, event_parent)
{
	this.game = game;
	this.style = { font: "40px Times New Roman", fill: "#ffffff", align: "left" };
	this.button = this.game.add.text(x, y, text, this.style);
	this.button.alpha = 0.0;
	this.button.inputEnabled = true;
	this.button.anchor.set(0.0);
	var initial_tween = this.game.add.tween(this.button);
	initial_tween.to( { alpha: 0.5 }, 2000, "Linear", true);
	initial_tween.onComplete.add(
		function()
		{
			this.button.events.onInputOver.add(
				function()
				{
					this.__mouse_over(this.button);
				},
			this);
			this.button.events.onInputOut.add(
				function()
				{
					this.__mouse_leave(this.button);
				},
			this);
			this.button.events.onInputDown.add(event, event_parent);
		},
	this);
};
MenuButton.prototype.__mouse_over = function(button)
{
	this.game.add.tween(button).to( { alpha: 0.8 }, 500, "Linear", true);
	document.body.style.cursor = 'pointer';
};
MenuButton.prototype.__mouse_leave = function(button)
{
	this.game.add.tween(button).to( { alpha: 0.5 }, 500, "Linear", true);
	document.body.style.cursor = 'default';
};
var MainMenu = function(phase)
{
	this.phase = phase;
	this.game = phase.game;
	this.canplay = false;
	this.play_button = new MenuButton(this.game, 100, 200, 'Iniciar', this.play_button_handler, this);
};
MainMenu.prototype.play_button_handler = function()
{
	this.play_button.button.kill();
	this.canplay = true;
	document.body.style.cursor = 'default';
	// this.phase.text.restart(INTRO_TEXT);
};
//////////////////////////////////////////////////////////////////////////////////////
var Crow = function(phase)
{
	this.phase = phase;
	this.game = phase.game;
	window.crow = this;
};
Crow.prototype.create = function()
{
	this.sprite = this.game.add.sprite(280,200,'crowfly',0);
	this.sprite.anchor.setTo(0.5, 0.5);
	this.sprite.scale.setTo(0.6, 0.6);
	this.sprite.alpha = 0.0;
	this.sprite.tint = CROW_COLOR;
	this.sprite.frame = 11;
	this.state = 'live';
	this.fly_animation = this.sprite.animations.add('fly');
	// this.fly_animation.play(55,true);
	var tween = this.game.add.tween(this.sprite);
	tween.to( { alpha: 0.8 }, 2000, "Linear", true);
	tween.onComplete.add(
		function(){
			this.emissor = new SimpleEmissor(this.game,this.sprite.x,this.sprite.y,10,'white');
			this.phase.show_help_controls();
		}, this);
	this.velocity = 4;
	this.smoke = null;
};
Crow.prototype.update = function()
{
	if(this.emissor)
	{
		this.emissor.x = this.sprite.x;
		this.emissor.y = this.sprite.y;
		this.emissor.update();
	}
	if(this.smoke)
	{
		this.smoke.x = this.sprite.x;
		this.smoke.y = this.sprite.y;
		this.smoke.update();
	}
	if (this.created())
	{
		this.sprite.y += 0.3;
		if (KMAP[UP_KEY] || KMAP[DOWN_KEY] || KMAP[W_KEY] || KMAP[S_KEY] || this.game.input.pointer1.isDown)
		{
			if(this.game.input.pointer1.isDown)
			{
				if(this.game.input.pointer1.y > this.sprite.y)
				{
					this.sprite.y += 1;
				}
				else if (this.game.input.pointer1.y < this.sprite.y) {
					if (this.sprite.y >= 20) {
						this.sprite.y -= 1;
					}
				}
			}
			else if (KMAP[UP_KEY] || KMAP[W_KEY]) {
				if (this.sprite.y >= 20) {
					this.sprite.y -= 1;
				}
			}
			else if (KMAP[DOWN_KEY] || KMAP[S_KEY]) {
				this.sprite.y += 1;
			}
			if (!this.fly_animation.isPlaying)
			{
				this.fly_animation.play(55, true);
			}
		}
		else {
			if(this.fly_animation.isPlaying)
			{
				this.fly_animation.stop();
				this.sprite.frame = 11;
			}
		}
		
		if (this.state == 'live' && this.phase.demonhands.overlapping())
		{
			this.state = 'dead';
			this.smoke = new SimpleEmissor(this.game,this.sprite.x,this.sprite.y,10,'smoke');
			this.smoke.set_scale(0.15);
			this.smoke.max_alpha = 1.0;
			this.smoke.rotate = true;
			this.game.add.tween(this.phase.bg.img_left).to( { alpha: 0.0 }, 4000, "Linear", true);
			var t = this.game.add.tween(this.phase.bg.img_right);
			t.to( { alpha: 0.0 }, 4000, "Linear", true);
			t.onComplete.add(function(){this.phase.create_end_text();}, this);
		}

		this.phase.demonhands.update();
		this.update_scrollable();
	}
};
Crow.prototype.update_scrollable = function()
{
	for(var i=0; i < this.phase.scrollable.length; i++)
	{
		if(this.phase.scrollable[i].scroll)
		{
			this.phase.scrollable[i].scroll(-this.velocity);
		}
		else
		{
			this.phase.scrollable[i].x -= this.velocity;
		}
	}
};
Crow.prototype.created = function()
{
	if (this.sprite) {
		return true;
	}
	else {
		return false;
	}
};
Crow.prototype.set_tint = function(value)
{
	if(this.created())
	{
		this.sprite.tint = value;
		this.emissor.set_tint(value);
	}
};
Crow.prototype.set_alpha = function(value)
{
	if(this.created())
	{
		this.sprite.alpha = value;
		this.emissor.set_alpha(value);
	}
};
//////////////////////////////////////////////////////////////////////////////////////
var phase01 = function(game){};
phase01.prototype = {
	preload: function()
	{
		// this.game.stage.backgroundColor = 0x333333;
		// this.game.stage.backgroundColor = 0xff0000;
		this.game.stage.backgroundColor = 0x000000;

		this.bg = new HorizontaTile(this.game, 'bg');

		// this.trees = new HorizontaTile(this.game, 'tree_group');
		// this.trees.scroll(200);
		this.grass = new HorizontaTile(this.game, 'gnd');

		this.text = new TextFader(this.game,640,this.game.world.centerY);

		// this.rain = this.game.add.sprite(0,0,'rain',0);
		// this.rain.fixedToCamera = true;
		// this.rain.scale.setTo(2,2);
		// this.rain_anim = this.rain.animations.add('fall');
		// this.rain_anim.play(20, true);

		this.flag = this.game.add.sprite(1000,350,'flag',0);
		this.flag.scale.setTo(-0.3,0.3);
		this.flag_animation = this.flag.animations.add('fla');
		this.flag_animation.play(20,true);

		this.music = this.game.add.audio('bg-music');
		this.music.loop = true;
		this.music.play();

		this.demonhands = new DemonHandGroup(this);
		
		// a flag that will be true when you click in 'play' button
		this.main_menu = new MainMenu(this);
		
		this.create_footer();
		this.crow = new Crow(this);

		// items that will be updated by the crow (in fly)
		this.scrollable = [this.grass, this.flag, this.demonhands];
	},
	create_footer: function()
	{
		this.footer = new MenuButton(this.game, this.game.world.width, this.game.world.height,
			'criado por willie lawrence',
			function(){
				window.location = "http://vls2.tk";
			}, this);
		this.footer.button.anchor.set(1.0);
		this.footer.button.style.font = "15px Times New Roman";
	},
	create: function()
	{	
	},
	hide_text: function()
	{
		this.game.add.tween(this.text).to( { alpha: 0.0 }, 4000, "Linear", true);
	},
	update: function()
	{
		this.crow.update();
		this.text.update();

		this.bg.scroll(-1.0);

		if(!this.crow.created() && (this.text.end) && this.main_menu.canplay) {
			this.crow.create();
		}

		if (this.key) {
			this.key.alpha = this.text.sprite.alpha;
		}

		if(this.end_text) {
			this.end_text.update();
		}
	},
	create_end_text: function()
	{
		this.final_text = new MenuButton(this.game, this.game.world.centerX, this.game.world.centerY,
			'lightbird',
			function(){
				window.location = "http://vls2.tk/lightbird.html";
			}, this);
		this.final_text.button.anchor.set(0.5);
	},
	show_help_controls: function()
	{
		if ("ontouchstart" in document.documentElement)
		{
			this.text.restart('toque na tela para fazer o pássaro voar');
		}
		else
		{
			this.text.restart('aperte a seta para cima para fazer o pássaro voar');
			this.key = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY-50,'key-up',0);
			this.key.anchor.setTo(0.5,1.0);
			this.key.scale.setTo(0.5,0.5);
			this.key.alpha = 0.0;
		}
	}
};