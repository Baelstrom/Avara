//             ___  __      ___   ____   ___  __       __ __  ___  ____   __
//            // \\ ||     // \\  || )) // \\ ||       || || // \\ || \\ (( \
//           (( ___ ||    ((   )) ||=)  ||=|| ||       \\ // ||=|| ||_//  \\
//            \\_|| ||__|  \\_//  ||_)) || || ||__|     \V/  || || || \\ \_))


let menuToggle = true
let animating = false
let currentScene = 0
let paused = false
let landingPageToggle = false
let landingPageContent = $('#landingPageToggle').html()
let masterTimeline = new TimelineMax()
let breatherTimeline = new TimelineMax({repeat:-1})
let breather = $('#breather')
let inhale = $('#inhale')
let sustain = $('#sustain')
let exhale = $('#exhale')
let relax = $('#relax')
let breatherCircle = $('#breatherCircle')
let breatherInstructions = $('#breatherInstructions')
let mainContainer = $('#mainContainer')
let content = $('#content')
let selectionScreen = $('#selectionScreen')

// define circle animations
breatherTimeline.to(breatherCircle, 3,{width:'20vh',height:'20vh',opacity:.8,ease:Elastic.easeOut.config(1, 1)})
breatherTimeline.to(breatherCircle, 4,{width:'0vh',height:'0vh',opacity:0,ease:Elastic.easeInOut.config(1, 1)})

// define inhale
breatherTimeline.to(relax, .5,{opacity: 0.5,ease:Elastic.easeOut.config(1, 1)},0)
breatherTimeline.to(inhale, .5,{opacity:1,ease:Elastic.easeOut.config(1, 1)},0)
// define sustain
breatherTimeline.to(inhale, .5,{opacity: 0.5,ease:Elastic.easeOut.config(1, 1)},2.5)
breatherTimeline.to(sustain, .5,{opacity:1,ease:Elastic.easeOut.config(1, 1)},2.5)
// define exhale
breatherTimeline.to(sustain, .5,{opacity: 0.5,ease:Elastic.easeOut.config(1, 1)},4)
breatherTimeline.to(exhale, .5,{opacity:1,ease:Elastic.easeOut.config(1, 1)},4)
// define relax
breatherTimeline.to(exhale, .5,{opacity: 0.5,ease:Elastic.easeOut.config(1, 1)},5.5)
breatherTimeline.to(relax, .5,{opacity:1,ease:Elastic.easeOut.config(1, 1)},5.5)
breatherTimeline.to(relax, .5,{opacity:0.5,ease:Elastic.easeOut.config(1, 1)},7)
breatherTimeline.to(relax, 3,{},5.5)

function sceneSelection () {
  let timeline = new TimelineLite()

  timeline.to($('#content'),1, {opacity:0})
  mainContainer.html(`<div id="selectionScreen">
      <div class="scenes">
        <div class='sceneSelectPls'>Select a Scene</div>
        <div onclick="selectScene('spacewhale')"class="sceneItem">Space Whale</div>
        <div onclick="selectScene('rain')"class="sceneItem">Rain</div>
        <div onclick="selectScene('beach')"class="sceneItem">Beach</div>
      </div>
  </div> `)
  let selectionScreen2 = $('#selectionScreen')
  timeline.add(()=> {content.remove()})
  timeline.to(selectionScreen2,0, {opacity:0,display:'flex'})
  // timeline.to(selectionScreen2,1, {opacity:'1!important',display:'flex'})
  timeline.to(selectionScreen2,1, {opacity:1,display:'flex'})
}

function selectScene ( name ) {
  // set url
  let selectionScreen2 = $('#selectionScreen')
  let scenesNames = ['spacewhale','beach','rain']

  scenesNames = scenesNames.filter(item => {if(item !== name){return true}} )
  // start synchronous via timeline
  console.log('plog -- runshere')
  let timeline = new TimelineLite()
  timeline.to(selectionScreen2, 1, {opacity:0})
  timeline.add( () => {
    selectionScreen2.remove()
    mainContainer.html(' ')

  })

  timeline.add( () => {
    // try to remove other canvas elements
    scenesNames.forEach( scene => {
      $(`#${scene}`).remove()
    })

    // try to remove other canvas scripts/css
    scenesNames.forEach( scene => {
      removejscssfile(scene,'js')
      removejscssfile(scene,'css')
    })

    // create the new scene element
    mainContainer.html(`<canvas id='${name}'></canvas>`)
    TweenLite.to($('#mainContainer'),0,{opacity:0})
    $("<link/>", {
       rel: "stylesheet",
       type: "text/css",
       href: `css/${name}.css`
    }).appendTo("head");

    $.getScript( `js/scenes/${name}.js`, function( data, textStatus, jqxhr ) {

      let statusCode = jqxhr.status

      // if recieved then continue
      if (statusCode == 200) {
        start()

        console.log('plog -- le scene success',name)
        TweenLite.to($('#mainContainer'),3,{opacity:1})
      }
    })
  })

}

