/* global level1 */
/* global collision */
var current_scene = level1();
var canvas;
var canvascontext;
var prev_time;
var key_event = (event) => {
    var key_state = (event.type == "keydown") ? true : false;
    current_scene.onkey(event.keyCode, key_state);
};

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

var init = () => {
	window.addEventListener("keydown", key_event);
	window.addEventListener("keyup", key_event);
	
	canvas = document.getElementById("screen");
	context = canvas.getContext("2d");
	context.webkitImageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;
	context.msImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false
	window.addEventListener('resize', resizeCanvas, false);
    resizeCanvas();
    
	prev_time = new Date().getTime();
};

function run() {
    var time = new Date().getTime();
    current_scene.step((time - prev_time) / 1000, time);
    prev_time = time;
	current_scene.draw(context, {width: canvas.width, height: canvas.height}, time);
	
    window.requestAnimationFrame(run);
}

window.onload = () => {
    init();
    run();
};