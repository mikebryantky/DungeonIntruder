ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
    'game.levels.main'
)
.defines(function(){

MyGame = ig.Game.extend({
		font: new ig.Font( 'media/04b03.font.png' ),
		bgMusic: new ig.Sound( 'media/sounds/Castlecall.*' , false ),
		gravity: 0,

		init: function() {
			// Initialize your game here; bind keys etc.
			ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
			ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
			ig.input.bind(ig.KEY.UP_ARROW, 'up');
			ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
			ig.input.bind(ig.KEY.X, 'shoot');

			ig.music.add(this.bgMusic);
			ig.music.volume = 0.25;
//			ig.music.play();

			this.loadLevel(LevelMain);
			
			this.showDebugInfo();
		},

		update: function() {
			// Update all entities and backgroundMaps
			// This is a test comment.
			this.parent();
		},

		draw: function() {
			// Draw all entities and backgroundMaps
			this.parent();

			// Add your own drawing code here
			var x = ig.system.width/2,
				y = ig.system.height - (ig.system.height - 5);

			this.font.draw( 'Dungeon Intruder v0.1 beta :: Arrow Keys to move, X to shoot.', x, y, ig.Font.ALIGN.CENTER );
		},

		resetGame: function() {
			EntityPlayer.prototype.resetGame();
			EntityFireball.prototype.resetGame();
			EntityMob.prototype.resetGame();
			
			this.showDebugInfo();
			
			this.loadLevel(LevelMain);
		},
	
		newLevel: function() {
			EntityPlayer.prototype.newLevel();
			EntityFireball.prototype.newLevel();
			EntityMob.prototype.newLevel();
			
			this.showDebugInfo();
			
			this.loadLevel(LevelMain);
		},
		
		showDebugInfo: function() {
		    console.info("level " + EntityPlayer.prototype.level + "    allowed shots: " +  EntityPlayer.prototype.allowedShots + "   friction: "  + EntityPlayer.prototype.friction.x + "   damage: " + EntityFireball.prototype.damage + "    max damage: " + EntityFireball.prototype.maxDamage + "   mob health: " + EntityMob.prototype.health);
			ig.show("Lvl", EntityPlayer.prototype.level);
			ig.show("Shots", EntityPlayer.prototype.allowedShots);
			ig.show("Frctn", EntityPlayer.prototype.friction.x);
			ig.show("Dmg", EntityFireball.prototype.damage);
			ig.show("Max Dmg", EntityFireball.prototype.maxDamage);
			ig.show("Mob Hlth", EntityMob.prototype.health);			
		}
});


// Start the Game with 60fps, a resolution of 500x330, scaled
// by a factor of 1
ig.main( '#canvas', MyGame, 60, 500, 330, 1 );

});
