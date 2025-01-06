// function to change the visibility of the navigation bar
const changeNavVisible = () => {
  // if the classList contains the class visible
  if (navMobileLinks.classList.contains('visible')) {
    // it changes the display settings to none
    navMobileLinks.style.display = 'none';
    // sets the display for main back so its visible again
    document.querySelector('main').style.display = 'block';
    // background color for the navbar is removed
    navMobile.style.backgroundColor = null;
    // changes the symbol to the bar
    navMobileSymbol.children[0].src = '/assets/navbar-mobile-bars.png';
    // removes the class visible
    navMobileLinks.classList.remove('visible');
    // sets zIndex back to 2
    navMobile.style.zIndex = 2;
  } else {
    // makes the links appear
    navMobileLinks.style.display = 'block';
    // hides the main section
    document.querySelector('main').style.display = 'none';
    // changes the background for the navmobile
    navMobile.style.backgroundColor = 'rgb(76, 78, 77)';
    // changes the icon to the X
    navMobileSymbol.children[0].src = '/assets/navbar-mobile-close.png';
    // adds the class visible
    navMobileLinks.classList.add('visible');
    // zindex to 100 to put it over everything
    navMobile.style.zIndex = 100;
  }
};

// selects the whole nav, links and symbol
const navMobile = document.querySelector('.nav-mobile');
const navMobileLinks = document.querySelector('.nav-mobile-links');
const navMobileSymbol = document.querySelector('.nav-mobile-symbol');

// executes the function when the button for the mobile nav is clicked
navMobileSymbol.addEventListener('click', () => {
  changeNavVisible();
});