//             __  ______  ___  ______  ____    ___  ___  ___    ___ __  __ __ __  __  ____
//            (( \ | || | // \\ | || | ||       ||\\//|| // \\  //   ||  || || ||\ || ||
//             \\    ||   ||=||   ||   ||==     || \/ || ||=|| ((    ||==|| || ||\\|| ||==
//            \_))   ||   || ||   ||   ||___    ||    || || ||  \\__ ||  || || || \|| ||___

// create scenes array as machine
let scenes = [
  firstTransition(),
  // secondTransition(),
  // thirdTransition(),
  // fourthTransition(),
  // fifthTransition(),
  // sixthTransition(),
  seventhTransition(),
  eighthTransition(),
]

// init function
function init() {

  // looping through scene objects to add it all to the masterTimeline
  scenes.forEach( scene => {
    // example of loosely checking for equality.
    // because I know that the scene.id var is not going to return strings at any point in time anyway.
    masterTimeline.add( scene.generateScene() )
    if ( scene.id == 0 ) {
      masterTimeline.addPause(8.2)
    }
    if ( scene.id == 8 ) {
      // 39 is where this scene starts
      // masterTimeline.addPause(42.75) // is where the header stops displaying
      // masterTimeline.addPause(43.15) // is where the header stops displaying
      // need to loop through the text, and then get the total time for that,
      // add that to this
      // + 1.5 for the button

    }
  })
  // skipping to timeline I'm working on
  // masterTimeline.seek(62)
}

// get the engine started
init()


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
    id: 0,
    name: '',
    description: '',
    generateScene() {
      // initialize Timeline
      var timeline = new TimelineMax()

      // set animating as true
      timeline.add(toggleAnimationState)

      // declare all the elements needed
      let mainHeading = $('#mainHeading')
      let subHeading = $('#subHeading')
      let skipToFav = $('.skipToFav')[0]
      let stepTwo = $('#stepTwo')


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
      // i dont know why this oen works the way it does.
      timeline.add(toggleAnimationState,()=>{})

      // return the completed timeline
      return timeline
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
    id: 1,
    name: '',
    description: '',
    generateScene() {
      // initialize Timeline
      var timeline = new TimelineMax()

      // set animating as true
      timeline.add(toggleAnimationState)

      // declare all the elements needed
      let animationContainer = getById("animationContainer")
      let landingPage = getById("landingPage")

      let audioList = ['music1']
      let audio = {
        music1: new Howl({
          src: [`./audio/music1.mp3`],
          html5: true,
        })
      }

      // start animations
      timeline.add([
         playAudio(audio, 'music1'),
         TweenLite.to(landingPage, 1, {opacity: 0, y: -100 ,ease:Power3.easeOut}),
         TweenLite.to(animationContainer, 1.5, {top: '0vh',ease:Power2.easeOut}),
       ])

      // toggle animating as false
      timeline.add(toggleAnimationState)

      return timeline
    },
  }
}

// ------------------------------------------------
// ================================================
//          SCENE THREE - show text
// ================================================
// ------------------------------------------------

function thirdTransition () {
  return {
    id: 2,
    name: '',
    description: '',
    generateScene() {
      // initialize Timeline
      var timeline = new TimelineMax()

      // set animating as true
      timeline.add(toggleAnimationState)

      // declare all the elements needed
      let anxietyText = getById("anxietyText")

      // init audio
      let audioList = ['voice1']
      let audio = initAudio(audioList)

      // start animations
      timeline.add([
        TweenLite.to(anxietyText, 4.5, {opacity:1, textShadow: '0 0 0px rgba(100,100,100,1)'}),
        TweenLite.to(anxietyText, 5, { ease: RoughEase.ease.config({ template:  Power0.easeNone, strength: 2, points: 50, taper: "out", randomize:  true, clamp: false}), y: '30vh', repeat:3, yoyo:true}),
      ])
      timeline.add([
        playAudio(audio, 'voice1', .5),
        TweenMax.fromTo(anxietyText, 2,
      		{
            ease:Power3.easeInOut
        	},
      		{
            y:1,
            ease:Power3.easeInOut,
      	    // repeat: 1,
          	// yoyo: true
      		},),
      ])
      timeline.add( speechDelay(0.5))


      // toggle animating as false
      timeline.call(toggleAnimationState)

      // return the completed timeline
      return timeline
    },
  }
}

