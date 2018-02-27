let menuToggle = true;

function intro() {
  //get variables
  let mainHeading = getById('mainHeading')
  let subHeading = getById('subHeading')
  let introListItems = getByClassName('introList')[0].childNodes
  var introListItemArray = [];
  for(var i = introListItems.length; i--; introListItemArray.unshift(introListItems[i]));
  introListItems = introListItemArray.filter( item => item.className === 'introListItem')
  let skipToFav = getByClassName('skipToFav')[0]
  let scrollIconGroup = getByClassName('scrollIconGroup')[0]
  let chevron1 = getByClassName('chevron1')[0]
  let chevron2 = getByClassName('chevron2')[0]
  let chevron3 = getByClassName('chevron3')[0]
  let chevron4 = getByClassName('chevron4')[0]
  let chevron5 = getByClassName('chevron5')[0]

  //
  var introTimeline = new TimelineMax()
  var introListTimeLine = new TimelineLite()
  introTimeline.add(TweenLite.from(mainHeading, 1.5, {opacity:0, y:100,ease:Power3.easeInOut}))
  introTimeline.add(TweenLite.from(subHeading, 1.5, {opacity:0, y:100,ease:Power3.easeInOut}).delay(0.3))


  introListItems.forEach( item => {
    introTimeline.add([
      TweenLite.from(item.children[0], 1, {opacity:0, x:-100}),
      TweenLite.from(item.children[1], 1, {opacity:0}),
      TweenLite.from(item.children[2], 1, {opacity:0, x:100})
    ]).delay(1)
  })
  introTimeline.add( TweenLite.from(skipToFav, 1.5, {opacity:0, y:100,ease:Power3.easeInOut}))
  introTimeline.add([
    TweenLite.from(scrollIconGroup, 1.5, {opacity:0, ease:Power3.easeInOut}),
    // TweenLite.to(chevron1, 1.5, {top:72, opacity:0, ease:Power3.easeIn, repeat: 10}),
    // TweenLite.to(chevron2, 1.5, {top:52, opacity:0.25, ease:Power3.easeIn, repeat: 10}).repeat(-1),

  ])
  // TweenLite.from(mainHeading, 1.5, {opacity:0, y:100,ease:Power3.easeInOut})
}

intro()

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
