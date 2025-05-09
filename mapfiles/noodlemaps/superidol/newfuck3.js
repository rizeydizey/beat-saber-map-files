"use strict";

const fs = require("fs");

const INPUT = "ExpertPlusLawless.dat";
const OUTPUT = "ExpertLawless.dat";

let difficulty = JSON.parse(fs.readFileSync(INPUT));

const infoFilePath = "Info.dat";

const infoData = JSON.parse(fs.readFileSync(infoFilePath));

infoData._difficultyBeatmapSets.forEach(difficultyBeatmapSet => {
    if (difficultyBeatmapSet._difficultyBeatmaps) {
        difficultyBeatmapSet._difficultyBeatmaps.forEach(beatmap => {
            if (beatmap._customData) {
              delete beatmap._customData._requirements;
              delete beatmap._customData._suggestions;
              beatmap._customData._requirements = ["Noodle Extensions", "Chroma"];
              //https://github.com/Aeroluna/Heck/wiki/Settings
              beatmap._customData._settings = {
                "_environments": {
                  "_overrideEnvironments" : false
                }
              };
            }
        });
    }
});

fs.writeFileSync(infoFilePath, JSON.stringify(infoData, null, 2));




//    -  -  -  -  -  -  -  -  -  -  -  -  -  BORING SHIT  -  -  -  -  -  -  -  -  -  -  -  -  -  





difficulty.customData = { rotationEvents: [], materials: {}, pointDefinitions: {}, environment: [], customEvents: [], fakeColorNotes: [], fakeBombNotes: [], fakeObstacles: [], fakeBurstSliders: [] };



const customData = difficulty.customData;
const obstacles = difficulty.obstacles;
const notes = difficulty.colorNotes; 
const burstSliders = difficulty.burstSliders; 
const sliders = difficulty.sliders; 
const bombs = difficulty.bombNotes; 
const events = difficulty.basicBeatmapEvents;
const customEvents = customData.customEvents;
const pointDefinitions = customData.pointDefinitions;
const environment = customData.environment;
const geometry = customData.environment.geometry;
const fakeNotes = customData.fakeColorNotes;
const fakeBombs = customData.fakeBombNotes;
const fakeObstacles  = customData.fakeObstacles;
const fakeBurstSliders = customData.fakeBurstSliders;
const rotationEvents = difficulty.rotationEvents;

let filterednotes;
let filteredSliders;
let filteredburstSliders;
let filteredevents;
let filteredobstacles;
let filteredbombs;
let filteredsliders;

let materials = customData.materials;

if (Array.isArray(materials)) {
  materials = {};
}

obstacles.forEach(wall => {
  if (!wall.customData) {
    wall.customData = {};
  }
});

notes.forEach(note => {
  if (!note.customData) {
    note.customData = {};
  }
});

bombs.forEach(bomb => {
  if (!bomb.customData) {
    bomb.customData = {};
  }
});

sliders.forEach(slider => {
  if (!slider.customData) {
    slider.customData = {};
  }
});

burstSliders.forEach(burstSlider => {
  if (!burstSlider.customData) {
    burstSlider.customData = {};
  }
});

function random(min, max, precision = 1) {
  if (precision === 1) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  } else {
    const factor = 1 / precision;
    const adjustedMin = min * factor;
    const adjustedMax = max * factor;

    const randomNum = Math.floor(Math.random() * (adjustedMax + 1 - adjustedMin)) + adjustedMin;
    return randomNum / factor;
  }
}


function randomExcludingRange(min, max, excludeMin, excludeMax, precision = 1) {
  let randomValue = random(min, max, precision);
  while (randomValue >= excludeMin && randomValue <= excludeMax) {
    randomValue = random(min, max, precision);
  }
  return randomValue;
}

//yeet 360 lines
let accumulatedRotation = 0;

function rot(time1, rotation, track) {
  filterednotes = notes.filter((n) => n.b >= time1 && n.b <= 696969);
  filterednotes.forEach((note) => {
    note.customData.track = track;
    note.customData.animation = {};
    note.customData.animation.offsetWorldRotation = [[0, accumulatedRotation + rotation, 0, 0]];
  });
  filterednotes = sliders.filter(n => n.b >= time1 && n.b <= 628);
  filterednotes.forEach(slider => {
    slider.customData.track = track;
    slider.customData.animation = {}
    slider.customData.animation.offsetWorldRotation = [[0, accumulatedRotation +rotation, 0, 0]];
  });
  filterednotes = obstacles.filter(n => n.b >= time1 && n.b <= 628);
  filterednotes.forEach(wall => {
    wall.customData.track = track;
    wall.customData.animation = {}
    wall.customData.animation.offsetWorldRotation = [[0,accumulatedRotation + rotation, 0, 0]];
  });
  filterednotes = burstSliders.filter(n => n.b >= time1 && n.b <= 628);
  filterednotes.forEach(chain => {
    chain.customData.track = track;
    chain.customData.animation = {}
    chain.customData.animation.offsetWorldRotation = [[0, accumulatedRotation +rotation, 0, 0]];
  });
  filterednotes = bombs.filter(n => n.b >= time1 && n.b <= 628);
  filterednotes.forEach(bomb => {
    bomb.customData.track = track;
    bomb.customData.animation = {}
    bomb.customData.animation.offsetWorldRotation = [[0,accumulatedRotation + rotation, 0, 0]];
  });
  accumulatedRotation += rotation;
}
const filteredNotes = rotationEvents.filter((n) => n.b >= 0 && n.b <= 69420);

for (const rotation of filteredNotes) {
  const j = rotation.b;
  const i = rotation.r;

  if (j % 0.125 === 0 && i >= -360 && i <= 360) {
    rot(j, i, "" + random(-6969, 6969, 0.000000001));
  }
}

delete difficulty.rotationEvents;

// all filterthingys
function filterNotes(start, end, type) {
  filterednotes = notes.filter(n => n.b >= start && n.b <= end);
  if (typeof type !== 'undefined' && type !== null)
      filterednotes = filterednotes.filter(n1 => n1.c == type);
  return filterednotes;
} 

function filterArcs(start, end, type) {
  filteredsliders = sliders.filter(n => n.b >= start && n.b <= end);
  if (typeof type !== 'undefined' && type !== null)
  filteredsliders = filteredsliders.filter(n1 => n1.c == type);
  return filteredsliders;
} 
function filterChains(start, end, type) {
  filteredburstSliders = burstSliders.filter(n => n.b >= start && n.b <= end);
  if (typeof type !== 'undefined' && type !== null)
  filteredburstSliders = filteredburstSliders.filter(n1 => n1.c == type);
  return filteredburstSliders;
} 
function filterBombs(start, end) {
  filteredbombs = bombs.filter(n => n.b >= start && n.b <= end);
  return filteredbombs;
} 
function filterWalls(start, end) {
  filteredobstacles = obstacles.filter(n => n.b >= start && n.b <= end);
  return filteredobstacles;
} 

// Fake filter thingys 
function removeNotes(notesToRemove) {
  notesToRemove.forEach(note => {
    const index = notes.indexOf(note);
    if (index !== -1) {
      notes.splice(index, 1);
    }
  });
}
function removeWalls(wallsToRemove) {
  wallsToRemove.forEach(note => {
    const index = obstacles.indexOf(note);
    if (index !== -1) {
      obstacles.splice(index, 1);
    }
  });
}
function removeBombs(wallsToRemove) {
  wallsToRemove.forEach(note => {
    const index = bombs.indexOf(note);
    if (index !== -1) {
      bombs.splice(index, 1);
    }
  });
}
function removeArcs(arcsToRemove) {
  arcsToRemove.forEach(note => {
    const index = sliders.indexOf(note);
    if (index !== -1) {
      sliders.splice(index, 1);
    }
  });
}
function removeChains(chainsToRemove) {
  chainsToRemove.forEach(note => {
    const index = burstSliders.indexOf(note);
    if (index !== -1) {
      sliders.splice(index, 1);
    }
  });
}


