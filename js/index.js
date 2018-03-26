//            ___  __      ___   ____   ___  __       __ __  ___  ____   __
//            // \\ ||     // \\  || )) // \\ ||       || || // \\ || \\ (( \
//           (( ___ ||    ((   )) ||=)  ||=|| ||       \\ // ||=|| ||_//  \\
//            \\_|| ||__|  \\_//  ||_)) || || ||__|     \V/  || || || \\ \_))


let menuToggle = true
let animating = false
let currentScene = 0
let end = false
let masterTimeline = new TimelineMax()


//             __  ______  ___  ______  ____    ___  ___  ___    ___ __  __ __ __  __  ____
//            (( \ | || | // \\ | || | ||       ||\\//|| // \\  //   ||  || || ||\ || ||
//             \\    ||   ||=||   ||   ||==     || \/ || ||=|| ((    ||==|| || ||\\|| ||==
//            \_))   ||   || ||   ||   ||___    ||    || || ||  \\__ ||  || || || \|| ||___

// create scenes array as machine
let scenes = [
  firstTransition(),
  secondTransition(),
  thirdTransition(),
]

// init function
function init() {
  nextScene()
}

// get the engine started
init()

// this is what turns the wheels in motion
function nextScene() {
  if (end) {
    console.log('plog -- animation is complete')
    return
  }

  let newScene = scenes[currentScene]
  currentScene++
  newScene.start()
  console.log('plog -- now playing scene - ', newScene.name)

}


//             __    ___  ____ __  __  ____    ____    ____  ____ __ __  __ __ ______ __   ___   __  __  __
//            (( \  //   ||    ||\ || ||       || \\  ||    ||    || ||\ || || | || | ||  // \\  ||\ || (( \
//             \\  ((    ||==  ||\\|| ||==     ||  )) ||==  ||==  || ||\\|| ||   ||   || ((   )) ||\\||  \\
//            \_))  \\__ ||___ || \|| ||___    ||_//  ||___ ||    || || \|| ||   ||   ||  \\_//  || \|| \_))



// ------------------------------------------------
// ================================================
//          SCENE ONE -- landing page
// ================================================
// ------------------------------------------------

function firstTransition () {
  return {
    id: 1,
    name: '',
    description: '',
    start() {

      function timeline() {
        // initialize Timeline
        var timeline = new TimelineMax()

        // set animating as true
        timeline.add(toggleAnimationState)

        // declare all the elements needed
        let mainHeading = getById('mainHeading')
        let subHeading = getById('subHeading')
        let skipToFav = getByClassName('skipToFav')[0]

        // introListItems gets a little special treatment since it has childnodes that need individual animations
        let introListItems = getByClassName('introList')[0].childNodes
        let introListItemArray = []
        for(var i = introListItems.length; i--; introListItemArray.unshift(introListItems[i]));
        introListItems = introListItemArray.filter( item => item.className === 'introListItem')

        // start animations
        timeline.from(mainHeading, 1.5, {opacity:0, y:100,ease:Power3.easeInOut})
        timeline.from(subHeading, 1.5, {opacity:0, y:100,ease:Power3.easeInOut}).delay(0.3)
        introListItems.forEach( item => {
          timeline.add([
            TweenLite.from(item.children[0], 1, {opacity:0, x:-100}),
            TweenLite.from(item.children[1], 1, {opacity:0}),
            TweenLite.from(item.children[2], 1, {opacity:0, x:100})
          ]).delay(1)
        })
        timeline.from(skipToFav, 1.5, {opacity:0, y:100,ease:Power3.easeInOut})

        // toggle animating as false
        timeline.add(toggleAnimationState)

        // return the completed timeline
        return timeline
      }

      // add a label to the masterTimeline
      masterTimeline.add("intro")

      // Run the third timeline at masterTimeline
      masterTimeline.add( timeline() )

      // start next scene
      end = true
      masterTimeline.add(nextScene)

    },
  }
}

// ------------------------------------------------
// ================================================
//          SCENE TWO - show anim canvas
// ================================================
// ------------------------------------------------