// ------------------------------------------------
// ================================================
//          SCENE 4 - creak / explode text into circles
// ================================================
// ------------------------------------------------


// the init function is now a for loop that iterates through the scene array and calls generateScene and adds it to the masterTimeline
// there needs to be a way to pause and play the scene though.
function fourthTransition () {
  return {
    id: 3,
    name: '',
    description: '',
    generateScene() {
      // initialize Timeline
      var timeline = new TimelineMax()

      // set animating as true
      timeline.add(toggleAnimationState)

      // declare all the elements needed
      let anxietyText = getById("anxietyText")
      let A = getById("A-anxiety")
      let N = getById("N-anxiety")
      let X = getById("X-anxiety")
      let I = getById("I-anxiety")
      let E = getById("E-anxiety")
      let T = getById("T-anxiety")
      let Y = getById("Y-anxiety")
      let subtitles = getById("subtitles")
      console.log('plog -- subtitles',subtitles)

      // init audio
      let audioList = ['creak','voice2','voice3']
      let audio = initAudio(audioList)

      // begin animation
      timeline.add([
        TweenLite.to(anxietyText, 2, {fontSize:'16vmin',ease: RoughEase.ease.config({ template:  Power0.easeNone, strength: 1, points: 50, taper: "out", randomize:  true, clamp: false}),delay:0.2}),
        playAudio(audio, 'creak'),
        playAudio(audio, 'voice2',1),
        subtitleUpdate(`Its that tightness in your chest.`, 1),
        speechDelay(3.5)
      ])
      console.log('plog -- dur',timeline.duration())
      timeline.to(anxietyText, 0.1, {fontSize:'18vmin',ease:Power3.easeIn,delay:0.4})

      timeline.add([
        // audio + subtitles
        // playAudio(audio, 'voice3'),
        subtitleUpdate(`The worried mind, that never rests`, 1),
        playAudio(audio, 'voice3', 1),

        // displacements
        TweenLite.to(A, 2, {left:'-55vh',top:'-40vh',ease:Power4.easeOut}),
        TweenLite.to(N, 2, {left:'-30vh',top:'-20vh',ease:Power4.easeOut}),
        TweenLite.to(X, 2, {left:'-20vh',top:'30vh',ease:Power4.easeOut}),
        TweenLite.to(I, 2, {left:'0vh',top:'20vh',ease:Power4.easeOut}),
        TweenLite.to(E, 2, {left:'23vh',top:'-25vh',ease:Power4.easeOut}),
        TweenLite.to(T, 2, {left:'35vh',top:'-35vh',ease:Power4.easeOut}),
        TweenLite.to(Y, 2, {left:'40vh',top:'15vh',ease:Power4.easeOut}),

        // rotations
        TweenLite.to(A.childNodes[1], 2, {fontSize:'9vmin',rotation:-20,ease:Power3.easeOut}),
        TweenLite.to(N.childNodes[1], 2, {fontSize:'9vmin',rotation:-30,ease:Power3.easeOut}),
        TweenLite.to(X.childNodes[1], 2, {rotation:20,ease:Power3.easeOut}),
        TweenLite.to(I.childNodes[1], 2, {rotation:50,ease:Power3.easeOut}),
        TweenLite.to(E.childNodes[1], 2, {rotation:-60,ease:Power3.easeOut}),
        TweenLite.to(T.childNodes[1], 2, {rotation:-80,ease:Power3.easeOut}),
        TweenLite.to(Y.childNodes[1], 2, {rotation:40,ease:Power3.easeOut}),

      ])
      timeline.add([
        TweenMax.fromTo(A, .5,{ ease:Power3.easeIn},{ y:10, ease:Power3.easeIn, repeat: 2, yoyo: true}),
        TweenMax.fromTo(N, .5,{ ease:Power3.easeIn},{ y:10, ease:Power3.easeIn, repeat: 2, yoyo: true,delay:.2}),
        TweenMax.fromTo(X, .5,{ ease:Power3.easeIn},{ y:10, ease:Power3.easeIn, repeat: 2, yoyo: true,delay:.5}),
        TweenMax.fromTo(I, .5,{ ease:Power3.easeIn},{ y:10, ease:Power3.easeIn, repeat: 2, yoyo: true,delay:.3}),
        TweenMax.fromTo(E, .5,{ ease:Power3.easeIn},{ y:10, ease:Power3.easeIn, repeat: 2, yoyo: true,delay:.2}),
        TweenMax.fromTo(T, .5,{ ease:Power3.easeIn},{ y:10, ease:Power3.easeIn, repeat: 2, yoyo: true,delay:.1}),
        TweenMax.fromTo(Y, .5,{ ease:Power3.easeIn},{ y:10, ease:Power3.easeIn, repeat: 2, yoyo: true,delay:.8}),
      ])



      // toggle animating as false
      timeline.call(toggleAnimationState)

      // return the completed timeline
      return timeline
    },
  }
}

