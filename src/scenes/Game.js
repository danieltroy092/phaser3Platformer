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

    // loading tileset spritesheet
    this.load.spritesheet('world-1-sheet', 'assets/tilesets/world-1.png', {
      frameWidth: 32,
      frameHeight: 32,
      margin: 1,
      spacing: 2,
    });
    this.load.image('clouds-sheet', 'assets/tilesets/clouds.png');

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

    this.load.spritesheet('hero-die-sheet', 'assets/hero/bonk.png', {
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

    this.anims.create({
      key: 'hero-dead',
      frames: this.anims.generateFrameNumbers('hero-die-sheet'),
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
    this.hero = new Hero(this, this.spawnPos.x, this.spawnPos.y);

    //  position hero to move behind the foreground layer via index
    this.children.moveTo(
      this.hero,
      this.children.getIndex(this.map.getLayer('Foreground').tilemapLayer)
    );

    // add a collider physics for the hero and 'Ground' layer.
    this.physics.add.collider(
      this.hero,
      this.map.getLayer('Ground').tilemapLayer
    );

    // check death sequence works
    setTimeout(() => {
      this.hero.kill();
    }, 3000);
  }

  // loads map
  addMap() {
    this.map = this.make.tilemap({ key: 'level-1' });

    // add tileset images
    const groundTiles = this.map.addTilesetImage('world-1', 'world-1-sheet');
    const backgroundTiles = this.map.addTilesetImage('clouds', 'clouds-sheet');

    // create background layer
    const backgroundLayer = this.map.createStaticLayer(
      'Background',
      backgroundTiles
    );

    // Set parallax scrolling effect on background layer
    backgroundLayer.setScrollFactor(0.6);

    // create ground layer
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

    // Physics collider for spikes
    this.spikeGroup = this.physics.add.group({
      immovable: true,
      allowGravity: false,
    });

    // Getting start point of Hero
    // Get data from object layer via Loop
    this.map.getObjectLayer('Objects').objects.forEach((object) => {
      if (object.name === 'Start') {
        // get object called 'Start'
        this.spawnPos = { x: object.x, y: object.y }; // get position of  start object
      } // check if spike object with ID num 7 exist
      if (object.gid === 7) {
        // creates new spike object, then add to group
        const spike = this.spikeGroup.create(
          object.x,
          object.y,
          'world-1-sheet',
          object.gid - 1
        );
        spike.setOrigin(0, 1); // set origin for spike
        spike.setSize(object.width - 10, object.height - 10); // set size for spike collision box
        spike.setOffset(5, 10); // set position for spike collision box
      }
    });

    // create foreground layer
    this.map.createStaticLayer('Foreground', groundTiles);
  }

  update(time, delta) {}
}

export default Game;