function fakefilterNotes(start, end, type) {
  const filteredNotes = notes.filter(n => n.b >= start && n.b <= end);
  
  if (typeof type !== 'undefined' && type !== null) {
    const filteredByType = filteredNotes.filter(n1 => n1.c == type);
    removeNotes(filteredByType);
    return filteredByType;
  } else {
    removeNotes(filteredNotes);
    return filteredNotes;
  }
} 
function fakefilterArcs(start, end, type) {
  const filteredsliders = sliders.filter(n => n.b >= start && n.b <= end);
  
  if (typeof type !== 'undefined' && type !== null) {
    const filteredByType = filteredsliders.filter(n1 => n1.c == type);
    removeArcs(filteredsliders);
    return filteredsliders;
  } else {
    removeArcs(filteredsliders);
    return filteredsliders;
  }
} 
function fakefilterChains(start, end, type) {
  const filteredburstSliders = burstSliders.filter(n => n.b >= start && n.b <= end);
  
  if (typeof type !== 'undefined' && type !== null) {
    const filteredByType = filteredburstSliders.filter(n1 => n1.c == type);
    removeChains(filteredburstSliders);
    return filteredburstSliders;
  } else {
    removeChains(filteredburstSliders);
    return filteredburstSliders;
  }
} 
function fakefilterWalls(start, end) {
  const filteredobstacles = obstacles.filter(n => n.b >= start && n.b <= end);
  removeWalls(filteredobstacles);
  return filteredobstacles;
} 
function fakefilterBombs(start, end) {
  const filteredbombs = bombs.filter(n => n.b >= start && n.b <= end);
  removeBombs(filteredbombs);
  return filteredbombs;
} 

//#region COPY/PASTE   -  -  -  -  -  -  -  -  -  -  -  -  -  use these as a copy/paste template for the lazy   -  -  -  -  -  -  -  -  -  -  -  -  -  
/*




//---------------------------------------------- ENVIRONMENTS ----------------------------------------------

environment.push(
  //fog
  {id: "Name.[0]Environment", lookupMethod: "Exact",    track: "pogFog", components:{
    BloomFogEnvironment:{ 
      height: 0,
      startY: -69,
      attenuation: 0
    }
  }},


  { id: "", lookupMethod: "Exact", active: false, duplicate: 1 },
)

//---------------------------------------------- PUSHING NOTES/WALLS ----------------------------------------------

fakeObstacles.push({
  b: 69,
  x: 0,
  y: 0,   //base 0-2
  d: 420, //duration
  h: 0,   //height 1-5
  w: 0,   //width
  customData:{
    track: "dumbTrackNameHere",
    noteJumpStartBeatOffset: 69,
    noteJumpMovementSpeed: 420,
    uninteractable: true,
    coordinates: [x, y],
    worldRotation: [x, y, z],
    localRotation: [x, y, z],
    size: [w, h, l],
    color: [r, g, b, a],
    animation: {}
    animation.offsetPosition: [],
    animation.offsetWorldRotation: [],
    animation.scale: [], 
  }
});

fakeNotes.push({
  b: 69,
  x: 0,
  y: 0,   
  a: 0, // fucking no idea what a does
  c: 0, //note type (red, blue)
  d: 0,  //direction
  customData:{
    track: "dumbTrackNameHere",
    noteJumpStartBeatOffset: 69,
    noteJumpMovementSpeed: 420,
    uninteractable: true
    animation: {}
    animation.offsetPosition: [],
    animation.offsetWorldRotation: [],
    animation.scale: [], 
  }
});

//---------------------------------------------- NOTEMOD STUFF ----------------------------------------------

filterNotes(0, 6969).forEach(note => { //change filternotes to whatever (filterarcs,chains,bombs,walls)
  note.customData.track = "dumbTrackNameHere";
  note.customData.noteJumpStartBeatOffset = 69;
  note.customData.noteJumpMovementSpeed = 420;
  note.customData.disableBadCutDirection = true;
  note.customData.disableBadCutSpeed = true;
  note.customData.disableBadCutSaberType = true;
  note.customData.spawnEffect = false;
  note.customData.disableNoteGravity = true;
  note.customData.disableNoteLook = true;
  note.customData.uninteractable = true;
  note.customData.animation = {}
  note.customData.animation.offsetPosition = [[]];
  note.customData.animation.offsetWorldRotation = [[]];
  note.customData.animation.scale = [[]]; 
  note.customData.animation.dissolveArrow = [[]]; 
    fakeNotes.push(note);
});

filterNotes(0, 6969).forEach(note => {
  let n1 = JSON.parse(JSON.stringify(note));
  n1.customData.track = "fake";
  fakeNotes.push(n1);
});

customEvents.push({
  b: 69,
  t: "AnimateTrack",
  d: {
    track: "dumbTrackNameHere",
    duration: 420,
    easing: "easeOutQuad",
    offsetPosition: [[]],
    offsetWorldRotation: [[]],
    localRotation: [[]],
    scale: [[]],
    dissolve: [[]],
    dissolveArrow: [[]],
    color: [[]]
  }
});       

customEvents.push({
  b: 69,
  t: "AssignPathAnimation",
  d: {
    track: "dumbTrackNameHere",
    duration: 420,
    easing: "easeOutQuad",
    definitePosition: [[]],
    offsetPosition: [[]],
    offsetWorldRotation: [[]],
    localRotation: [[]],
    scale: [[]],
    dissolve: [[]],
    dissolveArrow: [[]],
    color: [[]],
    interactable: [[]];
  }
});  

customEvents.push({
  b: 0,
  t: "AssignTrackParent",
  d: {
  childrenTracks: ["heckTrack", "frigTrack"], 
  parentTrack: "dumbTrackNameHere" ,
  worldPositionStays: true,
  }
});

//---------------------------------------------- THE OTHER STUFF idk ----------------------------------------------

customEvents.push({
  b: 69,
  t: "AssignPlayerToTrack",
  d: {
  track: "playerTrack",
  target: "Stuff" //Root, Head, LeftHand, RightHand
  }
});


shader list: [
  Standard",
  "TransparentLight",
  "InterscopeCar"
  "InterscopeConcrete"
] // we dont talk about OpaqueLight (shit dont work)

change to whatever mat name you want
            ↓
materials.matname = {
  color: [1,1,1],
  track: "color track", //track name for color
  shader: "Standard", //see above for shader list
  shaderKeywords: []
};


environment.push({
  geometry: {
    type: "Cube",
    material: "example", //check somewhere at line 32 for material
  },
  track: "TRname",
});

//---------------------------------------------- VIVIFY STUFF ----------------------------------------------

//tbh i dont know what any of this means exactly so just read the docs, ill prob explain it in my own simple words later
https://vivify.aeroluna.dev/docs/

customEvents.push({
  b: float, // Time in beats.
  t: "SetMaterialProperty",
  d: {
    asset: string, // File path to the desired material.
    duration: float, // The length of the event in beats (defaults to 0).
    easing: string, // An easing for the animation to follow (defaults to easeLinear).
    properties: [{
      id: string, // Name of the property on the material.
      type: string, // Type of the property (Texture, Float, Color).
      value: ? // What to set the property to, type varies depending on property type.
    }]
  }
});


customEvents.push({
  b: float, // Time in beats.
  t: "SetGlobalProperty",
  d: {
    duration: float, // The length of the event in beats (defaults to 0).
    easing: string, // An easing for the animation to follow (defaults to easeLinear).
    properties: [{
      id: string, // Name of the property on the material.
      type: string, // Type of the property (Texture, Float, Color).
      value: ? // What to set the property to, type varies depending on property type.
    }]
  }
});


customEvents.push({
  b: float, // Time in beats.
  t: "InstantiatePrefab",
  d: {
    asset: string, // File path to the desired prefab.
    id: string, // (Optional) Unique id for referencing prefab later. Random id will be given by default.
    track: string, // (Optional) Track to animate prefab transform.
    position: vector3, // (Optional) Set position.
    localPosition: vector3, // (Optional) Set localPosition.
    rotation: vector3, // (Optional) Set rotation (in euler angles).
    localRotation: vector3. // (Optional) Set localRotation (in euler angles).
    scale: vector3 //(Optional) Set scale.
  }
});


customEvents.push({
  b: float, // Time in beats.
  t: "Blit",
  d: {
    asset: string, // (Optional) File path to the desired material. If missing, will just copy from source to destination without anything special.
    priority: int, // (Optional) Which order to run current active post processing effects. Higher priority will run first. Default = 0
    pass: int, // (Optional) Which pass in the shader to use. Will use all passes if not defined.
    source: string, // (Optional) Which texture to pass to the shader as "_MainTex". "_Main" is reserved for the camera. Default = "_Main"
    destination: string, // (Optional) Which render texture to save to. Can be an array. "_Main" is reserved for the camera. Default = "_Main"
    duration: float, // (Optional) How long will this material be applied. Default = 0
    easing: string, // (Optional) See SetMaterialProperty.
    properties: ? // (Optional) See SetMaterialProperty.
  }
});


customEvents.push({
  b: float, // Time in beats.
  t: "DeclareCullingTexture",
  d: {
    id: string // Name of the culling mask, this is what you must name your sampler in your shader.
    track: string/string[] // Name(s) of your track(s). Everything on the track(s) will be added to this mask.
    whitelist: bool // (Optional) When true, will cull everything but the selected tracks. Default = false.
    depthTexture: bool // (Optional) When true, write depth texture to "'name'_Depth". Default = false.
  }
});

//Example where notes are not rendered on the right side of the screen
sampler2D _NotesCulled;

fixed4 frag(v2f i) : SV_Target
{
  if (i.uv.x > 0.5)
  {
    return tex2D(_NotesCulled, i.uv);
  }
  else {
    return tex2D(_MainTex, i.uv);
  }
}


customEvents.push({
  b: float, // Time in beats.
  t: "DeclareRenderTexture",
  d: {
    id: string, // Name of the texture
    xRatio: float, // (Optional) Number to divide width by, i.e. on a 1920x1080 screen, an xRatio of 2 will give you a 960x1080 texture.
    yRatio: float, // (Optional) Number to divide height by.
    width: int, // (Optional) Exact width for the texture.
    height: int, // (Optional) Exact height for the texture.
    colorFormat: string, // (Optional) https://docs.unity3d.com/ScriptReference/RenderTextureFormat.html
    filterMode: string // (Optional) https://docs.unity3d.com/ScriptReference/FilterMode.html
  }
});


customEvents.push({
  b: float, // Time in beats.
  t: "DestroyTexture",
  d: {
    id: string or string[], // Names(s) of textures to destroy.
  }
});


customEvents.push({
  b: float, // Time in beats.
  t: "DestroyPrefab",
  d: {
    id: string or string[], // Id(s) of prefab to destroy.
  }
});


customEvents.push({
  b: float, // Time in beats.
  t: "SetAnimatorProperty",
  d: {
    id: string, // Id assigned to prefab.
    duration: float, // (Optional) The length of the event in beats. Defaults to 0.
    easing: string, // (Optional) An easing for the animation to follow. Defaults to "easeLinear".
    properties: [{
      id: string, // Name of the property.
      type: string, // Type of the property (Bool, Float, Trigger).
      value: ? // What to set the property to, type varies depending on property type.
    }]
  }
});


customEvents.push({
  b: float, // Time in beats.
  t: "SetCameraProperty",
  d: {
    depthTextureMode: [] // Sets the depth texture mode on the camera. Can be [Depth, DepthNormals, MotionVectors].
  }
});


customEvents.push({
  b: float, // Time in beats.
  t: "AssignTrackPrefab",
  d: {
    track: string, // Only objects on this track will be affected.
    note: string // File path to the desired prefab to replace notes.
  }
});


customEvents.push({
  b: float, // Time in beats.
  t: "SetRenderSetting",
  d: {
    duration: float, // (Optional) The length of the event in beats. Defaults to 0.
    easing: string, // (Optional) An easing for the animation to follow. Defaults to "easeLinear".
    property: point definition // The setting to set
  }
});

customEvents.push({
  b: float, // Time in beats.
  t: "CreateCamera",
  d: {
    id: string, // Id of the camera.
    texture: string, // (Optional) Will render to a new texture set to this key.
    depthTexture: string // (Optional) Renders just the depth to this texture.
    properties: ? // (Optional) See SetCameraProperty
  }
});

customEvents.push({
  b: float, // Time in beats.
  t: "CreateScreenTexture",
  d: {
    id: string, // Name of the texture
    xRatio: float, // (Optional) Number to divide width by, i.e. on a 1920x1080 screen, an xRatio of 2 will give you a 960x1080 texture.
    yRatio: float, // (Optional) Number to divide height by.
    width: int, // (Optional) Exact width for the texture.
    height: int, // (Optional) Exact height for the texture.
    colorFormat: string, // (Optional) https://docs.unity3d.com/ScriptReference/RenderTextureFormat.html
    filterMode: string // (Optional) https://docs.unity3d.com/ScriptReference/FilterMode.html
  }
});

customEvents.push({
  b: float, // Time in beats.
  t: "DestroyObject",
  d: {
    id: string or string[], // Id(s) of object to destroy.
  }
});

customEvents.push({
  b: float, // Time in beats.
  t: "AssignObjectPrefab",
  d: {
    loadMode: string, // (Optional) How to load the asset (Single, Additive).
    object: {} // See below
  }
});
for (var i =0; i<=200; i+=1) {

}

*/

