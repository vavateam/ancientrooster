var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var character, controller, loop;

character = {
  jumping: true,
  x: 20,
  x_velocity: 0,
  y: 530,
  y_velocity: 0,
  width: 22,
  height: 40,
  onGround: true,
  dead: false,
  looksRight: true
}

function Platform(x, y, length, velocity) {
  this.x = x;
  this.y = y;
  this.length = length;
  this.velocity = velocity;
}

var char_texture = [];
function texture(path, key = "") {
	var buff = new Image();
	buff.src = path;
	return buff;
}
function animation() {
	this.step_duration;
	this.textures = [];
}
var init_textures = ()=>{
	function pair(first, second) {
		this.first = first;
		this.second = second;
	};
	[
		new pair("right", "textures/Experimental.png"),
		new pair("left", "textures/Experimental_left.png"),
		new pair("jumping_right", "textures/Experimental_jumping.png"),
		new pair("jumping_left", "textures/Experimental_jumping_left.png")
	].forEach((element)=>{
		/*var i = new Image();
		i.src = element.second;*/
		char_texture[element.first] = texture(element.second);
	});
};

var background = new Image();
background.src = "textures/BackgroundImage.png";

controller = {
  left: false,
  right: false,
  up: false,
  keyListener: function(event) {
    var key_state = (event.type == "keydown") ? true : false;
    
    switch(event.keyCode) {
      case 37: controller.left = key_state; break;  // нажата стрелка влево
      case 32: controller.up = key_state; break;    // нажат пробел
      case 39: controller.right = key_state; break; // нажата стрелка вправо
    }
  }
}

var numberOfPlatforms = Math.floor(Math.random() * 10) + 5;

var platforms = [numberOfPlatforms];

for (var i = 0; i < numberOfPlatforms; i++) {
  platforms[i] = new Platform(Math.random() * (800 - 75), (( 600 - 250) / numberOfPlatforms) * (i + 1) + 175 - character.height, 75, Math.random() * 7);
}


loop = function() {
  
  // ФИЗИКА
  // прыжок
  if (controller.up && character.jumping == false && character.onGround == true) {
    character.y_velocity -= Math.abs(character.x_velocity) * 1.5 + 10; 
    character.jumping = true;
    character.onGround = false;
  }
  // падение
  if (character.y_velocity !== 0){
    character.onGround = false;
  }
  //движение налево / направо
  if (controller.left) {
    character.x_velocity -= 1.6;
    character.looksRight = false;
  }
  if (controller.right) {
    character.x_velocity += 1.6;
    character.looksRight = true;
  }
  // гравитация
  character.y_velocity += 0.6;

  // изменение координат игрока
  character.x += character.x_velocity;
  character.y += character.y_velocity;

  // отрицательное ускорение игрока (трение)
  character.x_velocity *= 0.75;
  if (character.y_velocity < 0) {
    character.y_velocity *= 0.9;
  }
  
  // игрок не падает ниже уровня земли
  if (character.y > 550 - character.height){
    character.jumping = false;
    character.y = 550 - character.height;
    // если игрок падает слишком быстро
    if (character.y_velocity > 16) {
        character.dead = true;
      }
    character.y_velocity = 0;
    character.onGround = true;
  }
  // если игрок вышел за пределы карты
  if (character.x < -character.width) {
    character.x = 800;
  }
  else if (character.x > 800){
    character.x = -character.width;
  }
  // цикл платформ
  for (var i = 0; i < numberOfPlatforms; i++) {
    // если игрок стоит на платформе
    if ( (character.x + 15 > platforms[i].x) && (character.x + character.width - 15 < platforms[i].x + platforms[i].length)) {

      if ( (character.y + character.height > platforms[i].y) && ( ((character.y + character.height) - platforms[i].y) < 15) && 
        (character.y_velocity > 0)) {

        character.jumping = false;
        character.y = platforms[i].y - character.height;
        // если игрок падает слишком быстро
        if (character.y_velocity > 16) {
          character.dead = true;
        }
        character.y_velocity = 0;
        character.onGround = true;
        character.x += platforms[i].velocity;
      } 
    }

    // передвижение платформ
    platforms[i].x += platforms[i].velocity;

    // если платформа вышла за границы
    if (platforms[i].x > 800 - platforms[i].length || platforms[i].x < 0){
      platforms[i].velocity *= -1;
    }
    // победа
    //612-651
    //80-145

    if ( (character.x >= 612 && character.x + character.width <= 651 ) ) {
        if (character.y + character.height <= 145 && character.y + character.height >= 80) {
          alert("Поздравляем, вы можете улетать с этой планеты!");
          character.x = 20;
          character.y = 530;
          character.x_velocity = 0;
          character.y_velocity = 0;
          character.jumping = false;
          character.onGround = true;
          controller.left = false;
          controller.right = false;
          controller.up = false;

        }
    }


  }
  
  // прорисовка
  
  // фон и ракета
  ctx.drawImage(background,0,0);


  // платформы
  for (var i = 0; i < numberOfPlatforms; i++) {
    ctx.fillStyle = "#E6E6E6";
    ctx.fillRect(platforms[i].x, platforms[i].y, platforms[i].length, 5);
  }
  // персонаж
  console.log(character.onGround, "     ", character.looksRight);

  var i = "right";
  if (character.onGround){
    if (character.looksRight) {
      i = "right";
    } else if (!character.looksRight) {
      i = "left";
    }
  } else if (!character.onGround) {
    if (character.looksRight) {
      i = "jumping_right";
    } else if (!character.looksRight) {
      i = "jumping_left";
    }
  }

  ctx.beginPath();
  if (character.dead){
          ctx.drawImage(char_texture["right"], character.x, character.y);
          setTimeout(()=>{alert("Вы разбились!")});
          character.x = 20;
          character.y = 530;
          character.x_velocity = 0;
          character.y_velocity = 0;
          character.jumping = false;
          character.onGround = true;
          controller.left = false;
          controller.right = false;
          controller.up = false;
          character.dead = false;
  }
  else
	  ctx.drawImage(char_texture[i],character.x,character.y);

  window.requestAnimationFrame(loop);
}

window.onload = ()=>{
	// Инициализация ресурсо
	init_textures();

	// Запускаем
	window.addEventListener("keydown",controller.keyListener)
	window.addEventListener("keyup",controller.keyListener)
	window.requestAnimationFrame(loop);
};