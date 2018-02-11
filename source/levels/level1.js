/* global platformer */
/* global Image */
/* global sprite */
function level1() {
    var buff = new platformer();
    
    var point = (_x, _y) => ({x: _x, y: _y});
    
    var load_image = (url) => {
        var image = new Image();
        image.src = url;
        return image;
    };
    
    var init = () => {
        [
            ["character_idle_left", 100, "resources/textures/character_idle_left_0.png",
            "resources/textures/character_idle_left_1.png",
            "resources/textures/character_idle_left_2.png",
            "resources/textures/character_idle_left_3.png"],
            ["character_idle_right", 100, "resources/textures/character_idle_right_0.png",
            "resources/textures/character_idle_right_1.png",
            "resources/textures/character_idle_right_2.png",
            "resources/textures/character_idle_right_3.png"],
            ["character_jumping_left", "resources/textures/character_jumping_left_0.png"],
            ["character_jumping_right", "resources/textures/character_jumping_right_0.png"],
            ["character_running_left", 200, "resources/textures/character_running_left_0.png",
            "resources/textures/character_running_left_1.png",
            "resources/textures/character_running_left_2.png",
            "resources/textures/character_running_left_3.png"],
            ["character_running_right", 200, "resources/textures/character_running_right_0.png",
            "resources/textures/character_running_right_1.png",
            "resources/textures/character_running_right_2.png",
            "resources/textures/character_running_right_3.png"],
            ["level", "resources/textures/level.png"]
        ].forEach((element) => {
            var buff1 = {
                type: "single",
                texture: new Image(),
                textures: [],
                tick: 1,
                begin: 0
            };
            if (element.length > 2) {
                buff1.textures = [];
                buff1.type = "animation";
                buff1.tick = element[1];
                for (var i = 2; i < element.length; i++)
                    buff1.textures.push(load_image(element[i]));
            }
            else
                buff1.texture = load_image(element[1]);
                
            buff.textures[element[0]] = buff1;
        });
        
        buff.sprites.push(new sprite(buff.textures["level"], point(0, 10), {width: 22.5, height: 10}));
        buff.character.sprite.texture = buff.textures["character_idle_right"];
        if (buff.character.sprite.texture.type === "animation") {
            var time = new Date();
            buff.character.sprite.texture.begin = time.getTime();
        }
        /*buff.character.sprite.height = 4;
        buff.character.sprite.width = 4;*/
        
        buff.character.x = 4.1;
        buff.character.y = 1.6;
        buff.world.landscape[0] = [point(0, 7), point(3.25, 7+1e-7), point(3.4, 6.5), point(4.1, 6.5+1e-7), point(4.3, 6.1), point(4, 5.5+1e-7), point(3.5, 5), point(2.5, 5+1e-7), point(1.75, 4.75), point(1.5, 4.5+1e-7), point(2, 2.5),
        point(2.5, 2+1e-7), point(3.5, 2), point(4, 1.5+1e-7), point(10.25, 1.5), point(10.45, 1+1e-7),
        point(11.7, 1), point(11.75, 1.5+1e-7), point(14.5, 1.5), point(14.55, 2.5+1e-7), point(15, 3), point(17.5, 3+1e-7), point(17.5, 1.5), point(20.3, 1.5+1e-7), point(20.3, 1), point(21.7, 1+1e-7), point(21.75, 1.5), point(22.5, 1.5+1e-7)];
    };
    
    init();
    
    return buff;
};