
(() => {
    let c = null;

    window.addEventListener('load', () => {
        let w;
        let isw = window.Worker != null;
        console.log({worker: isw});
        if(isw === true){
            w = new Worker('./script/worker.js');
            w.addEventListener('message', (e) => {
                console.log('onmessage in mein thread');
                console.log(e);
            }, false);
            w.postMessage('send');
        }

        c = document.querySelector('#canvas');
        resizer(c);
        console.log({offscreen: c.transferControlToOffscreen != null});
    }, false);

    function resizer(c){
        c.width = window.innerWidth;
        c.height = window.innerHeight;
    }
})();

