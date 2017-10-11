var Game = function (worldData) {
    this.worldData = worldData;

    //Set with and height of scene
    this._width = document.body.clientWidth;
    this._height = document.body.clientHeight;
    this._center = {
        x: Math.round(this._width / 2),
        y: Math.round(this._height / 2)
    };

    //Determine the scale to use for all elements
    this._scale = this._width / 1920;
    if (this._scale * 1080 < this._height) {
        this._scale = this._height / 1080;
    }

    this.app = new window.PIXI.Application(this._width, this._height, { backgroundColor: 0x1099bb });
    document.body.appendChild(this.app.view);

    //var build = this.build;
    window.PIXI.loader.add("/img/creatures.json").load(this.build.bind(this));
};

Game.prototype = {
    build: function () {
        //this.setupBg();

        //Add creatures
        this.worldData.baseSpecies.breeders.forEach(function(species) {
            this.app.stage.addChild(this.createCreature(species, "breeder"));
        }.bind(this));
        this.worldData.baseSpecies.hunters.forEach(function (species) {
            this.app.stage.addChild(this.createCreature(species, "hunter"));
        }.bind(this));

        //Game loop
        this.app.ticker.add(function () {
            this.app.stage.children.forEach(function (creature) {
                //If a child has genes, it's in fact a creature
                if (creature.genes) {
                    //Move the creature
                    this.moveCreature(creature);
                    //this.app.stage.children.forEach(function(otherCreature) {
                    //    if (creature !== otherCreature) {
                    //        if (collisionDetected(creature, otherCreature)) {
                    //            //Evolve according to collision
                    //            this.evolveWorld(creature, otherCreature);
                    //        }
                    //    }
                    //}.bind(this));
                }
            }.bind(this));
        }.bind(this));
    },
    setupBg: function () {
        //Create the texture
        var bg = window.PIXI.Sprite.fromImage("/img/background3.png");
        //Position the background in the center
        bg.anchor.set(0.5);
        bg.x = this._center.x;
        bg.y = this._center.y;
        bg.width = Math.round(this._scale * 1920);
        bg.height = Math.round(this._scale * 1080);
        //Mount onto the stage
        this.app.stage.addChild(bg);
    },
    evolveWorld: function (creatureOne, creatureTwo) {
        //Same type creatures breed
        if (creatureOne.type === creatureTwo.type) {
            this.app.stage.addChild(this.createCreature(creatureOne.type));
        }
        //c1 vs. c2: c1 survives
        else if ((creatureOne.type === "c1" && creatureTwo.type === "c2") ||
            (creatureOne.type === "c2" && creatureTwo.type === "c1")) {
            if (creatureOne.type === "c2") {
                this.app.stage.removeChild(creatureOne);
            } else {
                this.app.stage.removeChild(creatureTwo);
            }
        }
        //c1 vs. c2: c1 survives
        else if ((creatureOne.type === "c1" && creatureTwo.type === "c2") ||
            (creatureOne.type === "c2" && creatureTwo.type === "c1")) {
            if (creatureOne.type === "c2") {
                this.app.stage.removeChild(creatureOne);
            } else {
                this.app.stage.removeChild(creatureTwo);
            }
        }
        //c2 vs. c3: c2 survives
        else if ((creatureOne.type === "c2" && creatureTwo.type === "c3") ||
            (creatureOne.type === "c3" && creatureTwo.type === "c2")) {
            if (creatureOne.type === "c3") {
                this.app.stage.removeChild(creatureOne);
            } else {
                this.app.stage.removeChild(creatureTwo);
            }
        }
        //c3 vs. c1: c3 survives
        else if ((creatureOne.type === "c3" && creatureTwo.type === "c1") ||
            (creatureOne.type === "c1" && creatureTwo.type === "c3")) {
            if (creatureOne.type === "c1") {
                this.app.stage.removeChild(creatureOne);
            } else {
                this.app.stage.removeChild(creatureTwo);
            }
        }
    },
    createCreature: function (species, family, x, y) {
        if (family !== "breeder" && family !== "hunter") {
            throw "Invalid family. Must be 'breeder' or 'hunter'";
        }

        var texture = window.PIXI.utils.TextureCache[species];
        var creature = new window.PIXI.Sprite(texture);

        if (!x) {
            x = randomInt(0, this._width - this.worldData.creatureWidth);
        }
        if (!y) {
            y = randomInt(0, this._height - this.worldData.creatureHeight);
        }
        creature.x = x;
        creature.y = y;

        //Creature genes
        creature.genes = {};
        creature.genes.species = species;
        creature.genes.family = family;
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

        return creature; 
    },
    createRandomCreature: function (x, y) {
        var creaturesInSprite = 31 * 27 - 6;
        //Get random creature from Sprite
        var species = "c" + randomInt(1, creaturesInSprite);
        console.log(species);

        var texture = window.PIXI.utils.TextureCache[species];
        var creature = new window.PIXI.Sprite(texture);

        if (!x) {
            x = randomInt(0, this._width - this.worldData.creatureWidth);
        }
        if (!y) {
            y = randomInt(0, this._height - this.worldData.creatureHeight);
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

        return creature;
    },
    moveCreature: function(creature) {
        if (creature.x + creature.genes.speedX <= 0 ||
            creature.x + creature.genes.speedX >= this._width - this.worldData.creatureWidth) {
            creature.genes.speedX *= -1;
        }
        if (creature.y + creature.genes.speedY <= 0 ||
            creature.y + creature.genes.speedY >= this._height - this.worldData.creatureHeight) {
            creature.genes.speedY *= -1;
        }
        creature.x += creature.genes.speedX;
        creature.y += creature.genes.speedY;
    }
};