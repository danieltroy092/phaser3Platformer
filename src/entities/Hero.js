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

    // set collision box dimensions and center align.
    this.body.setSize(12, 40);
    this.body.setOffset(12, 23);

    // apply keyboard input to hero
    this.keys = scene.cursorKeys;
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    // horizontal Movement
    if (this.keys.left.isDown) {
      this.body.setVelocityX(-250);
      this.setFlipX(true); // invert sprite when pressed.
      this.body.offset.x = 8; // re-align collision box to centre when inverted
    } else if (this.keys.right.isDown) {
      this.body.setVelocityX(250);
      this.setFlipX(false); // reset inverted sprite.
      this.body.offset.x = 12; // reset collision box to centre.
    } else {
      this.body.setVelocityX(0);
    }
  }
}

export default Hero;
