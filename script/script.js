
(() => {
    let isStart = false;
    let canvas = null;
    let offscreen = null;
    let worker = null;

    window.addEventListener('load', () => {
        let e = document.body.querySelector('#run');
        e.addEventListener('click', () => {
            if(isStart === true){
                isStart = false;
                e.value = 'run';
                worker.postMessage({type: 'keydown', key: 'Escape'});
            }else{
                isStart = true;
                e.value = 'stop';
                initialize();
            }
        }, false);
    }, false);

    function initialize(){
        if(canvas == null){
            let isw = window.Worker != null;
            if(isw === true){
                worker = new Worker('./script/worker.js');
                worker.addEventListener('message', (e) => {
                    console.log(e);
                }, false);
            }else{
                console.log('ERR: webworker not supported');
                return;
            }
            canvas = document.body.querySelector('#canvas');
            offscreen = canvas.transferControlToOffscreen();
            worker.postMessage({type: 'init', offscreen: offscreen}, [offscreen]);
            let s = Math.min(window.innerWidth, window.innerHeight);
            worker.postMessage({type: 'resize', width: s, height: s});
        }else{
            let s = Math.min(window.innerWidth, window.innerHeight);
            worker.postMessage({type: 'run', width: s, height: s});
        }

        window.addEventListener('keydown', (eve) => {
            worker.postMessage({type: 'keydown', key: eve.key});
        }, false);

        window.addEventListener('resize', (eve) => {
            let w = Math.min(window.innerWidth, window.innerHeight);
            worker.postMessage({type: 'resize', width: w, height: w});
        }, false);
    };
})();

