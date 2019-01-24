
const LOOP_COUNT = 100;
let canvas, ctx, iData, canvasWidth, canvasHeight;
let startTime = 0;
let run = false;

onmessage = (e) => {
    if(e == null || e.data == null || e.data.hasOwnProperty('type') !== true){
        postMessage({ready: false});
    }
    if(e.data.type === 'keydown'){
        run = e.data.key !== 'Escape';
    }
    if(e.data.type === 'resize'){
        canvas.width = canvasWidth = e.data.width;
        canvas.height = canvasHeight = e.data.height;
        iData = ctx.createImageData(e.data.width, e.data.height);
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
        render();
    }
    if(e.data.type === 'run'){
        canvas.width = canvasWidth = e.data.width;
        canvas.height = canvasHeight = e.data.height;
        iData = ctx.createImageData(e.data.width, e.data.height);
        run = true;
        startTime = Date.now();
        render();
    }
};

function render(){
    let t = (((Date.now() - startTime) / 1000.0) % 50.0) / 25.0;
    let nowTime = Math.sin(t * Math.PI) * 0.45 + 0.15;
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
                    y: 2.0 * z.x * z.y       + 0.654 - nowTime * 0.15
                };
                if(Math.sqrt(z.x * z.x + z.y * z.y) > 2.0){
                    break;
                }
            }
            let color = count / LOOP_COUNT;
            let hsv = hsva(200 + color * 360, 1.0, 1.0, 1.0);
            let index = (row * canvasWidth + column) * 4;
            iData.data[index + 0] = hsv[0] * 255 * color * 2.0;
            iData.data[index + 1] = hsv[1] * 255 * color * 2.0;
            iData.data[index + 2] = hsv[2] * 255 * color * 2.0;
            iData.data[index + 3] = 255;
        }
    }
    ctx.putImageData(iData, 0, 0);
    if(run === true){
        requestAnimationFrame(render);
    }
}

function hsva(h, s, v, a){
    if(s > 1 || v > 1 || a > 1){return;}
    let th = h % 360;
    let i = Math.floor(th / 60);
    let f = th / 60 - i;
    let m = v * (1 - s);
    let n = v * (1 - s * f);
    let k = v * (1 - s * (1 - f));
    let color = new Array();
    if(!s > 0 && !s < 0){
        color.push(v, v, v, a);
    } else {
        let r = new Array(v, n, m, m, k, v);
        let g = new Array(k, v, v, n, m, m);
        let b = new Array(m, m, k, v, v, n);
        color.push(r[i], g[i], b[i], a);
    }
    return color;
}

