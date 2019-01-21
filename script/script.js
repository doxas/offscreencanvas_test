
(() => {
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
        let oc = canvas.transferControlToOffscreen();
        worker.postMessage({type: 'init', offscreen: oc}, [oc]);
        resizer();

        window.addEventListener('keydown', (eve) => {
            worker.postMessage({type: 'keydown', key: eve.key});
        }, false);
    }, false);

    function resizer(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        worker.postMessage({type: 'resize'});
    }
})();

