
// 一度 transferControlToOffscreen すると Canvas 要素をリサイズできなくなる

(() => {
    const CANVAS_SIZE = 256;
    let canvas = null;
    let worker = null;

    window.addEventListener('load', () => {
        let isw = window.Worker != null;
        if(isw === true){
            // load worker script
            worker = new Worker('./script/worker.js');
            worker.addEventListener('message', (e) => {
                console.log(e);
            }, false);
        }else{
            console.log('ERR: webworker not supported');
            return;
        }

        canvas = document.querySelector('#canvas');
        canvas.width  = CANVAS_SIZE;
        canvas.height = CANVAS_SIZE;
        let oc = canvas.transferControlToOffscreen();
        worker.postMessage({type: 'init', offscreen: oc}, [oc]);

        window.addEventListener('keydown', (eve) => {
            worker.postMessage({type: 'keydown', key: eve.key});
        }, false);
    }, false);
})();

