/// <reference path="../../typings/phaser.d.ts" />
import Phaser from 'phaser';

class Hero extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'hero-run-sheet', 0);

    // loading sprite onto canvas and applying game physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // assign animation to sprite.
    this.anims.play('hero-running');

    // set boundaries for game sprite not to fall off game scene.
    this.body.setCollideWorldBounds(true);

    this.body.setSize(12, 40); // set collision box dimensions
    this.body.setOffset(12, 23); // centre align sprite
    this.body.setMaxVelocity(250, 400); // set max velocity for X/Y axis.
    this.body.setDragX(750); // set deacceleration rate.

    // apply keyboard input functionality to hero
    this.keys = scene.cursorKeys;
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    // horizontal movement
    if (this.keys.left.isDown) {
      this.body.setAccelerationX(-1000);
      this.setFlipX(true); // invert sprite when pressed.
      this.body.offset.x = 8; // re-align collision box to centre when inverted
    } else if (this.keys.right.isDown) {
      this.body.setAccelerationX(1000);
      this.setFlipX(false); // reset inverted sprite.
      this.body.offset.x = 12; // reset collision box to centre.
    } else {
      this.body.setAccelerationX(0);
    }

    // doesnt allow double jump if sprite is on ground.
    if (this.body.onFloor()) {
      this.canDoubleJump = false;
    }

    // if sprite velocity is below 0 then set sprite state is NOT jumping
    if (this.body.velocity.y > 0) {
      this.isJumping = false;
    }

    // vertical movement
    const didPressJump = Phaser.Input.Keyboard.JustDown(this.keys.up);

    // Jump when up key is pressed and sprite is on floor or on an object
    if (didPressJump) {
      if (this.body.onFloor()) {
        this.isJumping = true;
        this.canDoubleJump = true; // Can double jump if hero is currently jumping
        this.body.setVelocityY(-400);
      } else if (this.canDoubleJump) {
        this.isJumping = true;
        this.canDoubleJump = false; // limits double jump feature to once per button pressed.
        this.body.setVelocityY(-300);
      }
    }

    // when up key is not pressed & sprite velocity is above 150 while jumping
    if (!this.keys.up.isDown && this.body.velocity.y < -150 && this.isJumping) {
      this.body.setVelocityY(-150); // reset back to 150
    }
  }
}

export default Hero;