function secondTransition () {
  return {
    id: 2,
    name: 'animationCanvas',
    description: 'show animation canvas',
    start() {

      function timeline() {
        // initialize Timeline
        var timeline = new TimelineMax()

        // set animating as true
        timeline.add(toggleAnimationState)

        // declare all the elements needed
        let animationContainer = getById("animationContainer")
        let landingPage = getById("landingPage")


        // start animations
        timeline.add([
          TweenLite.to(landingPage, 1, {opacity: 0, y: -100 ,ease:Power3.easeOut}),
          TweenLite.to(animationContainer, 1.5, {top: '0vh',ease:Power2.easeOut}),
        ])

        // toggle animating as false
        timeline.add(toggleAnimationState)

        return timeline
      }

      // add a label to the masterTimeline
      masterTimeline.add("show canvas")

      // Run the third timeline at masterTimeline
      masterTimeline.add( timeline() )

      // start next scene
      end = true
      masterTimeline.add(nextScene)

    },
  }
}

// ------------------------------------------------
// ================================================
//          SCENE THREE - show text
// ================================================
// ------------------------------------------------

// NOTE : This has to be where the master timeline format begins

function thirdTransition () {
  return {
    id: 1,
    name: '',
    description: '',
    start() {

      function thirdTimeline() {
        // initialize Timeline
        var timeline = new TimelineMax()

        // set animating as true
        timeline.add(toggleAnimationState)

        // declare all the elements needed
        let anxietyText = getById("anxietyText")


        // start animations


        // toggle animating as false
        timeline.add(toggleAnimationState)



        return thirdTimeline
      }

      // add a label to the masterTimeline
      masterTimeline.add("show anxiety")

      // Run the third timeline at masterTimeline
      masterTimeline.add( thirdTimeline() )

      // start next scene
      end = true
      masterTimeline.add(nextScene)

    },
  }
}



//            __  __  ____ __    ____   ____ ____      ____ __ __ __  __   ___ ______ __   ___   __  __  __
//            ||  || ||    ||    || \\ ||    || \\    ||    || || ||\ ||  //   | || | ||  // \\  ||\ || (( \
//            ||==|| ||==  ||    ||_// ||==  ||_//    ||==  || || ||\\|| ((      ||   || ((   )) ||\\||  \\
//            ||  || ||___ ||__| ||    ||___ || \\    ||    \\_// || \||  \\__   ||   ||  \\_//  || \|| \_))


scrollMeSilly()

// Used to update animaion state
function toggleAnimationState() {
  animating = !animating
  console.log('plog -- animating is now ', animating)
}

//
//
// MENU ANIMATION FUNCTIONS

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

// END MENU ANIMATION FUNCTIONS
//
//



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

// STOLEN CODE

// Listener for scrollwheel
// code source : https://deepmikoto.com/coding/1--javascript-detect-mouse-wheel-direction

function detectMouseWheelDirection( e )
{
    var delta = null,
        direction = false
    ;
    if ( !e ) { // if the event is not provided, we get it from the window object
        e = window.event;
    }
    if ( e.wheelDelta ) { // will work in most cases
        delta = e.wheelDelta / 60;
    } else if ( e.detail ) { // fallback for Firefox
        delta = -e.detail / 2;
    }
    if ( delta !== null ) {
        direction = delta > 0 ? 'up' : 'down';
    }

    return direction;
}
function handleMouseWheelDirection( direction )
{
    console.log( direction ); // see the direction in the console
    if ( direction == 'down' && !animating && currentScene === 1) {
      end = false;
      scenes[1].start()
    } else if ( direction == 'up' && !animating) {

    } else {
        // this means the direction of the mouse wheel could not be determined
    }
}

function scrollMeSilly() {
  document.onmousewheel = function( e ) {
      handleMouseWheelDirection( detectMouseWheelDirection( e ) );
  };
  if ( window.addEventListener ) {
      document.addEventListener( 'DOMMouseScroll', function( e ) {
          handleMouseWheelDirection( detectMouseWheelDirection( e ) );
      });
  }
}

// ------------------------------------------------
// ================================================
//          SCENE TWO - show anim canvas
// ================================================
// ------------------------------------------------

function x () {
  return {
    id: 1,
    name: '',
    description: '',
    start() {

      function timeline() {
        // initialize Timeline
        var timeline = new TimelineMax()

        // set animating as true
        timeline.add(toggleAnimationState)

        // declare all the elements needed
        let anxietyText = getById("anxietyText")


        // start animations


        // toggle animating as false
        timeline.add(toggleAnimationState)



        return timeline
      }

      // add a label to the masterTimeline
      masterTimeline.add("intro")

      // Run the third timeline at masterTimeline
      masterTimeline.add( timeline() )

      // start next scene
      end = true
      masterTimeline.add(nextScene)

    },
  }
}
