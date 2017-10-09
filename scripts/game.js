var logged = false;

var Game = function (initialCreatures) {
    //Set with and height of scene
    this._width = document.body.clientWidth;
    this._height = document.body.clientHeight;
    this._center = {
        x: Math.round(this._width / 2),
        y: Math.round(this._height / 2)
    };
    this._creatureWidth = 32;
    this._creatureHeight = 32;
    this._creaturesInSprite = 6;
    this._totalCreatures = initialCreatures;

    //Determine the scale to use for all elements
    this._scale = this._width / 1920;
    if (this._scale * 1080 < this._height) {
        this._scale = this._height / 1080;
    }

    this.creatures = [];

    this.app = new PIXI.Application(this._width, this._height, { backgroundColor: 0x1099bb });
    document.body.appendChild(this.app.view);

    //var build = this.build;
    PIXI.loader.add("/img/sprites.json").load(this.build.bind(this));
};

Game.prototype = {
    build: function () {
        //this.setupBg();

        //Add creatures
        for (var c = 0; c < this._totalCreatures; c++) {
            //this.creatures.push(this.addCreature());
            this.addCreature();
        }

        //Game loop
        this.app.ticker.add(function () {
            this.app.stage.children.forEach(function(creature) {
                //Move the creature
                this.moveCreature(creature);
                this.app.stage.children.forEach(function(otherCreature) {
                    if (creature !== otherCreature) {
                        if (creaturesIntersect(creature, otherCreature)) {
                            this.app.stage.removeChild(creature);
                            this.app.stage.removeChild(otherCreature);
                        }
                    }
                }.bind(this));
            }.bind(this));
        }.bind(this));
    },
    setupBg: function () {
        //Create the texture
        var bg = PIXI.Sprite.fromImage("/img/background3.png");
        //Position the background in the center
        bg.anchor.set(0.5);
        bg.x = this._center.x;
        bg.y = this._center.y;
        bg.width = Math.round(this._scale * 1920);
        bg.height = Math.round(this._scale * 1080);
        //Mount onto the stage
        this.app.stage.addChild(bg);
    },
    addCreature: function (x, y) {
        //Get random creature from Sprite
        var creatureName = "c" + randomInt(1, this._creaturesInSprite);

        var texture = PIXI.utils.TextureCache[creatureName];
        var creature = new PIXI.Sprite(texture);

        if (!x) {
            x = randomInt(0, this._width - this._creatureWidth);
        }
        if (!y) {
            y = randomInt(0, this._height - this._creatureHeight);
        }
        creature.x = x;
        creature.y = y;

        //Creature genes
        creature.genes = {};
        creature.genes.canChangeDirection = randomBool();
        creature.genes.speedX = randomFloat(-2, 2);
        creature.genes.speedY = randomFloat(-2, 2);

        //Behavior according to genes
        if (creature.genes.canChangeDirection) {
            creature.genes.changeDirection = function () {
                creature.genes.speedX *= randomBool() ? -1 : 1;
                creature.genes.speedY *= randomBool() ? -1 : 1;
                setTimeout(creature.genes.changeDirection, creature.genes.changeDirectionTime);
            }
            creature.genes.changeDirectionTime = randomInt(1000, 5000);
            creature.genes.changeDirection();
        }

        this.app.stage.addChild(creature);

        return creature;
    },
    moveCreature: function(creature) {
        //if (!creature.shouldNotMove) {
            if (creature.x + creature.genes.speedX <= 0 ||
                creature.x + creature.genes.speedX >= this._width - this._creatureWidth) {
                creature.genes.speedX *= -1;
            }
            if (creature.y + creature.genes.speedY <= 0 ||
                creature.y + creature.genes.speedY >= this._height - this._creatureHeight) {
                creature.genes.speedY *= -1;
            }
            creature.x += creature.genes.speedX;
            creature.y += creature.genes.speedY;
        //}
    }
};

var randomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

var randomFloat = function (min, max, decimalPlaces) {
    if (decimalPlaces) {
        return Math.round(Math.random() * (max - min) + min, decimalPlaces);
    }
    return Math.random() * (max - min) + min;
};

var randomBool = function (){
    return Math.random() > 0.5;
}

var creaturesIntersect = function (r1, r2) {
    //Use half the value of width and height so objects have to bump more
    //into each other to detect a collision.
    return !(r2.x > (r1.x + r1.width / 2) ||
        (r2.x + r2.width / 2) < r1.x ||
        r2.y > (r1.y + r1.height / 2) ||
        (r2.y + r2.height / 2) < r1.y);
}