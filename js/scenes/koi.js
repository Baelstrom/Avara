$(document).ready(function() {
  // init audio
  // let audio = initAudio([])

  // audio icon control
  $('.speaker').click(function(e) {
    e.preventDefault();
    for( let clip in audio){
      audio['space'].mute(!mute)
      audio['plink'].mute(!mute)
      audio['heavy-rain'].mute(!mute)
      mute = !mute
    }
   $(this).toggleClass('mute');
  });

  // track and update mouse coords
   let mouseX = 0
   let mouseY = 100
   let depth = false
   let isAudioTransitioning = false;
  $(document).on('mousemove touchmove',function(event){
    // check if it's a touch event
    if( event.type == 'touchstart'  ||
        event.type == 'touchmove'   ||
        event.type == 'touchend'    ||
        event.type == 'touchcancel' ){
    let touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
    // assign to mouse variables
    mouseX = Math.round( touch.pageX )
    mouseY =  Math.round( touch.pageY )
  } else {
    // if mouse, assign immediately to mouse variables
    mouseX = Math.round( event.pageX )
    mouseY =  Math.round( event.pageY  )
  }


    // console.log(`x is : ${mouseX}, y is : ${mouseY}`)
  })


  let audioState = {
    // heavyRain : {
    //   name: 'heavyRain',
    //   obj: () => {return audio['heavy-rain']},
    //   isTransitioning: false,
    //   isPlaying: () => { return audio['heavy-rain'].playing()},
    //   fadeIn : (ms) => { audio['heavy-rain'].fade(audio['heavy-rain'].volume(),0.5,ms)},
    //   fadeOut : (ms) => {audio['heavy-rain'].fade(audio['heavy-rain'].volume(),0.1,ms)},
    //   silence : (ms) => {audio['heavy-rain'].fade(audio['heavy-rain'].volume(),0,ms)},
    //   volume : () => { return audio['heavy-rain'].volume()},
    //   endVolume: 0.1,
  }

  function updateAudio ( mouseY ) {



  }

  // updateAudio helper functions
  function silence ( audio ) {
    if ( audio.isTransitioning == false  && audio.volume() !== 0 ){
      console.log('audio transition out started: ',audio.name)
      audio.isTransitioning = true;
      audio.silence(2000)
      setTimeout( () => {
        console.log('audio transition out stopped: ',audio.name)
        audio.isTransitioning = false;
      }, 2000)
    }
  }

  function transitionOut ( audio ) {
    if ( audio.isTransitioning == false  && audio.volume() !== audio.endVolume ){
      console.log('audio transition out started: ',audio.name)
      audio.isTransitioning = true;
      audio.fadeOut(2000)
      setTimeout( () => {
        console.log('audio transition out stopped: ',audio.name)
        audio.isTransitioning = false;
      }, 2000)
    }
  }

  function transitionIn ( audio ) {
    if ( audio.isTransitioning == false  && audio.volume() === audio.endVolume ) {
      console.log('audio transition in started: ',audio.name)
      audio.isTransitioning = true;
      audio.fadeIn(2000)
      setTimeout( () => {
        console.log('audio transition in stopped: ',audio.name)
        audio.isTransitioning = false;
      }, 2000)
    }
  }

  function toggleAudioTransitioning () {
    isAudioTransitioning
  }


  // init canvas
  var canvas = $('#canvas')[0];
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  if(canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;
    ctx.strokeStyle = 'rgba(200, 134, 244,1)';


    var init = [];
    var maxParts = 100;
    for(var a = maxParts; a > 0; a--) {
      init.push({
        x: w / 2,
        y: h / 2 + a*1,
        r: 10* a/maxParts,
        sa: 0,
        ea: 2*Math.PI,
        ys: 4,
        opacity: 1* a/maxParts,
        relativeDistance: 200* a/maxParts,
        // rotation: 0,
      })
    }

    var koiFish = [];
    for(var b = 0; b < maxParts; b++) {
      koiFish[b] = init[b];
    }

    let history = koiFish.map( segment => {
      return { dx: 0, dy: 0 }
    })

    function draw() {
      ctx.clearRect(0, 0, w, h);
      koiFish.forEach( segment => {
        let { x,y,r, sa, ea, opacity,relativeDistance } = segment
        ctx.strokeStyle = `rgba(211,211,211,${opacity})`;
        ctx.fillStyle = `rgba(211,211,211,${opacity})`;
        ctx.beginPath();
        ctx.arc(x+relativeDistance, y, r, sa, ea)
        ctx.closePath();
        ctx.fill();
      })
      move();
    }

    let xDistance
    let yDistance
    function move() {
      // ctx.lineWidth = 4 - (4 * (mouseY/100)) + 0.5;
      let head = koiFish[0]
      // get all variables
      let {x,y,w,h} = head
      let x2 = mouseX
      let y2 = mouseY
      let dx = 0
      let dy = 0
      let velocity = 0
      let
      // calculate distance to mouse position
      // use pythagoras  sqrt of ( x1-x2)^2 +  ( y1 - y2 )^2
      xDistance = Math.sqrt( Math.pow((x2 - x), 2) )
      yDistance = Math.sqrt( Math.pow((y2 - y), 2) )

      // get velocity
      dx = getVelocity(xDistance)
      dy = getVelocity(yDistance)
      // console.log(`x:${x} y:${y} x2:${x2} y2:${y2} dx:${dx} dy:${dy} `)

      // head.x = getNewCoords ( x2, x, dx )
      // head.y = getNewCoords ( y2, y, dy )

      history[0] = {x: getNewCoords ( x2, x, dx ), y: getNewCoords ( y2, y, dy )}

      // apply history to entire koiFish
      for( let i = 0; i < koiFish.length; i++ ){
        let hx = history[i].x
        let hy = history[i].y
        koiFish[i].x = hx
        koiFish[i].y = hy
      }

      // shift array by one
      for( let i = history.length; i > 0 ; i-- ) {
        history[i] = history[i-1]
      }





    }



    setInterval(draw, 10);

  }
});

// helper functions

function getNewCoords ( w1, w2, velocity ) {
  if (w2 > w1) {
      return w1 + velocity;
  } else if (w2 < w1) {
      return w1 - velocity;
  } else if (w2 == w1) {
      return w1;
  }
}

function getVelocity ( distance ) {
  let velocity = distance * 0.2

  // if (distance > 300) {
  //     velocity = 15;
  // } else if (distance >= 200) {
  //     velocity = 10;
  // } else if (distance >= 100) {
  //     velocity = 7;
  // } else if (distance >= 50) {
  //     velocity = 5;
  // } else if (distance >= 1) {
  //     velocity = 1;
  // } else if (distance == 0) {
  //     velocity = 0;
  // }

  return velocity;
}

function initAudio(audioList) {
   return audioList.reduce((acc, cur) => {
     acc[cur] = new Howl({
       src: [`../audio/scenes/beach/${cur}.mp3`],
       html5: true,
       loop: true,
     })
     return acc
   }, {})
 }

 let menuToggle = true

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

 function getById ( targetId ) {
   return document.getElementById(targetId)
 }

 function getByClassName ( targetClass ) {
   return document.getElementsByClassName(targetClass)
 }