// ------------------------------------------------
// ================================================
//          SCENE 5 - hide text / show circles
// ================================================
// ------------------------------------------------


function fifthTransition () {
  return {
    id: 1,
    name: '',
    description: '',
    generateScene() {
      // initialize Timeline
      var timeline = new TimelineMax()

      // set animating as true
      timeline.add(toggleAnimationState)

      // declare all the elements needed
      let anxietyText = getById("anxietyText")
      let A = getById("A-anxiety")
      let N = getById("N-anxiety")
      let X = getById("X-anxiety")
      let I = getById("I-anxiety")
      let E = getById("E-anxiety")
      let T = getById("T-anxiety")
      let Y = getById("Y-anxiety")

      // Circles for transition
      let Ac = getById("ACircle")
      let Nc = getById("NCircle")
      let Xc = getById("XCircle")
      let Ic = getById("ICircle")
      let Ec = getById("ECircle")
      let Tc= getById("TCircle")
      let Yc = getById("YCircle")
      let subtitles = getById("subtitles")

      // init audio
      // let audioList = ['']
      // let audio = initAudio(audioList)

      // start animations
      // hide text n make the circles appear
      timeline.add([
        TweenLite.to(A.childNodes[1], 1, {rotation:-360,fontSize:'1vh',opacity:0,ease:Power3.easeOut,delay:0.4}),
        TweenLite.to(N.childNodes[1], 1, {rotation:-360,fontSize:'1vh',opacity:0,ease:Power3.easeOut,delay:0.4}),
        TweenLite.to(X.childNodes[1], 1, {rotation:360,fontSize:'1vh',opacity:0,ease:Power3.easeOut,delay:0.4}),
        TweenLite.to(I.childNodes[1], 1, {rotation:360,fontSize:'1vh',opacity:0,ease:Power3.easeOut,delay:0.4}),
        TweenLite.to(E.childNodes[1], 1, {rotation:-360,fontSize:'1vh',opacity:0,ease:Power3.easeOut,delay:0.4}),
        TweenLite.to(T.childNodes[1], 1, {rotation:-360,fontSize:'1vh',opacity:0,ease:Power3.easeOut,delay:0.4}),
        TweenLite.to(Y.childNodes[1], 1, {rotation:360,fontSize:'1vh',opacity:0,ease:Power3.easeOut,delay:0.4}),
        TweenLite.to(A, 1, {left:'40vh',top:'15vh',ease:Elastic.easeOut,delay:0.4}),
        TweenLite.to(N, 1, {left:'35vh',top:'-35vh',ease:Elastic.easeOut,delay:0.4}),
        TweenLite.to(X, 1, {left:'23vh',top:'-25vh',ease:Elastic.easeOut,delay:0.4}),
        TweenLite.to(I, 1, {top:'0vh',left:'0vh',ease:Elastic.easeOut,delay:0.4}),
        TweenLite.to(E, 1, {left:'-20vh',top:'30vh',ease:Elastic.easeOut,delay:0.4}),
        TweenLite.to(T, 1, {left:'-30vh',top:'-20vh',ease:Elastic.easeOut,delay:0.4}),
        TweenLite.to(Y, 1, {left:'-55vh',top:'-40vh',ease:Elastic.easeOut,delay:0.4}),
        TweenMax.to(Ac, 1, {rotation:-360,height:'10vh',width:'10vh',opacity:1,ease:Elastic.easeOut,delay:0.4}),
        TweenMax.to(Nc, 1, {rotation:-360,height:'10vh',width:'10vh',opacity:1,ease:Elastic.easeOut,delay:0.4}),
        TweenMax.to(Xc, 1, {rotation:360,height:'10vh',width:'10vh',opacity:1,ease:Elastic.easeOut,delay:0.4}),
        TweenMax.to(Ic, 1, {rotation:360,height:'10vh',width:'10vh',opacity:1,ease:Elastic.easeOut,delay:0.4}),
        TweenMax.to(Ec, 1, {rotation:-360,height:'10vh',width:'10vh',opacity:1,ease:Elastic.easeOut,delay:0.4}),
        TweenMax.to(Tc, 1, {rotation:-360,height:'10vh',width:'10vh',opacity:1,ease:Elastic.easeOut,delay:0.4}),
        TweenMax.to(Yc, 1, {rotation:360,height:'10vh',width:'10vh',opacity:1,ease:Elastic.easeOut,delay:0.4}),
      ])
      timeline.add([
        TweenLite.to(A, 0.5, {top:'0vh',opacity:0,left:'0vh',y:'-30vh',ease:Power3.easeOut}),
        TweenLite.to(N, 0.5, {top:'0vh',opacity:0,left:'0vh',y:'-30vh',ease:Power3.easeOut,delay:.1}),
        TweenLite.to(X, 0.5, {top:'0vh',opacity:0,left:'0vh',y:'-30vh',ease:Power3.easeOut}),
        TweenLite.to(Ic, 2, { height:'15vh',width:'15vh',ease: RoughEase.ease.config({ template:  Power0.easeNone, strength: 2, points: 50, taper: "out", randomize:  true, clamp: false}), y: '-40vh', repeat:3, yoyo:true}),
        TweenLite.to(E, 0.5, {top:'0vh',opacity:0,left:'0vh',y:'-30vh',ease:Power3.easeOut,delay:.2}),
        TweenLite.to(T, 0.5, {top:'0vh',opacity:0,left:'0vh',y:'-30vh',ease:Power3.easeOut}),
        TweenLite.to(Y, 0.5, {top:'0vh',opacity:0,left:'0vh',y:'-30vh',ease:Power3.easeOut,delay:.3}),
      ])

      // toggle animating as false
      timeline.call(toggleAnimationState)

      // return the completed timeline
      return timeline
    },
  }
}

