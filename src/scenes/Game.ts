import Phaser from 'phaser';

export default class Demo extends Phaser.Scene {
  platforms: any;
  player: any;
  cursors: any;
  stars: any;
  bombs: any;
  scoreText: any;
  score: any = 0;

  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image("tiles", "../assets/tuxmon-sample-32px-extruded.png");
    this.load.tilemapTiledJSON("map", "../assets/tuxemon-town.json");

    this.load.spritesheet('warrior', 
        'assets/warriorArraySprite.png',
        { frameWidth: 16, frameHeight: 18 }
    );
  }

  create() {
    const map = this.make.tilemap({ key: "map" });

    const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");

    const belowLayer = map.createLayer("Below Player", tileset, 0, 0);
    const worldLayer = map.createLayer("World", tileset, 0, 0);
    const aboveLayer = map.createLayer("Above Player", tileset, 0, 0);

    worldLayer.setCollisionByProperty({ collides: true });
    aboveLayer.setDepth(10);

    this.player = this.physics.add.sprite(100, 450, 'warrior');
    this.player.setScale(2);

    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, worldLayer);

    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('warrior', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
    });
    
    this.anims.create({
        key: 'idle-down',
        frames: [ { key: 'warrior', frame: 6 } ],
        frameRate: 20
    });
    this.anims.create({
        key: 'idle-up',
        frames: [ { key: 'warrior', frame: 1 } ],
        frameRate: 20
    });
    this.anims.create({
        key: 'idle-left',
        frames: [ { key: 'warrior', frame: 9 } ],
        frameRate: 20
    });
    this.anims.create({
        key: 'idle-right',
        frames: [ { key: 'warrior', frame: 5 } ],
        frameRate: 20
    });
    
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('warrior', { start: 3, end: 5 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('warrior', { start: 6, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('warrior', { start: 9, end: 11 }),
        frameRate: 10,
        repeat: -1
    });

    const camera = this.cameras.main;
    camera.startFollow(this.player);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  }

    update(time: number, delta: number): void {
        this.cursors = this.input.keyboard.createCursorKeys();
        const speed = 175;
        const prevVelocity = this.player.body.velocity.clone();

        // Stop any previous movement from the last frame
        this.player.body.setVelocity(0);
        this.player.body.velocity.normalize().scale(0.8);

            // Horizontal movement
        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(speed);
        }
        // Vertical movement
        if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-speed);
        } else if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(speed);
        }

        this.player.body.velocity.normalize().scale(speed);

        if (this.cursors.left.isDown) {
            this.player.anims.play("left", true);
          } else if (this.cursors.right.isDown) {
            this.player.anims.play("right", true);
          } else if (this.cursors.up.isDown) {
            this.player.anims.play("up", true);
          } else if (this.cursors.down.isDown) {
            this.player.anims.play("down", true);
          } else {
            // If we were moving, pick and idle frame to use
            if (prevVelocity.x < 0) this.player.anims.play("idle-left", true);
            else if (prevVelocity.x > 0) this.player.anims.play("idle-right", true);
            else if (prevVelocity.y < 0) this.player.anims.play("idle-up", true);
            else if (prevVelocity.y > 0) this.player.anims.play("idle-down", true);
          }

    }
}
