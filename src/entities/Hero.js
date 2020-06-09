/// <reference path="../../typings/phaser.d.ts" />
import Phaser from 'phaser';

class Hero extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'hero-run-sheet', 0);

    //loading sprite onto canvas and applying game physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    //assign animation to sprite.
    this.anims.play('hero-running');

    //set boundaries for game sprite not to fall off game scene.
    this.body.setCollideWorldBounds(true);

    //set collision box dimensions and center align.
    this.body.setSize(12, 40);
    this.body.setOffset(12, 23);
  }
}

export default Hero;