// ------------------------------------------------
// ================================================
//          SCENE 6 - scene description
// ================================================
// ------------------------------------------------


function sixthTransition () {
  return {
    id: 1,
    name: '',
    description: '',
    generateScene() {
      // initialize Timeline
      var timeline = new TimelineMax()

      // set animating as true
      timeline.add(toggleAnimationState)

      // declare all the elements needed
      let I = getById("I-anxiety")


      // init audio
      // let audioList = ['']
      // let audio = initAudio(audioList)

      // start animations


      // toggle animating as false
      timeline.call(toggleAnimationState)

      // return the completed timeline
      return timeline
    },
  }
}

// ------------------------------------------------
// ================================================
//          SCENE 7 - New Intro
// ================================================
// ------------------------------------------------


function seventhTransition () {
  return {
    id: 7,
    name: 'Simple Intro',
    description: '',
    generateScene() {
      // initialize Timeline
      var timeline = new TimelineMax()

      // set animating as true
      timeline.add(toggleAnimationState)

      // declare all the elements needed
      let message = $('#message')
      // init audio
      let audioList = ['']
      // let audio = initAudio(audioList)
      let messages = [
        'Before we begin',
        'Know that while your anxious mind ',
        'feels quite upset right now',
        'The discomfort and uneasiness',
        'is only temporary',
        `You're going to be okay.`,
      ]
      // start animations

      timeline.to(message, 1.5,{} )
      let audio = {
        music1: new Howl({
          src: [`./audio/music1.mp3`],
          html5: true,
        })
      }
      timeline.add(playAudio(audio, 'music1'))
      messages.forEach( messageText => {
        timeline.to(message, 0, {opacity:0}),
        timeline.add([
          TweenLite.to(message, 1, {text:{value:messageText, padSpace:true, ease:Linear.none}}),
        ])
        timeline.to(message, 1, {opacity:1}),

        timeline.to(message, 1,{} )
        timeline.to(message, 1, {opacity:0,ease:Power3.easeOut})
        timeline.to(message, 0, {opacity:0,text:{value:'', padSpace:true, ease:Linear.none}})
      })

      timeline.to(message, .5, {opacity:0}),
      timeline.add([
        TweenLite.to(message, 1, {text:{value:'All it takes is three things~', padSpace:true, ease:Linear.none}}),
      ])
      timeline.to(message, 1, {opacity:1}),

      timeline.to(message, 1,{} )
      timeline.to(message, 1, {opacity:0,ease:Power3.easeOut})
      timeline.to(message, 0, {opacity:0,text:{value:'', padSpace:true, ease:Linear.none}})

      // cleanup intro
      timeline.add(()=>{message.remove()})

      // toggle animating as false
      timeline.call(toggleAnimationState)

      // return the completed timeline
      return timeline
    },
  }
}

