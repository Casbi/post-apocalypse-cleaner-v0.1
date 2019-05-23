var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var myGlobal = {};

var game = new Phaser.Game(config);
var myScene;

class Zombie extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, myTextureKey) {
      super(scene, x, y, myTextureKey);

      this.anims.play('zombieRun');
    }
}

function preload() {
    myScene = this;

    var img1 = new Image();
    img1.src = 'assets/charactersWeapons.png';

    myScene.textures.addSpriteSheet('charactersWeapons', img1, {
        frameWidth: 16,
        frameHeight: 16 
    });

    myScene.load.spritesheet('charactersWeapons', 'assets/charactersWeapons.png', {
        frameWidth: 16,
        frameHeight: 16
    });

    myGlobal.playerDestination = new Phaser.Math.Vector2();

    // TODO
    // this.load.image('background', 'assets/underwater1.png');
}

function create() {
    myScene.anims.create({
        key: 'duckIdle',
        frames: myScene.anims.generateFrameNumbers('charactersWeapons', {
            start: 0,
            end: 3
        }),
        frameRate: 5,
        repeat: -1
    });

    myScene.anims.create({
        key: 'zombieRun',
        frames: myScene.anims.generateFrameNumbers('charactersWeapons', {
            start: 5,
            end: 9
        }),
        frameRate: 5,
        repeat: -1
    });

    myGlobal.duck = myScene.physics.add.sprite(400, 300, 'charactersWeapons').play('duckIdle');

    myScene.input.on('pointerdown', function (pointer) {
        myGlobal.playerDestination.x = pointer.x;
        myGlobal.playerDestination.y = pointer.y;

        myScene.physics.moveToObject(myGlobal.duck, pointer, 100);
    }, myScene);

    myScene.time.addEvent({
        loop: true,
        callback: function() {
            if (Phaser.Math.Distance.Between(   myGlobal.duck.x, 
                                                myGlobal.duck.y,
                                                myGlobal.playerDestination.x,
                                                myGlobal.playerDestination.y) < 1) {
                myGlobal.duck.body.stop();
            }
        }
    });

    myGlobal.zombie = myScene.physics.add.existing(new Zombie(myScene, 200, 100, 'charactersWeapons'))
    
    //myGlobal.zombie = myScene.physics.add.sprite(200, 100, 'charactersWeapons').play('zombieRun');

    /*  create an empty rectangle game object, probably doesn't have to be circle
        i just can't find a empty game object
        immediantly set its *body* to a circle to be used as zombie's vision (check overlap with player) */
    myGlobal.zombie.vision = myScene.add.rectangle(myGlobal.zombie.x, myGlobal.zombie.y, 0, 0);
    myScene.physics.add.existing(myGlobal.zombie.vision);
    myGlobal.zombie.vision.body.setCircle(60, -60, -60);
    myGlobal.zombie.vision.playerLastPosition = new Phaser.Math.Vector2();

    myScene.time.addEvent({
        delay: 100,
        loop: true,
        callback: function(){
            if (myScene.physics.overlap(myGlobal.duck, myGlobal.zombie.vision)){
                myGlobal.zombie.vision.body.debugBodyColor = 0xff9900;
                myScene.physics.moveTo(myGlobal.zombie, myGlobal.duck.x, myGlobal.duck.y);
            } else {
                myGlobal.zombie.vision.body.debugBodyColor = 0x0099ff;
            }
        }
    });

    myScene.time.addEvent({
        delay: 2500,
        loop: true,
        callback: function(){
            if (!myScene.physics.overlap(myGlobal.duck, myGlobal.zombie.vision)){
                myGlobal.zombie.vision.body.debugBodyColor = 0x0099ff;
                myGlobal.zombie.body.stop();
            } else {
                myGlobal.zombie.vision.body.debugBodyColor = 0xff9900;
            }
        }
    });

    myScene.time.addEvent({
        delay: 17,
        loop: true,
        callback: function(){
            if (myScene.physics.overlap(myGlobal.duck, myGlobal.zombie)) {
                myGlobal.zombie.body.stop();
            }
        }
    });

    // keep zombie vision on the zombie if the zombie moves
    myScene.time.addEvent({
        loop: true,
        callback: function() {
            if (myGlobal.zombie.body.moves) {
                myGlobal.zombie.vision.x = myGlobal.zombie.x;
                myGlobal.zombie.vision.y = myGlobal.zombie.y;
            }
        }
    });

}

function update() {

}