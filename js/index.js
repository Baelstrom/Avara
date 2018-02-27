let menuToggle = true;

function toggleMenu() {
  toggleMenuIcon()
  staggerMenuItems()
}

function toggleMenuIcon () {
  // check current state
  // if menu is shown then hide Hamburger display X
  // else hide X show Hamburger
  let iconHamWhite = getById ('icon-menu-white')
  let iconCloseBlack = getById ('icon-close-black')

  if(menuToggle) {
    // hide Ham
    TweenLite.to(iconHamWhite, 0.2, {opacity: 0})
    // show X
    TweenLite.to(iconCloseBlack, 0.2, {opacity: 1})
  } else {
    // hide X
    TweenLite.to(iconCloseBlack, 0.2, {opacity: 0})
    // show Ham
    TweenLite.to(iconHamWhite, 0.2, {opacity: 1}).delay(0.5)
  }

  // toggle state
  menuToggle = !menuToggle
}

function staggerMenuItems () {
  // let menuItems = getByClassName('sideMenuList').childNodes
  let menuItems = getByClassName('sideMenuList')[0].childNodes
  if(menuToggle) {
    TweenLite.to(menuItems, 0.2, {opacity: 0})
  } else {
    TweenMax.staggerFrom(menuItems, 0.3, {opacity:0,x:-300},0.05)
  }
}

// Helper Functions

// Abstracted add class function
function addClass ( targetClass, targetElement ) {
  var element = document.getElementsByClassName(targetElement)
  console.log("element is, ", element)
  element[0].classList.add(targetClass)
}

// Abstracted get by ID function
function getById ( targetId ) {
  return document.getElementById(targetId)
}


// Abstracted get by classname function
function getByClassName ( targetClass ) {
  return document.getElementsByClassName(targetClass)
}
