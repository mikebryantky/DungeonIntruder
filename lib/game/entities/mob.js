ig.module(
    'game.entities.mob'
)

.requires(
    'impact.entity',
    'game.entities.fireball'
)

.defines(function () {
    EntityMob = ig.Entity.extend({
	    beginningHealth: 25,
        health: 25,
        damage: 10,
        name: 'Mob',

        lastXDir: 'left',
        lastYDir: 'up,',
        hitSound: new ig.Sound( 'media/sounds/ogre5.*' ),
		dieSound: new ig.Sound( 'media/sounds/ogre4.*' ),
		
        maxVel: {x: 150, y: 150},
        speed: 20,
        friction: {x: 200, y: 200},
        bounciness: 100,
        animSheet: new ig.AnimationSheet('media/images/spriggan.png', 16, 16),
        flipX: false,
        flipY: false,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('walk', .07, [0]);
        },

        update: function() {
            if(this.flipX) {
                this.vel.x = -this.speed;

            } else {
                var xMove = Math.floor((Math.random()*10)+1);
                if(xMove == 1) {
                    this.vel.x = -this.speed;
                } else {
                    this.vel.x = this.speed;
                }
            }

            if(this.flipY){
                this.vel.y = -this.speed;
            } else {
                var yMove = Math.floor((Math.random()*10)+1);
                if(yMove == 1) {
                    this.vel.y = -this.speed;
                } else {
                    this.vel.y = this.speed;
                }
            }

            this.parent();
        },

        handleMovementTrace: function(res) {
            this.parent(res);

            if(res.collision.x) {
                this.flipX = !this.flipX;
            }

            if(res.collision.y) {
                this.flipY = !this.flipY;
            }
        },

        check: function(other) {
            other.receiveDamage(this.damage, this);
        },

        receiveDamage: function(amount, from) {
			this.hitSound.volume = 1
			this.hitSound.play();
            
			this.parent(amount, from);
        },

        kill: function() {
            this.parent();
			
			this.dieSound.volume = 1
			this.dieSound.play();
			
            EntityFireball.prototype.increaseDamage();
			
			var mobs = ig.game.getEntitiesByType( EntityMob );
			if(mobs.length == 0) {
			    ig.game.newLevel();
			}
        },
		
		resetGame: function() {
		    this.health = this.beginningHealth;
		},
		
		newLevel: function() {
	           this.health = Math.ceil(EntityPlayer.prototype.level * this.beginningHealth);
		}

    });
});

