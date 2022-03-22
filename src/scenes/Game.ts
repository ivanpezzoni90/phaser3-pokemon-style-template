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
        this.load.image('tiles', '../tilesets/tuxmon-sample-32px-extruded.png');
        this.load.tilemapTiledJSON('map', '../assets/tuxemon-town.json');

        this.load.spritesheet('girl', 
            'assets/amelia.png',
            { frameWidth: 16, frameHeight: 24 }
        );
    }

    create() {

        const map = this.make.tilemap({ key: 'map' });
  
        const tileset = map.addTilesetImage('tuxmon-sample-32px-extruded', 'tiles');
  
        const belowLayer = map.createLayer('Below Player', tileset, 0, 0);
        const worldLayer = map.createLayer('World', tileset, 0, 0);
        const aboveLayer = map.createLayer('Above Player', tileset, 0, 0);
  
        worldLayer.setCollisionByProperty({ collides: true });
  
        aboveLayer.setDepth(10);
  
        const spawnPoint: any = map.findObject('Objects', (obj) => obj.name === 'Spawn Point');
  
        this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'girl')
            .setScale(1.5);

        this.physics.add.collider(this.player, worldLayer);

        // Create animations
        this.anims.create({
            key: 'idle-right',
            frames: this.anims.generateFrameNumbers('girl', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'idle-up',
            frames: this.anims.generateFrameNumbers('girl', { start: 6, end: 11 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'idle-left',
            frames: this.anims.generateFrameNumbers('girl', { start: 12, end: 17 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'idle-down',
            frames: this.anims.generateFrameNumbers('girl', { start: 18, end: 23 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'walk-right',
            frames: this.anims.generateFrameNumbers('girl', { start: 24, end: 29 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'walk-up',
            frames: this.anims.generateFrameNumbers('girl', { start: 30, end: 35 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'walk-left',
            frames: this.anims.generateFrameNumbers('girl', { start: 36, end: 41 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'walk-down',
            frames: this.anims.generateFrameNumbers('girl', { start: 42, end: 47 }),
            frameRate: 10,
            repeat: -1
        });
  
        const camera = this.cameras.main;
        camera.startFollow(this.player);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.cursors = this.input.keyboard.createCursorKeys();

        // Enable debug text when needed
        // this.add
        //     .text(16, 16, 'Arrow keys to move\nPress "D" to show hitboxes', {
        //         font: '18px monospace',
        //         padding: { x: 20, y: 10 },
        //         backgroundColor: '#666',
        //     })
        //     .setScrollFactor(0)
        //     .setDepth(30);
 
        // // Debug graphics
        // this.input.keyboard.once('keydown-D', (event: any) => {
        //     // Turn on physics debugging to show player's hitbox
        //     this.physics.world.createDebugGraphic();
 
        //     // Create worldLayer collision graphic above the player, but below the help text
        //     const graphics = this.add.graphics().setAlpha(0.75).setDepth(20);
        //     worldLayer.renderDebug(graphics, {
        //         tileColor: null, // Color of non-colliding tiles
        //         collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        //         faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
        //     });
        // });
    }

    update(time: number, delta: number): void {
        const speed = 175;
        const prevVelocity = this.player.body.velocity.clone();
    
        // Stop any previous movement from the last frame
        this.player.body.setVelocity(0);
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
            this.player.anims.play('walk-left', true);
        } else if (this.cursors.right.isDown) {
            this.player.anims.play('walk-right', true);
        } else if (this.cursors.up.isDown) {
            this.player.anims.play('walk-up', true);
        } else if (this.cursors.down.isDown) {
            this.player.anims.play('walk-down', true);
        } else {
            // If we were moving, pick and idle frame to use
            if (prevVelocity.x < 0) this.player.anims.play('idle-left', true);
            else if (prevVelocity.x > 0) this.player.anims.play('idle-right', true);
            else if (prevVelocity.y < 0) this.player.anims.play('idle-up', true);
            else if (prevVelocity.y > 0) this.player.anims.play('idle-down', true);
        }
    }
}