//#region                       -  -  -  -  -  -  -  -  -  -  -  -  -  DO YOUR DIRTY WORK HERE  -  -  -  -  -  -  -  -  -  -  -  -  -

customEvents.push({
  b: 1,
  t: "AssignPlayerToTrack",
  d: {
  track: "playerTrack",
  }
});


obstacles.push({
  b: 71,
  x: 0,
  y: 0,   //base 0-2
  d: 3, //duration
  h: 3232,   //height 1-5
  w: 0,   //width
  customData:{
    track: "wallsizeUP",
    noteJumpStartBeatOffset: 5,
    noteJumpMovementSpeed: 2,
    uninteractable: true,
    coordinates: [-4, 2],
    size: [5, 2, 3],
  }
});
customEvents.push({
  b: 73,
  t: "AnimateTrack",
  d: {
    track: "wallsizeUP",
    duration: 3,
    easing: "easeOutQuad",
    scale: [232, 342, 232],
    offsetPosition: [[0, 0, 0, 0],
                    [2, -4, 3, 0.3]]
  }
});    
filterednotes = bombs.filter(n => n.b >= 0 && n.b <= 420);
filterednotes.forEach(bomb => {
  bomb.customData.track = "ahhhhhhhhhhhhhhh";
  bomb.customData.noteJumpStartBeatOffset = -2;
  bomb.customData.noteJumpMovementSpeed = 13;
});
filterednotes = notes.filter(n => n.b >= 0 && n.b <= 42699);
filterednotes.forEach(note => {
  note.customData.track = "naf23me";
  note.customData.noteJumpStartBeatOffset = -2;
  note.customData.noteJumpMovementSpeed = 13;
  note.customData.disableBadCutDirection = true;
  note.customData.disableBadCutSpeed = true;
  note.customData.disableBadCutSaberType = true;
});

customEvents.push({
  b: 150,
  t: "AnimateTrack",
  d: {
    track: "uhhnono",
    duration: 5,
    easing: "easeOutQuad",
    repeat: 6969,
    dissolve:   [
    [1,0],
    [0, 0.25],
    [0.5, 0.50],
    [0.65, 0.75],
    [0,1]
    ]
  }
});

