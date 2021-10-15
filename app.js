const file = document.querySelector('input[type="file"]');
const img = document.querySelector('img');
const preds = document.querySelector('#predicciones');
const button = document.querySelector('#btn-pred');
const buttonClean = document.querySelector('#btn-clean');
const preloader = document.querySelector('.progress');

const setup = () => {

  // label check
  if(!localStorage.getItem('labels')) {

    M.toast({html: '<span>Cargando Labels...</span><button class="btn-flat toast-action">X</button>'});
    console.log('Labels está cargada localmente en localstorage')
    loadLabels();

  };

  // model check
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
        const top = 3;
        const result = model.predict(readyfied);
        const { values, indices } = tf.topk(result, top);
        const topValues = values.dataSync();
        const topindices = indices.dataSync();

        for(let i=0; i < top; i++) {
        
          //insert html
          htmlPredictionParse(topValues[i], topindices[i]);
        }
        // stop load
        preloader.style.display ='none';

      });
  });
};

const htmlPredictionParse = (value, indice)  => {
  const LABELS = getLabels();
  const template = `<div class="chip">${LABELS[indice]}<i class="close material-icons">close</i></div>`;
  preds.innerHTML += template;

};

// Main
setup();

// img input handle
file.addEventListener('change', () => {
  // add img
  img.src = URL.createObjectURL(file.files[0]);

  // clean html for new img
  preds.innerHTML = '';
});

// prediction button
button.addEventListener('click', () => {
  
  // clean html for new predictions
  preds.innerHTML = '';

  // start load model
  preloader.style.display = 'block';
  
  // predictions
  mobileNet();

});

buttonClean.addEventListener('click', () => {
   // manual clean option
   preds.innerHTML = '';
})