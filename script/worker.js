
onmessage = (e) => {
    console.log('onmessage in worker.js');
    console.log(e);

    postMessage('result');
};

