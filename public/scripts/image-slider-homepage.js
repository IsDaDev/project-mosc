// if the 2 buttons are visible they are selected
const controlButtons = [
  document.querySelector('#control-button-left'),
  document.querySelector('#control-button-right'),
];

// selects the container containing the car
const displayedCar = document.querySelector('.displayedCar');

// sets the image for the first car
displayedCar.src = imageLinks[0];

// selects both headings
const headerH1 = document.querySelector('#header-section-h1');
const headerH2 = document.querySelector('#header-section-h2');

// sets the text for the first slide
headerH1.innerHTML = textToDisplay[0];
headerH2.innerHTML = textToDisplay[1];

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

    // switch case for the correct text
    // i think its pretty self-explanatory
    // code changes text of h1 and h2 depending on counter
    switch (counter) {
      // sets some text
      case 1:
        headerH1.innerHTML = textToDisplay[0];
        headerH2.innerHTML = textToDisplay[1];
        break;

      // sets some text
      case 2:
        headerH1.innerHTML = textToDisplay[0];
        headerH2.innerHTML = textToDisplay[2];
        break;

      // empties it
      case 3:
        headerH1.innerHTML = '';
        headerH2.innerHTML = '';
        break;

      default:
        break;
    }
  });
});
