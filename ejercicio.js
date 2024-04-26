//! primeros 50 numbers
//! empieza del 0
//! se suman los dos anteriores para dar el siguiente numero

let numbers = [];

function Fibonacci () {
  for (let index = 0; index < 50; index++) {
    const ultimo = numbers[numbers.length - 1];
    const penUltimo = numbers[numbers.length - 2];

    if (numbers.length === 0) {
      numbers.push(0)
    } else if(numbers.length === 1) {
      numbers.push(1)
    } else {
      numbers.push(penUltimo + ultimo)
    }
    console.log(numbers)
    
  }
}
Fibonacci()
