function start() {
  // init audio
  let audio = initAudioSpaceWhale(['macaroni'])
  audio['macaroni'].play()
  // audio icon control
  let frameRate = 25
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
    mouseX = Math.round( event.pageX ) - 90
    mouseY =  Math.round( event.pageY  ) - 140
  }


    // console.log(`x is : ${mouseX}, y is : ${mouseY}`)
  })


  let audioState = {
    macaroni : {
      name: 'macaroni',
      obj: () => {return audio['macaroni']},
      isTransitioning: false,
      isPlaying: () => { return audio['macaroni'].playing()},
      fadeIn : (ms) => { audio['macaroni'].fade(audio['macaroni'].volume(),0.5,ms)},
      fadeOut : (ms) => {audio['macaroni'].fade(audio['macaroni'].volume(),0.1,ms)},
      silence : (ms) => {audio['macaroni'].fade(audio['macaroni'].volume(),0,ms)},
      volume : () => { return audio['macaroni'].volume()},
      endVolume: 0.1,
    }
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
  var canvas = $('#spacewhale')[0];
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;



  if(canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;
    ctx.strokeStyle = 'rgba(200, 134, 244,1)';

    // starfield
    let numberOfStarsModifier = 0.5
    let flightSpeed           = 0.005
    let numberOfStars = w * h / 1000 * numberOfStarsModifier
    let dirX          = w / 2
    let dirY          = h / 2
    let stars         = []
    let TWO_PI        = Math.PI * 2

    for(var x = 0; x < numberOfStars; x++) {
        stars[x] = {
            x: range(0, w),
            y: range(0, h),
            size: range(0, 3)
        };
    }

    canvas.onmousemove = function(event) {
        dirX = event.offsetX,
        dirY = event.offsetY;
    }

    var init = [];
    var maxParts = 43;
    for(var a = maxParts; a > 0; a--) {
      init.push({
        x: w / 2,
        y: h / 2,
        img: new Image(),
        opacity: 1* a/maxParts,
        rotation:0,
      })
    }

    var koiFish = [];
    for(var b = 0; b < maxParts; b++) {
      init[b].img.src = `../images/whaleSlices/${b}.png`
      koiFish[b] = init[b];
    }

    let history = koiFish.map( segment => {
      return { x: w/2, y: h/2 }
    })

    function draw() {
      ctx.clearRect(0, 0, w, h);


      var oldX,
          oldY;

      // reset canvas for next frame
      for(var x = 0; x < numberOfStars; x++) {
          // save old status
          oldX = stars[x].x;
          oldY = stars[x].y;

          // calculate changes to star
          stars[x].x += (stars[x].x - dirX) * stars[x].size * flightSpeed;
          stars[x].y += (stars[x].y - dirY) * stars[x].size * flightSpeed;
          stars[x].size += flightSpeed;

          // if star is out of bounds, reset
          if(stars[x].x < 0 || stars[x].x > w || stars[x].y < 0 || stars[x].y > h) {
              stars[x] = {
                  x: range(0, w),
                  y: range(0, h),
                  size: 0
              };
          }

          // draw star
          ctx.strokeStyle = "rgba(255, 255, 255, " + Math.min(stars[x].size, 1) + ")";
          ctx.lineWidth = stars[x].size;
          ctx.beginPath();
          ctx.moveTo(oldX, oldY);
          ctx.lineTo(stars[x].x, stars[x].y);
          ctx.stroke();
      }

      for( let i = 0; i < koiFish.length; i++ ){
        let { x, y, img, opacity, rd } = koiFish[i]
        ctx.strokeStyle = `rgba(211,211,211,${opacity})`;
        ctx.drawImage(img, x, y);
      }
      move();
    }

    let xDistance
    let yDistance
    function move() {
      // ctx.lineWidth = 4 - (4 * (mouseY/100)) + 0.5;
      let head = koiFish[0]
      // get all variables
      let {x,y,w,h,rd} = head
      let x1 = x
      let y1 = y
      let x2 = mouseX
      let y2 = mouseY
      let dx = 0
      let dy = 0
      let velocity = 0
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

      history[0] = {x: getNewCoords ( x1, x2, dx, rd ), y: getNewCoords ( y1, y2, dy, rd )}
      // apply history to entire koiFish
      for( let i = 0; i < koiFish.length; i++ ){
        let hx = history[i].x
        let hy = history[i].y
        koiFish[i].x = hx
        koiFish[i].y = hy
      }

      // shift array by one
      for( let i = koiFish.length; i > 0 ; i-- ) {
        history[i] = history[i-1]
      }





    } // end of move function



    setInterval(draw, frameRate);

  }
}

// helper functions

function getNewCoords ( w1, w2, velocity, rd ) {

  if (w2 > w1){
    return w1 + velocity
  } else if (w2 < w1) {
    return w1 - velocity
  } else if (w2 == w1) {
    return w1
  }

}

function getVelocity ( distance ) {
  let velocity = distance * 0.05
  return velocity;
}

function initAudioSpaceWhale(audioList) {
   return audioList.reduce((acc, cur) => {
     acc[cur] = new Howl({
       src: [`../audio/scenes/spacewhale/${cur}.mp3`],
       html5: true,
       loop: true,
     })
     return acc
   }, {})
 }




 // starfield

function range(start, end) {
    return Math.random() * (end - start) + start;
}