customEvents.push({
  b: 170,
  t: "AnimateTrack",
  d: {
    track: "uhhnono2",
    duration: 5,
    easing: "easeOutQuad",
          repeat: 6969,
    dissolve:   [[1,0],  [0, 0.4],
  [0.9, 0.50],
  [0.65, 0.75],  [0,1]]
  }
});

customEvents.push({
  b: 277,
  t: "AnimateTrack",
  d: {
    track: "whatthesigma?",
    duration: 3,
    easing: "easeOutQuad",
      repeat: 6969, 
    scale: [[1, 1, 1, 0], [2, 0.5, 0.5, 0.2], [1, 1, 1, 1]],
      }
    
});  

customEvents.push({
  b: 368.1,
  t: "AnimateTrack",
  d: {
    track: "ThisIsProbablyTheLeastEffecientWayToDoThis",
    duration: 2,
    easing: "easeOutQuad",
      repeat: 6969, 
    scale: [[1, 1, 1, 0], [0.5, 10, 0.5, 0.2], [1, 1, 1, 1]],
      }
    
});  

customEvents.push({
  b: 532,
  t: "AnimateTrack",
  d: {
    track: "sig",
    duration: 1.5,
      repeat: 6969, 
    dissolveArrow: [[0.8, 0], [0, 1] ]
      }
    
});  
filterednotes = notes.filter(n => n.b >= 532 && n.b <= 571);
filterednotes.forEach(note => {
  note.customData.track = "calm";
  note.customData.noteJumpStartBeatOffset = -2;
  note.customData.noteJumpMovementSpeed = 13;
  note.customData.disableBadCutDirection = true;
  note.customData.disableBadCutSpeed = true;
  note.customData.disableBadCutSaberType = true;
});

filterednotes = notes.filter(n => n.b >= 149 && n.b <= 164.2);
filterednotes.forEach(note => {
  note.customData.track = "uhhnono";
  note.customData.noteJumpStartBeatOffset = -2;
  note.customData.noteJumpMovementSpeed = 13;
  note.customData.disableBadCutDirection = true;
  note.customData.disableBadCutSpeed = true;
  note.customData.disableBadCutSaberType = true;
});
filterednotes = notes.filter(n => n.b >= 170 && n.b <= 277);
filterednotes.forEach(note => {
  note.customData.track = "uhhnono2";
  note.customData.noteJumpStartBeatOffset = -2;
  note.customData.noteJumpMovementSpeed = 13;
  note.customData.disableBadCutDirection = true;
  note.customData.disableBadCutSpeed = true;
  note.customData.disableBadCutSaberType = true;
});
filterednotes = notes.filter(n => n.b >= 277 && n.b <= 337);
filterednotes.forEach(note => {
  note.customData.track = "whatthesigma?";
  note.customData.noteJumpStartBeatOffset = -2;
  note.customData.noteJumpMovementSpeed = 13;
  note.customData.disableBadCutDirection = true;
  note.customData.disableBadCutSpeed = true;
  note.customData.disableBadCutSaberType = true;
});
filterednotes = notes.filter(n => n.b >= 368 && n.b <= 403.1);
filterednotes.forEach(note => {
  note.customData.track = "ThisIsProbablyTheLeastEffecientWayToDoThis";
  note.customData.noteJumpStartBeatOffset = -2;
  note.customData.noteJumpMovementSpeed = 13;
  note.customData.disableBadCutDirection = true;
  note.customData.disableBadCutSpeed = true;
  note.customData.disableBadCutSaberType = true;
});
filterednotes = bombs.filter(n => n.b >= 443 && n.b <= 445);
filterednotes.forEach(bomb => {
  let b1 = JSON.parse(JSON.stringify(bomb));
    b1.customData.track = "meow";
    b1.customData.disableNoteGravity = true;
    b1.customData.uninteractable = true;
    b1.customData.noteJumpStartBeatOffset = 69;
    b1.customData.noteJumpMovementSpeed = 1;
    b1.customData.animation = {}
    b1.customData.animation.scale = [[0.5, 0.5, 0.5, 0]];
  fakeBombs.push(b1);
});
customEvents.push({
  b: 0,
  t: "AssignTrackParent",
  d: {
  childrenTracks: "meow", 
  parentTrack: "bombba" ,
  worldPositionStays: true,
  }
});
customEvents.push({
  b: 2,
  t: "AnimateTrack",
  d: {
    track: "bombba",
    scale: [0.5,0.25,0.25],
  }
});   
filterednotes = notes.filter(n => n.b >= 105.75 && n.b <= 105.75);
filterednotes.forEach(n1 => {
  n1.customData.track = "na1me";
  n1.customData.noteJumpStartBeatOffset = 0;
  n1.customData.noteJumpMovementSpeed = 16;
  n1.customData.disableBadCutDirection = true;
  n1.customData.disableBadCutSpeed = true;
  n1.customData.disableBadCutSaberType = true;
  n1.customData.animation = {}
  n1.customData.animation.offsetWorldRotation = [[0, 180, 0, 0]];
    fakeNotes.push(n1);
});

