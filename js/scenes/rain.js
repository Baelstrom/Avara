$(document).ready(function() {
  // track and update mouse coords
   let mouseX = 0
   let mouseY = 100

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

  // observations :
  // l does not have impacts on ys
  // where it should. Because l implies speed <-- FIX
  var canvas = $('#canvas')[0];
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
        ys: Math.random() * 10 + 20
      })
    }

    var particles = [];
    for(var b = 0; b < maxParts; b++) {
      particles[b] = init[b];
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for(var c = 0; c < particles.length; c++) {
        var p = particles[c];
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
        ctx.stroke();
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
        p.l = 4 *(mouseY/100)
        console.log(`p.x: ${p.xs * p.l*(mouseX/100)}, p.y: ${p.ys * p.l*(mouseY/1000)}`)
        if(p.x > w || p.y > h) {
          p.x = Math.random() * w;
          p.y = -20;
        }
      }
    }

    setInterval(draw, 30);

  }
});



function initAudio(audioList) {
   return audioList.reduce((acc, cur) => {
     acc[cur] = new Howl({
       src: [`./audio/${cur}.wav`],
       html5: true,
     })
     return acc
   }, {})
 }
