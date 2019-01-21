
let canvas, ctx, canvasWidth, canvasHeight;
let startTime = 0;
let run = false;

onmessage = (e) => {
	if(e == null || e.data == null || e.data.hasOwnProperty('type') !== true){
		postMessage({ready: false});
		return;
	}

	if(e.data.type === 'resize'){
		canvasWidth = canvas.width;
		canvasHeight = canvas.height;
		return;
	}
	if(e.data.type === 'keydown'){
		run = e.data.key !== 'Escape';
		return;
	}
	if(e.data.type === 'init'){
		if(canvas == null){
			canvas = e.data.offscreen;
			ctx = canvas.getContext('2d');
			canvasWidth = canvas.width;
			canvasHeight = canvas.height;
			run = true;
		}
	}

	ctx.fillStyle = 'black';
	ctx.globalAlpha = 0.0;
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);

	startTime = Date.now();
	render();
};

function render(){
	if(run === true){
		requestAnimationFrame(render);
	}
	console.log(Date.now() - startTime);
}