filterednotes = notes.filter(n => n.b >= 244 && n.b <= 244);
filterednotes.forEach(note => {
  note.customData.track = "fuck";
  note.customData.animation = {}
});
customEvents.push({
  b: 244,
  t: "AnimateTrack",
  d: {
    track: "fuck",
    duration: 1/3,
    time: [1],
    offsetPosition: [[0,0.15,-12,0],[0,0.1,-15,1]],
    repeat: 6969,
  }
});   
customEvents.push({
  b: 248,
  t: "AnimateTrack",
  d: {
    track: "fuck",
    duration: 1/3,
    offsetPosition: [[0,0.15,-15,0]]
  }
});   
customEvents.push({
  b: 248.25,
  t: "AnimateTrack",
  d: {
    track: "fuck",
    duration: 1/3,
    time: [0],
  }                       
});   
filterednotes = notes.filter(n => n.b >= 132 && n.b <= 134);
filterednotes.forEach(note => {
  for (let i = 0; i < 1; i++) {
    let dupe = JSON.parse(JSON.stringify(note));
    dupe.customData.disableNoteGravity = true;
    dupe.customData.track = "fakeNote";
    dupe.customData.animation = {}
    dupe.customData.animation.offsetWorldRotation = [[0, 15, 0, 0]];
      fakeNotes.push(dupe);
  }
  for (let i = 0; i < 1; i++) {
    let dupe = JSON.parse(JSON.stringify(note));
    dupe.customData.disableNoteGravity = true;
    dupe.customData.track = "fakeNote";
    dupe.customData.animation = {}
    dupe.customData.animation.offsetWorldRotation = [[0, 30, 0, 0]];
      fakeNotes.push(dupe);
  }
  for (let i = 0; i < 1; i++) {
    let dupe = JSON.parse(JSON.stringify(note));
    dupe.customData.disableNoteGravity = true;
    dupe.customData.track = "fakeNote";
    dupe.customData.animation = {}
    dupe.customData.animation.offsetWorldRotation = [[0, 45, 0, 0]];
      fakeNotes.push(dupe);
  }
  for (let i = 0; i < 1; i++) {
    let dupe = JSON.parse(JSON.stringify(note));
    dupe.customData.disableNoteGravity = true;
    dupe.customData.track = "fakeNote";
    dupe.customData.animation = {}
    dupe.customData.animation.offsetWorldRotation = [[0, 60, 0, 0]];
      fakeNotes.push(dupe);
  }
  for (let i = 0; i < 1; i++) {
    let dupe = JSON.parse(JSON.stringify(note));
    dupe.customData.disableNoteGravity = true;
    dupe.customData.track = "fakeNote";
    dupe.customData.animation = {}
    dupe.customData.animation.offsetWorldRotation = [[0, 75, 0, 0]];
      fakeNotes.push(dupe);
  }
  for (let i = 0; i < 1; i++) {
    let dupe = JSON.parse(JSON.stringify(note));
    dupe.customData.disableNoteGravity = true;
    dupe.customData.track = "fakeNote";
    dupe.customData.animation = {}
    dupe.customData.animation.offsetWorldRotation = [[0, 90, 0, 0]];
      fakeNotes.push(dupe);
  }
  for (let i = 0; i < 1; i++) {
    let dupe = JSON.parse(JSON.stringify(note));
    dupe.customData.disableNoteGravity = true;
    dupe.customData.track = "fakeNote";
    dupe.customData.animation = {}
    dupe.customData.animation.offsetWorldRotation = [[0, 15+90, 0, 0]];
      fakeNotes.push(dupe);
  }
  for (let i = 0; i < 1; i++) {
    let dupe = JSON.parse(JSON.stringify(note));
    dupe.customData.disableNoteGravity = true;
    dupe.customData.track = "fakeNote";
    dupe.customData.animation = {}
    dupe.customData.animation.offsetWorldRotation = [[0, 30+90, 0, 0]];
      fakeNotes.push(dupe);
  }
  for (let i = 0; i < 1; i++) {
    let dupe = JSON.parse(JSON.stringify(note));
    dupe.customData.disableNoteGravity = true;
    dupe.customData.track = "fakeNote";
    dupe.customData.animation = {}
    dupe.customData.animation.offsetWorldRotation = [[0, 45+90, 0, 0]];
      fakeNotes.push(dupe);
  }
  for (let i = 0; i < 1; i++) {
    let dupe = JSON.parse(JSON.stringify(note));
    dupe.customData.disableNoteGravity = true;
    dupe.customData.track = "fakeNote";
    dupe.customData.animation = {}
    dupe.customData.animation.offsetWorldRotation = [[0, 60+90, 0, 0]];
      fakeNotes.push(dupe);
  }
  for (let i = 0; i < 1; i++) {
    let dupe = JSON.parse(JSON.stringify(note));
    dupe.customData.disableNoteGravity = true;
    dupe.customData.track = "fakeNote";
    dupe.customData.animation = {}
    dupe.customData.animation.offsetWorldRotation = [[0, 75+90, 0, 0]];
      fakeNotes.push(dupe);
  }
  for (let i = 0; i < 1; i++) {
    let dupe = JSON.parse(JSON.stringify(note));
    dupe.customData.disableNoteGravity = true;
    dupe.customData.track = "fakeNote";
    dupe.customData.animation = {}
    dupe.customData.animation.offsetWorldRotation = [[0, 90+90, 0, 0]];
      fakeNotes.push(dupe);
  }
  



  for (let i = 0; i < 1; i++) {
    let dupe = JSON.parse(JSON.stringify(note));
    dupe.customData.disableNoteGravity = true;
    dupe.customData.track = "fakeNote";
    dupe.customData.animation = {}
    dupe.customData.animation.offsetWorldRotation = [[0, -15, 0, 0]];
      fakeNotes.push(dupe);
  }
  for (let i = 0; i < 1; i++) {
    let dupe = JSON.parse(JSON.stringify(note));
    dupe.customData.disableNoteGravity = true;
    dupe.customData.track = "fakeNote";
    dupe.customData.animation = {}
    dupe.customData.animation.offsetWorldRotation = [[0, -30, 0, 0]];
      fakeNotes.push(dupe);
  }
  for (let i = 0; i < 1; i++) {
    let dupe = JSON.parse(JSON.stringify(note));
    dupe.customData.disableNoteGravity = true;
    dupe.customData.track = "fakeNote";
    dupe.customData.animation = {}
    dupe.customData.animation.offsetWorldRotation = [[0, -45, 0, 0]];
      fakeNotes.push(dupe);
  }
  for (let i = 0; i < 1; i++) {
    let dupe = JSON.parse(JSON.stringify(note));
    dupe.customData.disableNoteGravity = true;
    dupe.customData.track = "fakeNote";
    dupe.customData.animation = {}
    dupe.customData.animation.offsetWorldRotation = [[0, -60, 0, 0]];
      fakeNotes.push(dupe);
  }
  for (let i = 0; i < 1; i++) {
    let dupe = JSON.parse(JSON.stringify(note));
    dupe.customData.disableNoteGravity = true;
    dupe.customData.track = "fakeNote";
    dupe.customData.animation = {}
    dupe.customData.animation.offsetWorldRotation = [[0, -75, 0, 0]];
      fakeNotes.push(dupe);
  }
  for (let i = 0; i < 1; i++) {
    let dupe = JSON.parse(JSON.stringify(note));
    dupe.customData.disableNoteGravity = true;
    dupe.customData.track = "fakeNote";
    dupe.customData.animation = {}
    dupe.customData.animation.offsetWorldRotation = [[0, -90, 0, 0]];
      fakeNotes.push(dupe);
  }
  for (let i = 0; i < 1; i++) {
    let dupe = JSON.parse(JSON.stringify(note));
    dupe.customData.disableNoteGravity = true;
    dupe.customData.track = "fakeNote";
    dupe.customData.animation = {}
    dupe.customData.animation.offsetWorldRotation = [[0, -15-90, 0, 0]];
      fakeNotes.push(dupe);
  }
  for (let i = 0; i < 1; i++) {
    let dupe = JSON.parse(JSON.stringify(note));
    dupe.customData.disableNoteGravity = true;
    dupe.customData.track = "fakeNote";
    dupe.customData.animation = {}
    dupe.customData.animation.offsetWorldRotation = [[0, -30-90, 0, 0]];
      fakeNotes.push(dupe);
  }
  for (let i = 0; i < 1; i++) {
    let dupe = JSON.parse(JSON.stringify(note));
    dupe.customData.disableNoteGravity = true;
    dupe.customData.track = "fakeNote";
    dupe.customData.animation = {}
    dupe.customData.animation.offsetWorldRotation = [[0, -45-90, 0, 0]];
      fakeNotes.push(dupe);
  }
  for (let i = 0; i < 1; i++) {
    let dupe = JSON.parse(JSON.stringify(note));
    dupe.customData.disableNoteGravity = true;
    dupe.customData.track = "fakeNote";
    dupe.customData.animation = {}
    dupe.customData.animation.offsetWorldRotation = [[0, -60-90, 0, 0]];
      fakeNotes.push(dupe);
  }
  for (let i = 0; i < 1; i++) {
    let dupe = JSON.parse(JSON.stringify(note));
    dupe.customData.disableNoteGravity = true;
    dupe.customData.track = "fakeNote";
    dupe.customData.animation = {}
    dupe.customData.animation.offsetWorldRotation = [[0, -75-90, 0, 0]];
      fakeNotes.push(dupe);
  }
  for (let i = 0; i < 1; i++) {
    let dupe = JSON.parse(JSON.stringify(note));
    dupe.customData.disableNoteGravity = true;
    dupe.customData.track = "fakeNote";
    dupe.customData.animation = {}
    dupe.customData.animation.offsetWorldRotation = [[0, -90-90, 0, 0]];
      fakeNotes.push(dupe);
  }
});

filterednotes = notes.filter(n => n.b >= 131 && n.b <= 131);
filterednotes.forEach(note => {
  note.customData.track = "nf232  fame";
  note.customData.noteJumpStartBeatOffset = 1;
  note.customData.noteJumpMovementSpeed = 1;
});

