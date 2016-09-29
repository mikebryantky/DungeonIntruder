ig.module(
    'game.entities.player'
)

.requires(
    'impact.entity',
    'game.entities.fireball'
)

.defines(function () {
    EntityPlayer = ig.Entity.extend({
        name: 'Max Throoput',
        health: 10,
        level: 1,
        lastState: 'idle',

        livesLeft: 3,
        startPos: {x: 300, y: 300},
        invincible: false,
        invincibleDelay: 2,
        invincibleTimer: null,

		allowedShots: 1,
		maxAllowedShots: 4,
        font: new ig.Font( 'media/04b03.font.png' ),
        dieSound: new ig.Sound( 'media/sounds/bubble.*'),
		
        accelGround: 100,
        accelAir: 100,
		minFriction: {x: 10, y: 10},
		beginningFriction: {x: 300, y: 300},
        friction: {x: 300, y: 300},
        bounciness: 0,
        animSheet: new ig.AnimationSheet('media/images/Hero.png', 16, 16),
        flip: false,
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.PASSIVE,

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('runUp', .07, [1, 3]);
            this.addAnim('runDown', .07, [5, 7]);
            this.addAnim('runSide', .07, [9, 11]);
            this.addAnim('idle', .75, [5, 7]);

            this.startPos.x = this.pos.x;
            this.startPos.y = this.pos.y;

            this.invincibleTimer = new ig.Timer();
            this.makeInvincible();
        },

        update: function() {
            // Move left or right
            var accel = this.standing ? this.accelGround : this.accelAir;

            if(ig.input.state('left')) {
                this.currentAnim = this.anims.runSide;
                this.accel.x = -accel;
                this.flip = false;
                this.lastState = 'left';
            } else if(ig.input.state('right')) {
                this.currentAnim = this.anims.runSide;
                this.accel.x = accel;
                this.flip = true;
                this.lastState = 'right';
            } else if(ig.input.state('up')) {
                this.currentAnim = this.anims.runUp;
                this.accel.y = -accel;
                this.flip = false;
                this.lastState = 'up';
            } else if(ig.input.state('down')) {
                this.currentAnim = this.anims.runDown;
                this.accel.y = accel;
                this.flip = false;
                this.lastState = 'down';
            } else {
                this.accel.x = 0;
                this.accel.y = 0;
                this.currentAnim = this.anims.idle;
                this.lastState = 'idle';
            }

            this.currentAnim.flip.x = this.flip;

            if(ig.input.pressed('shoot')) {
                if(this.lastState != 'idle') {
				    var fireballs = ig.game.getEntitiesByType( EntityFireball);
					if(fireballs.length < this.allowedShots) {
                        ig.game.spawnEntity(EntityFireball, this.pos.x, this.pos.y, {direction: this.lastState});
					}
                }
            }

            // Check timer
            if(this.invincibleTimer.delta() > this.invincibleDelay) {
                this.invincible = false;
                this.currentAnim.alpha = 1;
            }

            // Now move
            this.parent();
        },

        draw: function() {
            if(this.invincible) {
                this.currentAnim.alpha = this.invincibleTimer.delta() / this.invincibleDelay * 1;
            }

            this.parent();

            var x = ig.system.width/2,
                y = ig.system.height - 10;

			var mobs = ig.game.getEntitiesByType( EntityMob );
            this.font.draw("Level: " + this.level + "  Lives: " + this.livesLeft + "  Damage: " + EntityFireball.prototype.damage + "  Ogres: " + mobs.length, x, y, ig.Font.ALIGN.CENTER)  ;
        },

        receiveDamage: function(amount, from) {
            if(!this.invincible) {
                this.livesLeft = this.livesLeft - 1;
                if(this.livesLeft < 1) {
                    this.parent(amount, from);
                } else {
//                    this.pos.x = this.startPos.x;
//                    this.pos.y = this.startPos.y;
                }
            }
        },

        makeInvincible: function() {
            this.invincible = true;
            this.invincibleTimer.reset();
        },

        kill: function() {
            this.parent();
			
			this.dieSound.volume = 1;
			this.dieSound.play();
			
			ig.game.resetGame();
        },
		
		resetGame: function() {
		    this.level = 1;
			this.allowedShots = 1;
			this.friction = this.beginningFriction;
		},
		
		newLevel: function() {
	           this.level = this.level + 1;
			   
			   if(this.allowedShots < this.maxAllowedShots)  {
			       this.allowedShots = this.level;
			   }
			   
			   if(this.friction.x > this.minFriction.x) {
			       this.friction.x = this.friction.x - (this.level * 10);
			       this.friction.y = this.friction.y - (this.level * 10);
				   
				   if(this.friction.x < this.minFriction.x) {
					   this.friction.x = this.minFriction.x;
					   this.friction.y = this.minFriction.y;
				   }
			   }
		}

    });
});
