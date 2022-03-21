import Phaser from 'phaser';

export default {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    backgroundColor: '#33A5E7',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
        }
    }
};