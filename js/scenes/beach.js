var beachWaves = [];

function start () {
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
    mouseX = Math.round( (touch.pageX / window.innerWidth) * 100 )
    mouseY =  Math.round( (touch.pageY / window.innerHeight) * 100 )
  } else {
    // if mouse, assign immediately to mouse variables
    mouseX = Math.round( (event.pageX / window.innerWidth) * 100 )
    mouseY =  Math.round( (event.pageY / window.innerHeight) * 100 )
  }

    wave()
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
  var canvas = $('#beach')[0];
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  if(canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;
    ctx.strokeStyle = 'rgba(66, 134, 244,1)';
    ctx.lineWidth = 150;
    ctx.lineCap = 'round';

    let colors = [
      '48,200,246',
      '102,219,255',
      '50,204,226',
      '165,236,255',
    ]
    var init = [];
    var maxParts = 400;
    for(var a = 0; a < maxParts; a++) {
      init.push({
        x: Math.random() * w,
        y: -500 + Math.random() * h/2 * .3,
        l: 80,
        xs: 0,
        ys: 4,
        t: Math.random(),
        motion: 'forward',
        overshoot: Math.random() * h/2 * .4,
        color : colors[Math.round((Math.random() * colors.length) -1)]
      })
    }

    for(var b = 0; b < maxParts; b++) {
      beachWaves[b] = init[b];
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for(var c = 0; c < beachWaves.length; c++) {
        var p = beachWaves[c];
        ctx.strokeStyle = `rgba(${p.color},1)`;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
        ctx.stroke();
        ctx.closePath();
      }
      move();
    }

    function move() {
      // ctx.lineWidth = 4 - (4 * (mouseY/100)) + 0.5;
      for(var b = 0; b < beachWaves.length; b++) {
        var p = beachWaves[b];
        // p.x += 4 * p.l* p.xs * (mouseY/100) ;
        // p.xs = ( mouseX * 2/100 ) -1
        // p.y += p.ys * p.l*(mouseY/100);
        // p.l = 4 * (mouseY/100)
        let forwardLimit = ( h/2 ) + p.overshoot - p.l - p.l - p.l -p.l -p.l -(p.l*.2)
        let backwardLimit = ( h/2 ) + p.overshoot + p.l
        let distance = forwardLimit - p.y  // 1400 - 700 = 700
        let velocity = Math.round( (distance/forwardLimit) * 8 ) + 1

        if( p.y < forwardLimit && p.motion == 'forward') {
          p.y += velocity
          if(p.y >= forwardLimit ) {
            p.motion = 'backward'
          }
        } else if (( p.y >= 0 - (p.l*10) - p.overshoot ) && p.motion == 'backward'){
          distance = backwardLimit - p.y
          velocity = Math.round(((distance / backwardLimit)) * 8) + 1
          console.log('plog -- ',velocity)
          p.y -= velocity
          if(p.y <= 0 - (p.l*10) - p.overshoot) {
            p.motion = 'still'
          }
        }


        // check for exit conditions
        // if(p.x > w || p.y > h) {
        //   p.x = Math.random() * w;
        //   p.y = h+20;
        // }

        // change audio according to Y position
        updateAudio(mouseY)
      }
    }



    setInterval(draw, 30);

  }
}

function wave () {
  console.log('plog -- fired wave')
  let flag = true
  let i = 0
  let flagged = 0
  while(flag && i < beachWaves.length) {
    if(beachWaves[i].motion == 'forward' || beachWaves[i].motion == 'backward') {
      console.log('plog -- flagged')
      flag = false;
    }
    i = i + 1
    console.log('plog -- i', i)
  }

  if(flag) {
    beachWaves.forEach(particle => {
      particle.motion = 'forward'
      particle.x = Math.random() * w
    })
  }
}
