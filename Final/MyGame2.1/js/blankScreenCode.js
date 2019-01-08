var config = {
    width: 512,
    height: 350,
    type: Phaser.AUTO,

    scene: {
        preload: preload,
        create: create,
        update: update
    },

    physics: {
        default: 'arcade',

        arcade: {
            gravity: { y: 100 },
            debug: false
        }

    },

    callbacks: {
        postBoot: function () {
            resize();
        }
    },

    pixelArt: true
}

var game = new Phaser.Game(config);

var cursors;
var player;
var score = 0, scoreText;
var keyW, keyA, keyS, keyD, keySpace;

function preload() {
    console.log(this);
    this.load.spritesheet("player", "../assets/Beekeeper.png", { frameWidth: 32, frameHeight: 53 });
    this.load.spritesheet("jumper", "../assets/jumpingbeekeeper.png", { frameWidth: 32, frameHeight: 53 });
    this.load.spritesheet("bobber", "../assets/bobbingbeekeeper.png", { frameWidth: 32, frameHeight: 53 });
    //this.load.image("skull", "../assets/skull.png");
}

function create() {
    cursors = this.input.keyboard.createCursorKeys();

    createPlayer.call(this);
    createAnimations.call(this);
    //createSkulls.call(this);

    player.maxJumps = 1;
    player.jumps = player.maxJumps;

    scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '32px', fill: '#111' });
    scoreText.setScrollFactor(0);

    createOverlapAndCollide.call(this);
    this.cameras.main.setBounds(-470, 0, 1250, 300);
    this.cameras.main.startFollow(player, true, 0.5, 0.5);


    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
}

function update() {
    checkPlayerMovement();
}



function createPlayer() {
    player = this.physics.add.sprite(-400, 10, "player", 1);
    player.setCollideWorldBounds(true);

}


function createAnimations() {
    this.anims.create({
        key: "walkLeft",
        frames: this.anims.generateFrameNumbers("player", { start: 0, end: 8 }),
        repeat: -1,
        frameRate: 15
    });

    this.anims.create({
        key: "walkRight",
        frames: this.anims.generateFrameNumbers("player", { start: 9, end: 16 }),
        repeat: -1,
        frameRate: 15
    });

    this.anims.create({
        key: "idle",
        frames: this.anims.generateFrameNumbers("bobber", { frames: [0, 1] }),
        repeat: 1,
        frameRate: 3
    });

    this.anims.create({
        key: "jump",
        frames: this.anims.generateFrameNumbers("jumper", { frames: [0, 0] }),
        repeat: -1,
        frameRate: 5
    });

    this.anims.create({
        key: "crouch",
        frames: this.anims.generateFrameNumbers("bobber", { frames: [2, 2] }),
        repeat: -1,
        frameRate: 5
    });
}


function createOverlapAndCollide() {
    this.physics.add.collider(player);
    this.physics.add.overlap(player, killPlayer, null, this); //skulls,
}


function killPlayer() {
    this.physics.pause();
    player.setTint("#000000");
}

function checkPlayerMovement() {
    if (cursors.right.isDown || keyD.isDown) {
        player.body.setVelocityX(100);
        player.anims.play("walkRight", true);
        player.flipX = false;
    } else if (cursors.left.isDown || keyA.isDown) {
        player.body.setVelocityX(-100);
        player.anims.play("walkLeft", true);
        player.flipX = false;
    } else {
        player.body.setVelocityX(0);
        player.anims.play("idle", true);
        player.flipX = false;
    }
    if (player.body.blocked.down === false) {
        if (cursors.right.isDown || keyD.isDown) {
            player.flipX = true;
        }
        player.anims.play("jump", true)
    }
    if ((cursors.up.isDown || keyW.isDown || keySpace.isDown) && player.body.blocked.down) {
        player.body.setVelocityY(-100);
    }
    if (cursors.down.isDown || keyS.isDown) {
        player.anims.play("crouch", true);
        player.body.setVelocityY(300);
        player.body.setVelocityX(0);
        player.flipX = false;
    }

    if ((Phaser.Input.Keyboard.JustDown(keySpace) || Phaser.Input.Keyboard.JustDown(keyW) || Phaser.Input.Keyboard.JustDown(cursors.up)) && player.jumps > 0) {
        player.jumps--;
        player.body.setVelocityY(-100);
    }
    if (player.body.blocked.down) {
        player.jumps = player.maxJumps;
    }
}

function resize() {
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if (windowRatio < gameRatio) {
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    } else {
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}