filterednotes = notes.filter(n => n.b >= 114 && n.b <= 118);
filterednotes.forEach(note => {
  note.customData.track = "n123 ame";
  note.customData.noteJumpStartBeatOffset = 0;
  note.customData.noteJumpMovementSpeed = 10;
});
filterednotes = notes.filter(n => n.b >= 392 && n.b <= 399);
filterednotes.forEach(note => {

  note.customData.animation = {}
  note.customData.animation.dissolve = [[0, 0]];
  note.customData.animation.dissolveArrow = [[0, 0]];
  let n1 = JSON.parse(JSON.stringify(note));
  n1.b -= 0.025;
  n1.customData.track = "a";
  n1.customData.noteJumpStartBeatOffset = 0;
  n1.customData.noteJumpMovementSpeed = 13;
  n1.customData.animation = {}
  n1.customData.animation.dissolve = [[1, 0]];
  n1.customData.animation.dissolveArrow = [[1, 0]];
  fakeNotes.push(n1);
});
customEvents.push({
  b: 392,
  t: "AnimateTrack",
  d: {
    track: "a",
    duration: 1,
    easing: "easeOutQuad",
    offsetPosition: [[0, 0, 0, 0], [0, 0, 1.5, 0.75,"easeOutCubic"],[0,0,0,1,"easeInSine"]],
    scale: [[2, 2, 1.5, 0], [1, 1, 1, 1,"easeOutQuad"]],
    repeat: 69
  }
}); 
filterednotes = notes.filter(n => n.b >= 409 && n.b <= 436);
filterednotes.forEach(note => {
  note.customData.track = "n123 ame";
  note.customData.noteJumpStartBeatOffset = -2;
  note.customData.noteJumpMovementSpeed = 14;
});
customEvents.push({
  b: 409,
  t: "AnimateTrack",
  d: {
    track: "n123 ame",
    duration: 1,
    easing: "easeOutQuad",
    scale: [[1.69, 1.69, 1.5, 0], [1, 1, 1, 1,"easeOutCubic"]],
    repeat: 69
  }
}); 
filterednotes = notes.filter(n => n.b >= 532 && n.b <= 42699);
filterednotes.forEach(note => {
  note.customData.track = "sig";
  note.customData.noteJumpStartBeatOffset = -2;
  note.customData.noteJumpMovementSpeed = 13;
  note.customData.disableBadCutDirection = true;
  note.customData.disableBadCutSpeed = true;
  note.customData.disableBadCutSaberType = true;
});
customEvents.push({
  b: 2,
  t: "AssignTrackParent",
  d: {
  childrenTracks: ["playerTrack", "sig"], 
  parentTrack: "hi risky" ,
  }
});
customEvents.push({
  b: 528,
  t: "AnimateTrack",
  d: {
    track: "hi risky",
    duration: 4,
    position: [0, 0, 0],
    rotation: [1, 1, 1]
  }
});  
customEvents.push({
  b: 536,
  t: "AnimateTrack",
  d: {
    track: "hi risky",
    duration: 4,
    position: [[0, 0, 0,0], [20, 20, 20,1]],
    rotation: [20, -60, -50],
  }
});  

  customEvents.push({
  b: 540,
  t: "AnimateTrack",
  d: {
    track: "hi risky",
    duration: 4,
    position: [[0, 0, 0,0], [-30, -30, -30,1]],
    rotation: [20, 20, 20],
  }
});  

customEvents.push({
  b: 544,
  t: "AnimateTrack",
  d: {
    track: "hi risky",
    duration: 4,
    position: [[0, 0, 0,0], [40, 40, 40,1]],
  }
});  