// ------------------------------------------------
// ================================================
//          SCENE 8 - The Simpler Introduction
// ================================================
// ------------------------------------------------


function eighthTransition () {
  return {
    id: 8,
    name: 'Simple Intro',
    description: '',
    generateScene() {
      // initialize Timeline
      var timeline = new TimelineMax()

      // set animating as true
      timeline.add(toggleAnimationState)

      // declare all the elements needed
      let instructions = $('#instructions')
      let instructionHeading = $('#instructionHeading')
      let stepOne = $('#stepOne')
      let stepTwo = $('#stepTwo')
      let stepThree = $('#stepThree')
      let nextButton = $('#nextButton')
      let selectButton = $('#selectButton')
      // init audio
      let audioList = ['']
      // let audio = initAudio(audioList)
      let header = [

      ]
      // start animations
      timeline.to(instructionHeading, 1,{opacity:1}).delay(.5)


      let stepOneParams = [
        { time:1.2, delay:2 }, // Accept the Anxiety.
        { time: 0, delay:0 },
        { time:.2, delay:1.5 },   // The natural instinct when you're feeling anxious,
        { time:1.2, delay:1.5 },   // Is to reject it and want to run away from it,
        { time:1.2, delay:1.5 }, // To ignore it and hope that it'll go away,
        { time:1.2, delay:1.5 }, // But often, trying so hard to ignore it makes us feel worse,
        { time:0, delay:0},
        { time:1.2, delay:2}, // Instead, a better approach is accept that the feeling will pass,
        { time:1.2, delay:2 }, // Know that you are anxious,
        { time:1.2, delay:2 },  //Know that you're going to feel a little unsettled,
        { time:1.2, delay:2 }, // That you're going to be uncomfortable for a while,
        { time:0, delay:0},
        { time:1.2, delay:2 },   // Know that despite it all
        { time:1.2, delay:1 },   // The feeling will pass.
      ]

      for( let i = 0; i < stepOneParams.length; i++ ) {
        let { time, delay } = stepOneParams[i]
        timeline.to(stepOne[0].children[i], time,{opacity:.8})
        timeline.to(stepOne[0].children[i], delay,{})
      }

      timeline.to(nextButton, 1,{opacity:1}).delay(.5)
      timeline.add( () => { masterTimeline.pause()})

      // hide step one
      timeline.add([
          TweenLite.to(stepOne, 1,{opacity:0}),
          TweenLite.to(instructionHeading, 1,{opacity:0}),
      ])
      // show step two
      timeline.to(instructionHeading, 0, {text:{value:'Step Two.', padSpace:true, ease:Linear.none}})
      timeline.add( ()=> {
        stepOne.remove()
      })


      timeline.to(instructionHeading, 1,{opacity:1}).delay(1)

      let stepTwoParams = [
        { time:1.2, delay:2 },
        { time:1.2, delay:1 },
        { time: 0, delay:1 },
        { time:1.2, delay:2 },
        { time:1.2, delay:0.5 },
        { time:1.2, delay:2 },
        { time:1.2, delay:0.5 },
        { time:1.2, delay:2 },
        { time:1.2, delay:0 },
      ]

      for( let i = 0; i < stepTwoParams.length; i++ ) {
        let { time, delay } = stepTwoParams[i]
        timeline.to(stepTwo[0].children[i], time,{opacity:.8})
        timeline.to(stepTwo[0].children[i], delay,{})
      }

      timeline.to(stepTwo[0].children[1], 1,{})
      timeline.to(breather, 1,{opacity:1})
      timeline.add( () => { masterTimeline.pause()})

      // hide stepTwo
      timeline.add([
          TweenLite.to(stepTwo, 1,{opacity:0}),
          TweenLite.to(instructionHeading, 1,{opacity:0}),
          // TweenLite.to(breatherInstructions, 1,{opacity:0}),
          // TweenLite.to(breatherCircle, 1,{opacity:0}),
          TweenLite.to(breather, 1,{opacity:0}),
      ])

      // show step three
      timeline.to(instructionHeading, 0, {text:{value:'Step Three.', padSpace:true, ease:Linear.none}})
      timeline.add( ()=> {
        stepTwo.remove()
        breather.remove()
      })
      timeline.to(instructionHeading, 1,{opacity:1}).delay(1)

      let stepThreeParams = [
        { time:.8, delay:1.5 }, // Be Mindful and Present.
        { time: 0, delay:0 },
        { time:.8, delay:1 }, // Gently guide your mind to focus on the present,
        { time: 0, delay:1 },
        { time:.8, delay:2 }, // Focus on the sounds and scenery around you,
        { time:.8, delay:1.5 }, // The colors, the contrasts
        { time:.8, delay:1.5}, // The motion and movement
        { time: 0, delay:1 },
        { time:.8, delay:1.5 }, // If the environment around you is a bit too hectic,
        { time:.8, delay:1.5 }, // You could try picking one of the handcrafted scenes,
        { time:.8, delay:1.5 }, // Designed, and developed,
        { time:.8, delay:1 }, //For the sole purpose of relieving Anxiety.
      ]

      for( let i = 0; i < stepThreeParams.length; i++ ) {
        let { time, delay } = stepThreeParams[i]
        timeline.to(stepThree[0].children[i], time,{opacity:.8})
        timeline.to(stepThree[0].children[i], delay,{})
      }

      timeline.to(selectButton, 0, {opacity:1,text:{value:'    ', padSpace:true, ease:Linear.none}})
      timeline.to(nextButton, .5, {text:{value:'    ', padSpace:true, ease:Linear.none}})
      timeline.to(nextButton, 0, {autoAlpha:0})
      timeline.to(selectButton, .5, {text:{value:'Select A Scene', padSpace:true, ease:Linear.none}})
      timeline.to(selectButton, .5, {text:{value:'Select A Scene', padSpace:true, ease:Linear.none}})

      timeline.add( () => { masterTimeline.pause()})

      timeline.to(content, 1, {autoAlpha:0})

      timeline.add( ()=> {
        sceneSelection()
      })



      // toggle animating as false
      timeline.call(toggleAnimationState)

      // return the completed timeline
      return timeline
    },
  }
}

