function start() {
  // init audio
  let audio = initAudioRain(['heavy-rain','space','plink'])
  // let heavyRain = audio['heavy-rain'].play()
  audio['heavy-rain'].play()
  audio['space'].play()
  audio['plink'].play()
  audio['heavy-rain'].fade(0,0.5,1000)
  audio['space'].fade(0,0,10)
  audio['plink'].fade(0,0,10)
  let mute = false;
  // heavyRain.fade(0,0.5,1000)
  // audio['heavy-rain'].play()
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
    if(event.type == 'touchstart' || event.type == 'touchmove' || event.type == 'touchend' || event.type == 'touchcancel'){
    var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
    mouseX = Math.round( (touch.pageX / window.innerWidth) * 100 )
    mouseY =  Math.round( (touch.pageY / window.innerHeight) * 100 )
  } else {
    mouseX = Math.round( (event.pageX / window.innerWidth) * 100 )
    mouseY =  Math.round( (event.pageY / window.innerHeight) * 100 )
  }
    // console.log(`x is : ${mouseX}, y is : ${mouseY}`)
  })


  let audioState = {
    heavyRain : {
      name: 'heavyRain',
      obj: () => {return audio['heavy-rain']},
      isTransitioning: false,
      isPlaying: () => { return audio['heavy-rain'].playing()},
      fadeIn : (ms) => { audio['heavy-rain'].fade(audio['heavy-rain'].volume(),0.5,ms)},
      fadeOut : (ms) => {audio['heavy-rain'].fade(audio['heavy-rain'].volume(),0.1,ms)},
      silence : (ms) => {audio['heavy-rain'].fade(audio['heavy-rain'].volume(),0,ms)},
      volume : () => { return audio['heavy-rain'].volume()},
      endVolume: 0.1,
    },
    space : {
      name: 'space',
      obj: () => {return audio['space']},
      isTransitioning: false,
      isPlaying: () => { return audio['space'].playing()},
      fadeIn : (ms) => { audio['space'].fade(audio['space'].volume(),0.3,ms)},
      fadeOut : (ms) => {audio['space'].fade(audio['space'].volume(),0,ms)},
      volume : () => { return audio['space'].volume()},
      endVolume: 0,
    },
    plink : {
      name: 'plink',
      obj: () => {return audio['plink']},
      isTransitioning: false,
      isPlaying: () => { return audio['plink'].playing()},
      fadeIn : (ms) => { audio['plink'].fade(audio['plink'].volume(),0.5,ms)},
      fadeOut : (ms) => {audio['plink'].fade(audio['plink'].volume(),0,ms)},
      silence : (ms) => {audio['plink'].fade(audio['plink'].volume(),0,ms)},
      volume : () => { return audio['plink'].volume()},
      endVolume: 0,
    },
  }

  function updateAudio ( mouseY ) {
    let { heavyRain, space, plink} = audioState
    if ( mouseY < 10 ) {
      silence ( heavyRain )
      silence ( plink )
    } else if ( mouseY < 20 ) {
      silence ( heavyRain )
    } else if ( mouseY < 50 ) {
      depth = true
      transitionOut( heavyRain )
      transitionIn( space )
      transitionIn( plink )
    } else if ( mouseY > 50 ) {
      depth = false
      transitionIn( heavyRain )
      transitionOut( space )
      transitionOut( plink )
    }


  }
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



  var canvas = $('#rain')[0];
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  if(canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;
    ctx.strokeStyle = 'rgba(174,194,224,0.5)';
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';


    var init = [];
    var maxParts = 200;
    for(var a = 0; a < maxParts; a++) {
      init.push({
        x: Math.random() * w,
        y: Math.random() * h,
        l: Math.random() * 4,
        xs: Math.random() * 4 + 1,
        ys: Math.random() * 10 + 20,
        t: Math.random()
      })
    }

    var particles = [];
    for(var b = 0; b < maxParts; b++) {
      particles[b] = init[b];
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for(var c = 0; c < particles.length; c++) {
          ctx.strokeStyle = `rgba(174,194,224,${0.8 - particles[c].t })`;
        var p = particles[c];
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
        ctx.stroke();
        ctx.closePath();
      }
      move();
    }

    function move() {
      ctx.lineWidth = 4 - (4 * (mouseY/100)) + 0.5;
      for(var b = 0; b < particles.length; b++) {
        var p = particles[b];
        p.x += 4 * p.l* p.xs * (mouseY/100) ;
        p.xs = ( mouseX * 2/100 ) -1
        p.y += p.ys * p.l*(mouseY/100);
        p.l = 4 * (mouseY/100)
        if(p.x > w || p.y > h) {
          p.x = Math.random() * w;
          p.y = -20;
        }

        // change audio according to Y position
        updateAudio(mouseY)
      }
    }

    setInterval(draw, 30);

  }
}



function initAudioRain(audioList) {
   return audioList.reduce((acc, cur) => {
     acc[cur] = new Howl({
       src: [`../audio/scenes/rain/${cur}.mp3`],
       html5: true,
       loop: true,
     })
     return acc
   }, {})
 }
