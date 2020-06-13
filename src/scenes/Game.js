/// <reference path="../../typings/phaser.d.ts" />
import Phaser from 'phaser';
import Hero from '../entities/Hero';

class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // loading tilemap
    this.load.tilemapTiledJSON('level-1', 'assets/tilemaps/level-1.json');

    // loading tileset
    this.load.image('world-1-sheet', 'assets/tilesets/world-1.png');

    // loading spritesheet images
    this.load.spritesheet('hero-idle-sheet', 'assets/hero/idle.png', {
      frameWidth: 32,
      frameHeight: 64,
    });

    this.load.spritesheet('hero-run-sheet', 'assets/hero/run.png', {
      frameWidth: 32,
      frameHeight: 64,
    });

    this.load.spritesheet('hero-pivot-sheet', 'assets/hero/pivot.png', {
      frameWidth: 32,
      frameHeight: 64,
    });

    this.load.spritesheet('hero-jump-sheet', 'assets/hero/jump.png', {
      frameWidth: 32,
      frameHeight: 64,
    });

    this.load.spritesheet('hero-flip-sheet', 'assets/hero/spinjump.png', {
      frameWidth: 32,
      frameHeight: 64,
    });

    this.load.spritesheet('hero-fall-sheet', 'assets/hero/fall.png', {
      frameWidth: 32,
      frameHeight: 64,
    });
  }

  create(data) {
    // capturing keyboard input
    this.cursorKeys = this.input.keyboard.createCursorKeys();

    // initialises animation for sprites
    this.anims.create({
      key: 'hero-idle', // idle animation
      frames: this.anims.generateFrameNumbers('hero-idle-sheet'),
    });

    this.anims.create({
      key: 'hero-running', // running animation
      frames: this.anims.generateFrameNumbers('hero-run-sheet'),
      frameRate: 10, // 10fps
      repeat: -1, // -1 to run infinitely
    });

    this.anims.create({
      key: 'hero-pivoting', // pivoting animation
      frames: this.anims.generateFrameNumbers('hero-pivot-sheet'),
    });

    this.anims.create({
      key: 'hero-jumping', // jumping animation
      frames: this.anims.generateFrameNumbers('hero-jump-sheet'),
      frameRate: 10, // 10fps
      repeat: -1, // -1 to run infinitely
    });

    this.anims.create({
      key: 'hero-flipping', // flipping animation
      frames: this.anims.generateFrameNumbers('hero-flip-sheet'),
      frameRate: 30, // 30fps
      repeat: 0,
    });

    this.anims.create({
      key: 'hero-falling',
      frames: this.anims.generateFrameNumbers('hero-fall-sheet'),
      frameRate: 10, // 10fps
      repeat: -1, // -1 to run infinitely
    });

    // Loads game level
    this.addMap();

    // Loads hero
    this.addHero();

    // camera manager
    // Set camera to stay within bounds
    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );

    // Set camera to follow hero
    this.cameras.main.startFollow(this.hero);
  }

  // creates a new hero on screen
  addHero() {
    // positioned in centre with hardcoded values
    this.hero = new Hero(this, 250, 160);

    // add a collider physics for the hero and 'Ground' layer.
    this.physics.add.collider(
      this.hero,
      this.map.getLayer('Ground').tilemapLayer
    );
  }

  // loads map
  addMap() {
    this.map = this.make.tilemap({ key: 'level-1' });

    // add tileset image
    const groundTiles = this.map.addTilesetImage('world-1', 'world-1-sheet');

    // create layer
    const groundLayer = this.map.createStaticLayer('Ground', groundTiles);
    groundLayer.setCollision([1, 2, 4], true); // set which tiles to collide with

    // set tilemap size in-line with browser screen size
    this.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
    this.physics.world.setBoundsCollision(true, true, false, true); // stop collision with top of screen
  }

  update(time, delta) {}
}

export default Game;