//            __  __  ____ __    ____   ____ ____      ____ __ __ __  __   ___ ______ __   ___   __  __  __
//            ||  || ||    ||    || \\ ||    || \\    ||    || || ||\ ||  //   | || | ||  // \\  ||\ || (( \
//            ||==|| ||==  ||    ||_// ||==  ||_//    ||==  || || ||\\|| ((      ||   || ((   )) ||\\||  \\
//            ||  || ||___ ||__| ||    ||___ || \\    ||    \\_// || \||  \\__   ||   ||  \\_//  || \|| \_))


// scrollMeSilly()


function resumeAnimation() {
  masterTimeline.play()
}

// Used to update animaion state
function toggleAnimationState() {
  animating = !animating
  console.log('plog -- animating is now ', animating)
}

//
//
// MENU ANIMATION FUNCTIONS




function toggleLandingPage(input){
  if ( landingPageToggle ) {
    console.log('plog -- firing show')
    $('#landingPageToggle').html(landingPageContent)
    let landingPage = getById('landingPage')
    TweenLite.to(landingPage, 0, {opacity:0})
    TweenLite.to(landingPage, 1, {opacity:1,top:'0vh'})
  } else {
    let landingPage = getById('landingPage')
    console.log('plog -- firing hide')
    TweenLite.to(landingPage, 0.3, {opacity: 0,y:-50})
    setTimeout( () => {
      console.log('plog -- removing')
      landingPageContent = $('#landingPageToggle').html()
      $('#landingPage').remove()
      if( input === 'start') {
        masterTimeline.play()
      }
    },400)
    // setTimeout( () => {
    //   if( input === 'start') {
    //     masterTimeline.play()
    //   }
    // },600)
  }

  landingPageToggle = !landingPageToggle

}

