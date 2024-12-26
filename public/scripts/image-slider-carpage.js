// checks if the array that contains all the images has more than 1 element inside
if (imageLinks.length == 1) {
  // selects both control buttons
  const controlButtonSelection = document.querySelectorAll('.control-button');
  // makes both control buttons invisible for the naked eye
  controlButtonSelection.forEach((button) => {
    button.style.display = 'none';
  });
}

// if the 2 buttons are visible they are selected
const controlButtons = [
  document.querySelector('#control-button-left'),
  document.querySelector('#control-button-right'),
];

// selects the container containing the car
const displayedCar = document.querySelector('.displayedCar');

// counter to get the right element
let counter = 1;

// adds an eventlistener for each control-button, listens for a click
controlButtons.forEach((controlButton) => {
  controlButton.addEventListener('click', () => {
    // checks what the id of the button is
    switch (controlButton.id) {
      // if its the right button
      case 'control-button-right':
        // increments the counter by 1
        counter++;
        // checks if the counter does not exceed the range of the array
        if (counter > imageLinks.length) {
          // if it is too big it resets the counter to 1
          counter = 1;
        }
        // sets the source to the next element in the array
        displayedCar.src =
          imageLinks[imageLinks.indexOf(displayedCar.src) + counter];
        break;

      // if its the left button
      case 'control-button-left':
        // basically reverse order
        // decrements the counter by 1
        counter--;
        // checks if its 0, then it resets it to the back of the array
        if (counter == 0) {
          counter = imageLinks.length;
        }
        // sets the source to the previous element in the array
        displayedCar.src =
          imageLinks[imageLinks.indexOf(displayedCar.src) + counter];
        break;

      // default case, does nothing, hopefully doesn't ever happen cause idk why it should
      default:
        break;
    }
  });
});
