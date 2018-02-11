/* global collision
/* global line */
/* global point */
/* global line_to_straight */
function sprite(texture, offset, size) {
    this.texture = texture;
    function set_texture(parent, key) {
        if (this.texture.key !== key) {
            this.texture = parent.textures[key];
            this.texture.begin = (new Date()).getTime();
            this.texture.key = key;
        }
    };
    this.offset = offset;
    this.width = size.width;
    this.height = size.height;
};
function platformer() {
    //this.init = () => {};
    
    
    this.textures = [];
    this.addTexture = (key, url) => {
        var buff = new Image();
        buff.src = url;
        this.textures[key] = buff;
    }
    
    
    this.keys = {
        left: false,
        right: false,
        jump: false
    };
    
    this.camera = {
        x: 0,
        y: 0
    };
    
    this.character = {
        x: 0,
        y: 0,
        velocity_x: 0,
        velocity_y: 0,
        hp: 1.0,
        mp: 1.0,
        direction: "right",
        state: "on_ground",
        sprite: {
            texture: {
                type: "single",
                texture: new Image(),
                textures: [],
                tick: 1,
                begin: 0,
                key: ""
            },
            set_texture: function(self, key) {
                if (self.character.sprite.texture.key !== key) {
                    self.character.sprite.texture = self.textures[key];
                    self.character.sprite.texture.begin = (new Date()).getTime();
                    self.character.sprite.texture.key = key;
                }
            },
            offset: {
                x: -0.25,
                y: 0.5
            },
            width: 0.5,
            height: 0.5
        },
        collision: {
            dx: -0.25,
            dy: 0.5,
            width: 0.5, 
            height: 0.5
        },
        legs: 1
    };

    this.world = {
        landscape: [[]],
        g: 9.8, // гравитация
        fc: 0.75, // сила трения
    };

    function object() {
        //collision:
    }

    this.objects = [];
    this.sprites = [];
    
    var velocity_x = 0;
    var velocity_y = 0;
    
    this.step = (delta) => {
        var force = ({x: 0, y: -this.world.g});
        if (this.character.state === "on_ground") {
            if (this.keys.left)
                force.x -= 300;
            if (this.keys.right)
                force.x += 300;
            if (this.keys.jump)
                force.y = 80;
        }
        this.velocity_x = (this.character.velocity_x += force.x * delta / 4) * delta;
        this.velocity_y = (this.character.velocity_y += force.y * delta / 4) * delta;
        
        
        // ожидаемое переещение персонажа
        var delta_pos = {x: this.character.velocity_x * delta, y: this.character.velocity_y};
        //проверка на vert столкновение
        //if (this.character.state == "in_air") {
        this.character.state = "in_air";
        var flag_reset = true;
        // оставшаяся дельта времени
        var new_delta = delta;
        while (flag_reset) {
            
            var flag_reset = false;
            
            var curr_pos = point(this.character.x, this.character.y);
            var new_pos = point(this.character.x + delta_pos.x, this.character.y + delta_pos.y);
            var legs_pos = point(curr_pos.x, curr_pos.y + this.character.legs);
            var new_legs_pos = point(curr_pos.x + delta_pos.x, curr_pos.y + this.character.legs + delta_pos.y);
            
            var character_path = line(curr_pos, new_pos);
            var legs = line(curr_pos, legs_pos);
            var new_legs = line(new_pos, new_legs_pos);
            var legs_moving = line(legs_pos, new_legs_pos);
            
            for (var j = 0; j < this.world.landscape.length; j++)
                for (var i = 0; i < this.world.landscape[j].length - 1; i++) {
                    
                    var land_segment = line(this.world.landscape[j][i], this.world.landscape[j][i + 1]);
                    var collision_coord = collision(character_path, land_segment);
                    var leg_collider = collision(legs, land_segment);
                    var moved_leg_collider = collision(legs, land_segment);
                    var leg_moving_collider = collision(legs, land_segment);
                    
                    if (collision_coord !== false) {
                        
                        this.character.state = "on_ground";
                        var old_new_position_x = new_pos.x;
                        new_pos.x = collision_coord.x;
                        new_pos.y = collision_coord.y + 1e-5;
                        
                        if (new_pos.x - this.character.x === 0) {
                            this.character.velocity_x = 0;
                            this.character.velocity_y = 0;
                            flag_reset = false;
                            break;
                        }
                        
                        new_delta -= Math.abs(delta_pos.x / (old_new_position_x - new_pos.x)) * new_delta;
                        delta_pos.x -= collision_coord.x - this.character.x;
                        
                        var straight = line_to_straight(land_segment);
                        delta_pos.y = straight.a / straight.b * (-delta_pos.x);
                        flag_reset = true;
                        break;
                    }
                    
                    if (leg_collider !== false) {
                        this.character.state = "on_ground";
                        new_pos.x = leg_collider.x;
                        new_pos.y = leg_collider.y + 1e-5;
                        this.character.velocity_x = 0;
                        this.character.velocity_y = 0;
                        flag_reset = false;
                        break;
                    }
                    if (moved_leg_collider !== false) {
                        this.character.state = "on_ground";
                        new_pos.x = moved_leg_collider.x;
                        new_pos.y = moved_leg_collider.y + 1e-5;
                        this.character.velocity_x = 0;
                        this.character.velocity_y = 0;
                        flag_reset = false;
                        break;
                    }
                    if (leg_moving_collider !== false) {
                        this.character.state = "on_ground";
                        new_pos.x = leg_moving_collider.x;
                        new_pos.y = leg_moving_collider.y + 1e-5;
                        this.character.velocity_x = 0;
                        this.character.velocity_y = 0;
                        flag_reset = false;
                        break;
                    }
                }
            
            this.character.x = new_pos.x;
            this.character.y = new_pos.y;
        }
        
        if (this.character.state === "on_ground") {
            //if (this.keys.jump)
                
            this.character.velocity_x *= this.world.fc;
            this.character.velocity_y *= this.world.fc;
        }
        
        this.character.x = Math.ceil(this.character.x * 131072) / 131072;
        this.character.y = Math.ceil(this.character.y * 131072) / 131072;
        if (this.character.velocity_x > 0)
            this.character.direction = "right";
        else
            if (this.character.velocity_x < 0)
                this.character.direction = "left";

        if (Math.abs(this.character.velocity_y) > 2e-1)
            this.character.sprite.set_texture(this, "character_jumping_" + this.character.direction);
        else
            if (Math.abs(this.character.velocity_x) < 1)
                this.character.sprite.set_texture(this, "character_idle_" + this.character.direction);
            else
                this.character.sprite.set_texture(this, "character_running_" + this.character.direction);
    };
    
    var div = (first, second) => (first - first % second) / second;
    
    this.draw = (context, size, time) => {
        context.fillStyle = "#fff";
        context.fillRect(0, 0, size.width, size.height);
        var min = Math.min(size.width, size.height);
        var multiplier = min / 20;
        var offset = {
            x: (size.width - min) / 2,
            y: (size.height - min) / 2
        };
        context.fillStyle = "#f0f0f0";
        context.fillRect(offset.x, offset.y, min, min);
        context.fillStyle = "#000";
        
        var x = (x) => x * multiplier + offset.x;
        var y = (y) => size.height - (y * multiplier + offset.y);
        this.sprites.forEach((element) => {
            var texture = new Image();
            if (element.texture.type === "animation")
                texture = element.texture.textures[div(time - element.texture.begin, element.texture.tick) % element.texture.textures.length];
            else
                texture = element.texture.texture;
            context.drawImage(texture, x(element.offset.x), y(element.offset.y), element.width * multiplier, element.height * multiplier);
        });
       
        var cx = this.character.x;
        var cy = this.character.y;
        
        var width = this.character.sprite.width * multiplier;
        var height = this.character.sprite.height * multiplier;
        var texture = new Image();
        if (this.character.sprite.texture.type === "animation")
            texture = this.character.sprite.texture.textures[div(time - this.character.sprite.texture.begin, this.character.sprite.texture.tick) % this.character.sprite.texture.textures.length];
        else
            texture = this.character.sprite.texture.texture;
        context.drawImage(texture, x(this.character.x + this.character.sprite.offset.x), y(this.character.y + this.character.sprite.offset.y), width, height)
        
        context.beginPath();
        context.strokeStyle = "#f80";
        context.lineWidth = 1;
        for (var j = 0; j < this.world.landscape.length; j++)
        {
            if (this.world.landscape[j].length > 1) {
                var p = this.world.landscape[j][0];
                context.moveTo(x(p.x), y(p.y));
            }
            for (var i = 1; i < this.world.landscape[j].length; i++) {
                var p = this.world.landscape[j][i];
                context.lineTo(x(p.x), y(p.y));
            }
        }
        context.stroke();
        context.beginPath();
        context.strokeStyle = "#f00";
        context.lineWidth = 1;
        context.moveTo(x(this.character.x), y(this.character.y));
        context.lineTo(x(this.character.x + this.velocity_x), y(this.character.y + this.velocity_y));
        context.stroke();
    };
    
    this.onkey = (key, state) => {
        switch (key) {
            case 37: this.keys.left = state; break;  // нажата стрелка влево
            case 32: this.keys.jump = state; break;    // нажат пробел
            case 39: this.keys.right = state; break; // нажата стрелка вправо
        }
    };
}