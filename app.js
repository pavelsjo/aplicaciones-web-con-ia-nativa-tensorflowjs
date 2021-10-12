const file = document.querySelector('input[type="file"]');
const img = document.querySelector('img');
const preds = document.querySelector('#predicciones');
const button = document.querySelector('#btn-pred');

const init = () => {


  if(!localStorage.getItem('labels')) {
    
    M.toast({html: '<span>Cargando Labels...</span><button class="btn-flat toast-action">X</button>'});
    console.log('Labels está cargada localmente en localstorage')
    loadLabels();
  }
  tf.loadGraphModel('indexeddb://mobilenet')
    .then(resp => console.log('Mobilenet está cargada localmente en indexdb'))
    .catch(err => {
      console.log(err);
      M.toast({html: '<span>Cargando Mobilenet...</span><button class="btn-flat toast-action">X</button>'});
      loadMobilenet();
    });  
};

const loadLabels = () => {

  if (!localStorage.getItem('labels')) {

    // load
    fetch('labels.json')
      .then( res => res.json())
      .then( labels  => {
        // save local
        localStorage.setItem('labels', JSON.stringify(labels));
      }).catch(err => console.log(err));
  };
};

const getLabels = () => {
  return JSON.parse(localStorage.getItem('labels')).labels;
}

const loadMobilenet = () => {

  const URI = "https://storage.googleapis.com/tfjs-models/savedmodel/mobilenet_v2_1.0_224/model.json"
  tf.loadGraphModel(URI, { fromTFHub: false }).then((model) => {
    model.save('indexeddb://mobilenet');
  });

};

const mobileNet = async () => {

    tf.tidy( () => {
     
      tf.loadGraphModel('indexeddb://mobilenet', { fromTFHub: false }).then((model) => {
        
        const myTensor = tf.browser.fromPixels(img);

        // Image resized to 224
        const readyfied = tf.image.resizeBilinear(myTensor, [224, 224], true).div(255).reshape([1, 224, 224, 3]);
        
        // Predictions
        const top = 10;
        const result = model.predict(readyfied);
        const { values, indices } = tf.topk(result, top);
        const topValues = values.dataSync();
        const topindices = indices.dataSync();

        for(let i=0; i < top; i++) {
          
          htmlPredictionParse(topValues[i], topindices[i]);
        }

      });
  });
};

const htmlPredictionParse = (value, indice) => {
  const LABELS = getLabels();
  const template = `<a href="#!" class="collection-item">${LABELS[indice]}<span class="badge">${format(value)}%</span></a>`;
  preds.innerHTML += template;

};

const format = (value) => {
  return Math.round(value)
}

// Main
init();

// update img
file.addEventListener('change', () => {
    img.src = URL.createObjectURL(file.files[0]);
});

// predict
button.addEventListener('click', () => {
  mobileNet();
});