function toggleMenu() {
  toggleMenuIcon()
  staggerMenuItems()
}

function toggleMenuIcon () {
  // check current state
  // if menu is shown then hide Hamburger display X
  // else hide X show Hamburger23
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
    console.log('plog -- animating',animating)
    if ( direction == 'down' && !animating ) {
      console.log('plog -- firings')
      masterTimeline.play()
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

//  helper functions for audio
// this one takes an audio array and inits them into howler objects
// while also returning an object that holds the howler object instead of an array
function initAudio(audioList) {
   return audioList.reduce((acc, cur) => {
     acc[cur] = new Howl({
       src: [`./audio/${cur}.wav`],
       html5: true,
     })
     return acc
   }, {})
 }

 function playAudio ( audio, clip, duration ) {
   // this took a while to figure out.
   // for some reason timeline can only hold functions
   // which also return functions or as plain objects without the " () "
   // return () => {audio[clip].play()}
   if (duration && duration > 0) {
     let audioTimeline = new TimelineLite()
     console.log('plog -- f-audio call for : ', clip)
     audioTimeline.call(() => {audio[clip].play()}, null, null, duration)
     return audioTimeline
   } else {
     console.log('plog -- audio call for :', clip)
     return () => {audio[clip].play()}
   }
 }


// helper functions for textShadow
function subtitleUpdate ( text , delay ) {
  console.log('plog -- updating text to : ',text)
  if (delay && delay > 0) {
    return TweenLite.to(subtitles, 1, {opacity:1,text:{value:`${text}`, padSpace:true, ease:Linear.none}}).delay(delay)
  } else {
    return TweenLite.to(subtitles, 1, {opacity:1,text:{value:`${text}`, padSpace:true, ease:Linear.none}})
  }
}

function textUpdate ( text , element, delay  ) {
  console.log('plog -- updating text to : ',text)
  if (delay && delay > 0) {
    return TweenLite.to(element, 1, {opacity:1,text:{value:`${text}`, padSpace:true, ease:Linear.none}}).delay(delay)
  } else {
    return TweenLite.to(element, 1, {opacity:1,text:{value:`${text}`, padSpace:true, ease:Linear.none}})
  }
}

function speechDelay ( seconds ) {
  return TweenLite.to(subtitles, 0).delay(seconds)
}

function subtitleHide ( text ) {
  return TweenLite.to(subtitles, 1, {opacity:0,text:{value:` `, padSpace:true, ease:Linear.none}})
}


// code below from http://www.javascriptkit.com/javatutors/loadjavascriptcss2.shtml
function createjscssfile(filename, filetype){
    if (filetype=="js"){ //if filename is a external JavaScript file
        var fileref=document.createElement('script')
        fileref.setAttribute("type","text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype=="css"){ //if filename is an external CSS file
        var fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    return fileref
}

function replacejscssfile(oldfilename, newfilename, filetype){
    var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none" //determine element type to create nodelist using
    var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none" //determine corresponding attribute to test for
    var allsuspects=document.getElementsByTagName(targetelement)
    for (var i=allsuspects.length; i>=0; i--){ //search backwards within nodelist for matching elements to remove
        if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(oldfilename)!=-1){
            var newelement=createjscssfile(newfilename, filetype)
            allsuspects[i].parentNode.replaceChild(newelement, allsuspects[i])
        }
    }
}

function removejscssfile(filename, filetype){
    var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none" //determine element type to create nodelist from
    var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none" //determine corresponding attribute to test for
    var allsuspects=document.getElementsByTagName(targetelement)
    for (var i=allsuspects.length; i>=0; i--){ //search backwards within nodelist for matching elements to remove
    if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1)
        allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
    }
}
// ------------------------------------------------
// ================================================
//          SCENE x - scene description
// ================================================
// ------------------------------------------------


function xTransition () {
  return {
    id: 1,
    name: '',
    description: '',
    generateScene() {
      // initialize Timeline
      var timeline = new TimelineMax()

      // set animating as true
      timeline.add(toggleAnimationState)

      // declare all the elements needed

      // init audio
      let audioList = ['']
      // let audio = initAudio(audioList)

      // start animations


      // toggle animating as false
      timeline.call(toggleAnimationState)

      // return the completed timeline
      return timeline
    },
  }
}
