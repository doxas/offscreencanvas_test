
const LOOP_COUNT = 50;
let canvas, ctx, iData, canvasWidth, canvasHeight;
let startTime = 0;
let run = false;

onmessage = (e) => {
    if(e == null || e.data == null || e.data.hasOwnProperty('type') !== true){
        postMessage({ready: false});
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
            ctx.fillStyle = 'black';
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            iData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
            startTime = Date.now();
        }
    }

    render();
};

function render(){
	let t = (((Date.now() - startTime) / 1000.0) % 30.0) / 15.0;
    let nowTime = Math.sin(t * Math.PI) * 0.5;
    for(let column = 0; column < canvasWidth; ++column){
        for(let row = 0; row < canvasHeight; ++row){
            let z = {
                x: (column * 2.0 - canvasWidth) / canvasWidth * 1.5,
                y: (row * 2.0 - canvasHeight) / canvasHeight * 1.5
            };
            let count = 0;
            for(let i = 0; i < LOOP_COUNT; ++i){
                ++count;
                z = {
                    x: z.x * z.x - z.y * z.y - 0.234 + nowTime,
                    y: 2.0 * z.x * z.y       + 0.654
                };
                if(Math.sqrt(z.x * z.x + z.y * z.y) > 2.0){
                    break;
                }
            }
            let color = count / LOOP_COUNT * 255;
            let index = (row * canvasWidth + column) * 4;
            iData.data[index + 0] = color;
            iData.data[index + 1] = color;
            iData.data[index + 2] = color;
            iData.data[index + 3] = 255;
        }
    }
    ctx.putImageData(iData, 0, 0);
    if(run === true){
        requestAnimationFrame(render);
    }
}

