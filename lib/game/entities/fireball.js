ig.module(
    'game.entities.fireball'
)

.requires(
    'impact.entity'
)


.defines(function () {
    EntityFireball = ig.Entity.extend({
        name: 'Fireball',
		beginningDamage: 5,
        damage: 5,
		beginningMaxDamage: 25,
        maxDamage: 25,
        damageIncrementValue: 5,

        size: {x: 5, y:3},
        animSheet: new ig.AnimationSheet('media/images/fireball-sm.png', 8, 8),
        maxVel: {x: 200, y: 200},
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.PASSIVE,

        init: function(x, y, settings) {
            this.parent(x, y, settings);

			var shootSound = new ig.Sound( 'media/sounds/foom_0.*' );
			shootSound.volume = .5;
			shootSound.play();
		
            if(settings.direction == 'left') {
                this.vel.x = -this.maxVel.x;
                this.vel.y = 0;
            } else if(settings.direction == 'right') {
                this.vel.x = this.maxVel.x;
                this.vel.y = 0;
            } else if(settings.direction == 'up') {
                this.vel.y = -this.maxVel.y;
                this.vel.x = 0;
            } else if(settings.direction == 'down') {
                this.vel.y = this.maxVel.y;
                this.vel.x = 0;
            }

            this.addAnim('idle', .2, [0]);
        },

        handleMovementTrace: function(res) {
            this.parent(res);

            if(res.collision.x || res.collision.y) {
                this.kill();
            }
        },

        check: function(other) {
            other.receiveDamage(this.damage, this);
            this.kill();
        },

        increaseDamage: function() {
            if(this.damage < this.maxDamage) {
                this.damage = this.damage + this.damageIncrementValue;
            }
        },
		
		resetGame: function() {
		    this.damage = this.beginningDamage;
			this.maxDamage = this.beginningMaxDamage;
		},
		
		newLevel: function() {
	           this.damage = this.beginningDamage + Math.floor( (EntityPlayer.prototype.level /1.5) * this.beginningDamage);
			   this.maxDamage = this.damage * 3;
		}

    });
});
