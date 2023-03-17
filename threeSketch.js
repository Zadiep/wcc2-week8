import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';
import { LightProbeGenerator } from 'three/addons/lights/LightProbeGenerator.js';
import { LightProbeHelper } from 'three/addons/helpers/LightProbeHelper.js';

let scene, camera, renderer, controls;
let stats, clock; // helpers
let light, pointLight;
let cubes = [];
let centerPoint;
let Noise;
let cubeNum;
let spheres = [];
let phiS;
let phiL;
let thetaS;
let thetaL;

init();
animate();

function init() {

    Noise = new ImprovedNoise();

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.5, 800 );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById("sketch-container").appendChild( renderer.domElement );

    //camera interaction controls
    controls = new OrbitControls( camera, renderer.domElement );

    //controls.update() must be called after any manual changes to the camera's transform
    camera.position.set(20,0,0); //always looks at center
    controls.update();
    

    //set up our scene
    //surround light
    light = new THREE.AmbientLight(0x404040,1); // soft white light
    scene.add( light );

    // pointLight = new THREE.PointLight( 0x404040, 200, 50 , 2 );
    // pointLight.position.set( 500, 200, 300 );
    // scene.add( pointLight );

    const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    const helper = new THREE.DirectionalLightHelper( directionLight, 5 );
    directionalLight.position.set(5,5,5);
    directionalLight.castShadow = true; 
    scene.add( helper );


    const spotLight =  new THREE.SpotLight(0xffffff,0.5);
    spotLight.position.set(10,10,10);
    spotLight.castShadow = true;
    spotLight.shadow.radius = 20;
    spotLight.shadow.mapSize.set(4096,4096);
    
    scene.add(spotLight.target );
    

    centerPoint = new THREE.Vector3( 0, 0, 0 );
   
    const geometry = new THREE.BoxGeometry( 1, 1.5, 1 );
    const material = new THREE.MeshNormalMaterial();
    material.fog = false;
    material.opacity = 1;
    material.alphaTest = 0;
    // material.wireframe = true;
    // material.wireframeLinewidth = 15;
   
    
    // phiS = 2;
    // phiL = 4;
    // thetaS = 1;
    // thetaL = 3;
    
    phiS = 1;
    phiL = 4;
    thetaS = 1;
    thetaL = 3;

    const Sgeometry = new THREE.SphereGeometry(10, 60, 16, phiS, phiL, thetaS, thetaL);
    const Smaterial = new THREE.MeshNormalMaterial( { color: 0xffff00 } );
    const sphere = new THREE.Mesh (Sgeometry,Smaterial);
    scene.add(sphere);
    spheres.push(sphere);

    spotLight.target = sphere;

    //create cubes
    cubeNum = 10;
    for (let x = -cubeNum; x <= cubeNum; x += 2) {
        for (let z = -cubeNum; z <= cubeNum; z += 2) {

            const cube = new THREE.Mesh( geometry, material ); 

            cube.position.x = x;
            cube.position.y = 1;
            cube.position.z = z;
            
            scene.add(cube);
            cubes.push(cube);
        }
    }

    //help us animate
    clock = new THREE.Clock();

    //For frame rate
    stats = Stats()
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom)
    

    //https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
    //https://www.w3schools.com/js/js_htmldom_eventlistener.asp
    //https://www.w3schools.com/js/js_htmldom_events.asp
    window.addEventListener('resize', onWindowResize );

}


function animate() {
    renderer.setAnimationLoop( render );
}

function render(){
    stats.begin();

    for (let i = 0; i < cubes.length; i++) {
        let cube = cubes[i];
        let distance = cube.position.distanceTo(centerPoint);
        let sine = Math.sin(distance + clock.getElapsedTime()*5);//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math
        let height = THREE.MathUtils.mapLinear(sine,-1,1,1,5);//https://threejs.org/docs/?q=Math#api/en/math/MathUtils
        let change = clock.getElapsedTime();
        let n = Noise.noise(cube.position.x*change*0.3,cube.position.y*0.05,cube.position.z*change*0.2);
        cube.position.y = 1+n*20;
        cube.scale.y = sine*2+3;
        phiS = THREE.MathUtils.clamp(sine,-1,1,1,2);
    }
  
    

	stats.end();
   
    // required if controls.enableDamping or controls.autoRotate are set to true
	//controls.update();

    renderer.render( scene, camera );
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

}