customEvents.push({
  b: 548,
  t: "AnimateTrack",
  d: {
    track: "hi risky",
    duration: 4,
    position: [ [0, 0, 0,0], [-50, -50, -50,1] ],
  }
});  
      customEvents.push({
  b: 552,
  t: "AnimateTrack",
  d: {
    track: "hi risky",
    duration: 4,
    position: [ [0, 0, 0,0], [60, 60, 60,1] ],
    rotation: [160, 0, -200]
  }
});  
      customEvents.push({
  b: 556,
  t: "AnimateTrack",
  d: {
    track: "hi risky",
    duration: 4,
    position: [ [0, 0, 0,0], [-70, -70, -70,1] ],
    rotation: [-20, -50, 2]
  }
});  
      customEvents.push({
  b: 558,
  t: "AnimateTrack",
  d: {
    track: "hi risky",
    duration: 4,
    position: [ [0, 0, 0,0], [50, 90, 20,1] ],
    rotation: [-32, -10, 307]
  }
});  
customEvents.push({
  b: 560,
  t: "AnimateTrack",
  d: {
    track: "hi risky",
    duration: 4,
    position: [ [0, 0, 0,0], [-5, 420, -20,1] ],
    rotation: [90, 545, 43]
  }
});  
customEvents.push({
  b: 564,
  t: "AnimateTrack",
  d: {
    track: "hi risky",
    duration: 4,
    position: [[0, 0, 0,0], [0, 0, -5,1]],
    rotation: [0, 0, 0]
  }
});  
// NOTE MODS NOTE MODS NOTE MODS NOTE MODS NOTE MODS NOTE MODS NOTE MODS NOTE MODS NOTE MODS NOTE MODS NOTE MODS NOTE MODS NOTE MODS NOTE MODS NOTE MODS NOTE MODS NOTE MODS NOTE MODS NOTE MODS NOTE MODS NOTE MODS NOTE MODS 
environment.push(
  {id: "PanicEnvironment.[0]Environment.[28]RotatingLasersPair", lookupMethod: "Exact", scale: [1,1.5,8],position: [0,4.20,5]},
  {id: "PanicEnvironment.[0]Environment.[29]RotatingLasersPair (1)", lookupMethod: "Exact", scale: [1,1.5,8],position: [0,4.20,10]},
  {id: "PanicEnvironment.[0]Environment.[30]RotatingLasersPair (2)", lookupMethod: "Exact", scale: [1,1.5,8],position: [0,4.20,15]},
  {id: "PanicEnvironment.[0]Environment.[31]RotatingLasersPair (3)", lookupMethod: "Exact", scale: [1,1.5,8],position: [0,4.20,20]},
  {id: "PanicEnvironment.[0]Environment.[32]RotatingLasersPair (4)", lookupMethod: "Exact", scale: [1,1.5,8],position: [0,4.20,25]},
  {id: "PanicEnvironment.[0]Environment.[33]RotatingLasersPair (5)", lookupMethod: "Exact", scale: [1,1.5,8],position: [0,4.20,30]},
  {id: "PanicEnvironment.[0]Environment.[34]RotatingLasersPair (6)", lookupMethod: "Exact", scale: [1,1.5,8],position: [0,4.20,35]},


  {id: "PanicEnvironment.[0]Environment.[28]RotatingLasersPair", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,5+35]},
  {id: "PanicEnvironment.[0]Environment.[29]RotatingLasersPair (1)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,10+35]},
  {id: "PanicEnvironment.[0]Environment.[30]RotatingLasersPair (2)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,15+35]},
  {id: "PanicEnvironment.[0]Environment.[31]RotatingLasersPair (3)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,20+35]},
  {id: "PanicEnvironment.[0]Environment.[32]RotatingLasersPair (4)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,25+35]},
  {id: "PanicEnvironment.[0]Environment.[33]RotatingLasersPair (5)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,30+35]},
  {id: "PanicEnvironment.[0]Environment.[34]RotatingLasersPair (6)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,35+35]},

  {id: "PanicEnvironment.[0]Environment.[28]RotatingLasersPair", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,5+70]},
  {id: "PanicEnvironment.[0]Environment.[29]RotatingLasersPair (1)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,10+70]},
  {id: "PanicEnvironment.[0]Environment.[30]RotatingLasersPair (2)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,15+70]},
  {id: "PanicEnvironment.[0]Environment.[31]RotatingLasersPair (3)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,20+70]},
  {id: "PanicEnvironment.[0]Environment.[32]RotatingLasersPair (4)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,25+70]},
  {id: "PanicEnvironment.[0]Environment.[33]RotatingLasersPair (5)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,30+70]},
  {id: "PanicEnvironment.[0]Environment.[34]RotatingLasersPair (6)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,35+70]},

  {id: "PanicEnvironment.[0]Environment.[28]RotatingLasersPair", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,5+105]},
  {id: "PanicEnvironment.[0]Environment.[29]RotatingLasersPair (1)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,10+105]},
  {id: "PanicEnvironment.[0]Environment.[30]RotatingLasersPair (2)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,15+105]},
  {id: "PanicEnvironment.[0]Environment.[31]RotatingLasersPair (3)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,20+105]},
  {id: "PanicEnvironment.[0]Environment.[32]RotatingLasersPair (4)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,25+105]},
  {id: "PanicEnvironment.[0]Environment.[33]RotatingLasersPair (5)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,30+105]},
  {id: "PanicEnvironment.[0]Environment.[34]RotatingLasersPair (6)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,35+105]},

  {id: "PanicEnvironment.[0]Environment.[28]RotatingLasersPair", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,5+0.25]},
  {id: "PanicEnvironment.[0]Environment.[29]RotatingLasersPair (1)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,10+0.25]},
  {id: "PanicEnvironment.[0]Environment.[30]RotatingLasersPair (2)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,15+0.25]},
  {id: "PanicEnvironment.[0]Environment.[31]RotatingLasersPair (3)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,20+0.25]},
  {id: "PanicEnvironment.[0]Environment.[32]RotatingLasersPair (4)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,25+0.25]},
  {id: "PanicEnvironment.[0]Environment.[33]RotatingLasersPair (5)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,30+0.25]},
  {id: "PanicEnvironment.[0]Environment.[34]RotatingLasersPair (6)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,35+0.25]},


  {id: "PanicEnvironment.[0]Environment.[28]RotatingLasersPair", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,5+35+0.25]},
  {id: "PanicEnvironment.[0]Environment.[29]RotatingLasersPair (1)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,10+35+0.25]},
  {id: "PanicEnvironment.[0]Environment.[30]RotatingLasersPair (2)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,15+35+0.25]},
  {id: "PanicEnvironment.[0]Environment.[31]RotatingLasersPair (3)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,20+35+0.25]},
  {id: "PanicEnvironment.[0]Environment.[32]RotatingLasersPair (4)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,25+35+0.25]},
  {id: "PanicEnvironment.[0]Environment.[33]RotatingLasersPair (5)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,30+35+0.25]},
  {id: "PanicEnvironment.[0]Environment.[34]RotatingLasersPair (6)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,35+35+0.25]},

  {id: "PanicEnvironment.[0]Environment.[28]RotatingLasersPair", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,5+70+0.25]},
  {id: "PanicEnvironment.[0]Environment.[29]RotatingLasersPair (1)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,10+70+0.25]},
  {id: "PanicEnvironment.[0]Environment.[30]RotatingLasersPair (2)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,15+70+0.25]},
  {id: "PanicEnvironment.[0]Environment.[31]RotatingLasersPair (3)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,20+70+0.25]},
  {id: "PanicEnvironment.[0]Environment.[32]RotatingLasersPair (4)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,25+70+0.25]},
  {id: "PanicEnvironment.[0]Environment.[33]RotatingLasersPair (5)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,30+70+0.25]},
  {id: "PanicEnvironment.[0]Environment.[34]RotatingLasersPair (6)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,35+70+0.25]},

  {id: "PanicEnvironment.[0]Environment.[28]RotatingLasersPair", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,5+105+0.25]},
  {id: "PanicEnvironment.[0]Environment.[29]RotatingLasersPair (1)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,10+105+0.25]},
  {id: "PanicEnvironment.[0]Environment.[30]RotatingLasersPair (2)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,15+105+0.25]},
  {id: "PanicEnvironment.[0]Environment.[31]RotatingLasersPair (3)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,20+105+0.25]},
  {id: "PanicEnvironment.[0]Environment.[32]RotatingLasersPair (4)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,25+105+0.25]},
  {id: "PanicEnvironment.[0]Environment.[33]RotatingLasersPair (5)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,30+105+0.25]},
  {id: "PanicEnvironment.[0]Environment.[34]RotatingLasersPair (6)", lookupMethod: "Exact",duplicate: 1, scale: [1,1.5,8],position: [0,4.20,35+105+0.25]},

  {id: "GameCore.[1]Panels4TrackLaneRing(Clone)", lookupMethod: "Exact", scale: [1, 1.5, 8]},
  {id: "GameCore.[2]Panels4TrackLaneRing(Clone)", lookupMethod: "Exact", scale: [1, 1.5, 8]},
  {id: "GameCore.[3]Panels4TrackLaneRing(Clone)", lookupMethod: "Exact", scale: [1, 1.5, 8]},
  {id: "GameCore.[4]Panels4TrackLaneRing(Clone)", lookupMethod: "Exact", scale: [1, 1.5, 8]},
  {id: "GameCore.[5]Panels4TrackLaneRing(Clone)", lookupMethod: "Exact", scale: [1, 1.5, 8]},
  {id: "GameCore.[6]Panels4TrackLaneRing(Clone)", lookupMethod: "Exact", scale: [1, 1.5, 8]},
  {id: "GameCore.[7]Panels4TrackLaneRing(Clone)", lookupMethod: "Exact", scale: [1, 1.5, 8]},
  {id: "GameCore.[8]Panels4TrackLaneRing(Clone)", lookupMethod: "Exact", scale: [1, 1.5, 8]},
  {id: "GameCore.[9]Panels4TrackLaneRing(Clone)", lookupMethod: "Exact", scale: [1, 1.5, 8]},
  {id: "GameCore.[10]Panels4TrackLaneRing(Clone)", lookupMethod: "Exact", scale: [1, 1.5, 8]},
  {id: "GameCore.[11]Panels4TrackLaneRing(Clone)", lookupMethod: "Exact", scale: [1, 1.5, 8]},
  {id: "GameCore.[12]Panels4TrackLaneRing(Clone)", lookupMethod: "Exact", scale: [1, 1.5, 8]},
  {id: "GameCore.[13]Panels4TrackLaneRing(Clone)", lookupMethod: "Exact", scale: [1, 1.5, 8]},
  {id: "GameCore.[14]Panels4TrackLaneRing(Clone)", lookupMethod: "Exact", scale: [1, 1.5, 8]},
  {id: "GameCore.[15]Panels4TrackLaneRing(Clone)", lookupMethod: "Exact", scale: [1, 1.5, 8]},
  {id: "GameCore.[16]Panels4TrackLaneRing(Clone)", lookupMethod: "Exact", scale: [1, 1.5, 8]},
  {id: "GameCore.[17]Panels4TrackLaneRing(Clone)", lookupMethod: "Exact", scale: [1, 1.5, 8]},
  {id: "GameCore.[18]Panels4TrackLaneRing(Clone)", lookupMethod: "Exact", scale: [1, 1.5, 8]},
  {id: "GameCore.[19]Panels4TrackLaneRing(Clone)", lookupMethod: "Exact", scale: [1, 1.5, 8]},
  {id: "GameCore.[20]Panels4TrackLaneRing(Clone)", lookupMethod: "Exact", scale: [1, 1.5, 8]},
  {id: "GameCore.[21]Panels4TrackLaneRing(Clone)", lookupMethod: "Exact", scale: [1, 1.5, 8]},
  {id: "GameCore.[22]Panels4TrackLaneRing(Clone)", lookupMethod: "Exact", scale: [1, 1.5, 8]},
  {id: "GameCore.[23]Panels4TrackLaneRing(Clone)", lookupMethod: "Exact", scale: [1, 1.5, 8]},
  {id: "GameCore.[24]Panels4TrackLaneRing(Clone)", lookupMethod: "Exact", scale: [1, 1.5, 8]},
  {id: "GameCore.[25]Panels4TrackLaneRing(Clone)", lookupMethod: "Exact", scale: [1, 1.5, 8]},
  {id: "GameCore.[26]Panels4TrackLaneRing(Clone)", lookupMethod: "Exact", scale: [1, 1.5, 8]},
  {id: "GameCore.[27]Panels4TrackLaneRing(Clone)", lookupMethod: "Exact", scale: [1, 1.5, 8]},
  {id: "GameCore.[28]Panels4TrackLaneRing(Clone)", lookupMethod: "Exact", scale: [1, 1.5, 8]},
  {id: "GameCore.[29]Panels4TrackLaneRing(Clone)", lookupMethod: "Exact", scale: [1, 1.5, 8]},
  {id: "GameCore.[30]Panels4TrackLaneRing(Clone)", lookupMethod: "Exact", scale: [1, 1.5, 8]},
  
  {id: "PanicEnvironment.[0]Environment.[3]BackColumns", lookupMethod: "Exact", active: false},

  {id: "PanicEnvironment.[0]Environment.[21]ConstructionGlowLine (6)", lookupMethod: "Exact",duplicate: 1, scale: [2,2,2],position: [-3,-2,-2]},
  {id: "PanicEnvironment.[0]Environment.[22]ConstructionGlowLine (7)", lookupMethod: "Exact",duplicate: 1, scale: [3,3,3],position: [3,-2,-2]},
  {id: "PanicEnvironment.[0]Environment.[21]ConstructionGlowLine (6)", lookupMethod: "Exact",duplicate: 1, scale: [3,3,3],position: [-4,-2,-2]},
  {id: "PanicEnvironment.[0]Environment.[22]ConstructionGlowLine (7)", lookupMethod: "Exact",duplicate: 1, scale: [3,3,3],position: [4,-2,-2]},
  {id: "PanicEnvironment.[0]Environment.[21]ConstructionGlowLine (6)", lookupMethod: "Exact",duplicate: 1, scale: [3,3,3],position: [-5,-2,-2]},
  {id: "PanicEnvironment.[0]Environment.[22]ConstructionGlowLine (7)", lookupMethod: "Exact",duplicate: 1, scale: [3,3,3],position: [5,-2,-2]},
  {id: "PanicEnvironment.[0]Environment.[21]ConstructionGlowLine (6)", lookupMethod: "Exact",duplicate: 1, scale: [3,3,3],position: [-6,-2,-2]},
  {id: "PanicEnvironment.[0]Environment.[22]ConstructionGlowLine (7)", lookupMethod: "Exact",duplicate: 1, scale: [3,3,3],position: [6,-2,-2]},
  {id: "PanicEnvironment.[0]Environment.[13]Spectrograms", lookupMethod: "Exact", active: false}

)








//#endregion

//#region write file
const precision = 6; //decimals to round to  --- use this for better wall precision or to try and decrease JSON file size
const jsonP = Math.pow(10, precision);
const sortP = Math.pow(10, 2);

function deeperDaddy(obj) {
  if (obj)
    for (const key in obj) {
      if (obj[key] == null) {
        delete obj[key];
      } else if (typeof obj[key] === "object" || Array.isArray(obj[key])) {
        deeperDaddy(obj[key]);
      } else if (typeof obj[key] == "number") {
        obj[key] = parseFloat(
          Math.round((obj[key] + Number.EPSILON) * jsonP) / jsonP
        );
      }
    }
}
deeperDaddy(difficulty);

difficulty.colorNotes.sort(
  (a, b) =>
    parseFloat(Math.round((a.b + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.b + Number.EPSILON) * sortP) / sortP) ||
    parseFloat(Math.round((a.x + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.x + Number.EPSILON) * sortP) / sortP) ||
    parseFloat(Math.round((a.y + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.y + Number.EPSILON) * sortP) / sortP)
);
difficulty.customData.fakeColorNotes.sort(
  (a, b) =>
    parseFloat(Math.round((a.b + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.b + Number.EPSILON) * sortP) / sortP) ||
    parseFloat(Math.round((a.x + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.x + Number.EPSILON) * sortP) / sortP) ||
    parseFloat(Math.round((a.y + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.y + Number.EPSILON) * sortP) / sortP)
);

difficulty.bombNotes.sort(
  (a, b) =>
    parseFloat(Math.round((a.b + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.b + Number.EPSILON) * sortP) / sortP) ||
    parseFloat(Math.round((a.x + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.x + Number.EPSILON) * sortP) / sortP) ||
    parseFloat(Math.round((a.y + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.y + Number.EPSILON) * sortP) / sortP)
);
difficulty.customData.fakeBombNotes.sort(
  (a, b) =>
    parseFloat(Math.round((a.b + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.b + Number.EPSILON) * sortP) / sortP) ||
    parseFloat(Math.round((a.x + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.x + Number.EPSILON) * sortP) / sortP) ||
    parseFloat(Math.round((a.y + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.y + Number.EPSILON) * sortP) / sortP)
);

difficulty.sliders.sort(
  (a, b) =>
    parseFloat(Math.round((a.b + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.b + Number.EPSILON) * sortP) / sortP) ||
    parseFloat(Math.round((a.x + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.x + Number.EPSILON) * sortP) / sortP) ||
    parseFloat(Math.round((a.y + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.y + Number.EPSILON) * sortP) / sortP)
);

difficulty.burstSliders.sort(
  (a, b) =>
    parseFloat(Math.round((a.b + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.b + Number.EPSILON) * sortP) / sortP) ||
    parseFloat(Math.round((a.x + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.x + Number.EPSILON) * sortP) / sortP) ||
    parseFloat(Math.round((a.y + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.y + Number.EPSILON) * sortP) / sortP)
);
difficulty.customData.fakeBurstSliders.sort(
  (a, b) =>
    parseFloat(Math.round((a.b + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.b + Number.EPSILON) * sortP) / sortP) ||
    parseFloat(Math.round((a.x + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.x + Number.EPSILON) * sortP) / sortP) ||
    parseFloat(Math.round((a.y + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.y + Number.EPSILON) * sortP) / sortP)
);

difficulty.customData.customEvents.sort(
  (a, b) =>
    parseFloat(Math.round((a.b + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.b + Number.EPSILON) * sortP) / sortP) ||
    parseFloat(Math.round((a.x + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.x + Number.EPSILON) * sortP) / sortP) ||
    parseFloat(Math.round((a.y + Number.EPSILON) * sortP) / sortP) -
      parseFloat(Math.round((b.y + Number.EPSILON) * sortP) / sortP)
);

difficulty.obstacles.sort((a, b) => a.b- b.b);
difficulty.basicBeatmapEvents.sort((a, b) => a.b - b.b);

fs.writeFileSync(OUTPUT, JSON.stringify(difficulty, null, 0));

const outputData = JSON.parse(fs.readFileSync(OUTPUT)); console.log("\n--------------- 𝙏𝙃𝙀 𝙁𝙐𝙉𝙉𝙔 𝙎𝙏𝘼𝙏𝙎---------------\n"); const BigBoobs = (array, label) => { if (array && Array.isArray(array) && array.length > 0) { console.log(`${array.length} ${label}`); } };
const boobs = [
  { data: outputData.customData.environment, label: 'Environment Pieces' },{ data: outputData.customData.customEvents, label: 'Custom Events' },
  { data: outputData.notes, label: 'Notes' },{ data: outputData.obstacles, label: 'Walls' },
  { data: outputData.events, label: 'Events' },{ data: outputData.burstSliders, label: 'Burst Sliders' },
  { data: outputData.sliders, label: 'Sliders' },{ data: outputData.bombs, label: 'Bombs' },
  { data: outputData.customData.pointDefinitions, label: 'Point Definitions' },{ data: outputData.customData.materials, label: 'Materials' },
  { data: outputData.customData.fakeColorNotes, label: 'Fake Color Notes' },{ data: outputData.customData.fakeBombNotes, label: 'Fake Bomb Notes' },
  { data: outputData.customData.fakeObstacles, label: 'Fake Obstacles' },{ data: outputData.customData.fakeBurstSliders, label: 'Fake Burst Sliders' },
];
boobs.forEach(({ data, label }) => BigBoobs(data, label)); console.log("\x1b[1m\x1b[32m","\n\n"); const filePath = 'count.txt'; if (!fs.existsSync(filePath)) { fs.writeFileSync(filePath, '0'); } let count = parseInt(fs.readFileSync(filePath)); count++; fs.writeFileSync(filePath, count.toString()); console.log(`GIVE IT UP FOR DAY ${count}!`);
//#endregion