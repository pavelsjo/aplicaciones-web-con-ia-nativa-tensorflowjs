# Aplicaciones web con Inteligencia Artificial Nativa usando Tensorflow js - [Demo](https://pavelsjo.github.io/aplicaciones-web-con-ia-nativa-tensorflowjs/

Este repositorio contiene el código para la demo realizada durante el [VII Workshop de Sistemas](https://www.youtube.com/channel/UCru5ORwpLUvr0YvuHn23vEA) realizado por la Universidad Tecnológica Nancional - UTN.

Esta aplicación consiste en un `clasificador` basado en el modelo `Mobilenet` que toma una imagen como input y devuelve `+1000 labels` posibles de detecciones que se utilizan como `tags` para estas imagenes, en ese sentido, se limitaron al top 3 las predicciones.

![img](/demo.png)

 Se utiliza una estrategia de despliege del lado del cliente usando [tensorflow js](https://www.tensorflow.org/js?hl=es-419) y la interfaz de usuario fue diseñada con [materialize](https://materializecss.com/).

 En cuanto al flujo de ejecución, el modelo junto con las labels inicialmente se descargan desde tfhub y quedan almacenados localmente en el navegador usando la `indexdb` y `localstorage`, luego, al pulsar el botón de predecir se toma la imagen actual, se transforma en un tensor y se toman las predicciones del modelo para crear los tags.

## Referencias

- [TensorFlow Hub](https://tfhub.dev/)
- [Tenforflow js api](https://js.tensorflow.org/api/latest/#unique)
- [Learning TensorFlow.js](https://learning.oreilly.com/library/view/learning-tensorflow-js/9781492090786/ch05.html#idm45049246351960)
