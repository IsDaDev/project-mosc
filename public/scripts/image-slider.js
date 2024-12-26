// empty variable to keep track of the current element
let currentElement = 0;

// array containing both buttons for the control
const controlButtons = [
  document.querySelector('#control-button-left'),
  document.querySelector('#control-button-right'),
];

// event listener for every button
controlButtons.forEach((button) => {
  button.addEventListener('click', () => {
    // Determine if we are navigating left or right
    // if we going left
    if (button.id === 'control-button-left') {
      // decrements by 1
      currentElement--;
      // checks if element is inbound
      if (currentElement < 0) {
        currentElement = mediaElements.length - 1;
      }
      // if we are going right
    } else {
      // increments by 1
      currentElement++;
      // checks if element is inbound
      if (currentElement >= mediaElements.length) {
        currentElement = 0;
      }
    }

    // Loop through media elements and set opacity
    mediaElements.forEach((element, index) => {
      if (index !== currentElement) {
        element.style.opacity = 0;
      } else {
        element.style.opacity = 1;
      }
    });
  });
});
