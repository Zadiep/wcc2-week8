import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';
import Stats from 'three/addons/libs/stats.module.js';


let scene, camera, renderer, controls;
let stats, clock; // helpers
let light;
let cubes = [];
let centerPoint;
let Noise;
let cubeNum, sphereNum;
let spheres = [];

init();
animate();

function init() {

    Noise = new ImprovedNoise();

    scene = new THREE.Scene();

    //
    camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.5, 800 );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById("sketch-container").appendChild( renderer.domElement );

    //camera interaction controls
    controls = new OrbitControls( camera, renderer.domElement );

    //controls.update() must be called after any manual changes to the camera's transform
    camera.position.set(20,0,0); //always looks at center
    camera.lookAt(scene.position);
    controls.update();
    

    //set up our scene
    //surround light
    light = new THREE.AmbientLight(0x404040,1); // soft white light
    scene.add( light );

    //did not work, wait to visualize
    const spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( 100, 1000, 100 );
    
    spotLight.castShadow = true;
    
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    
    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 400;
    spotLight.shadow.camera.fov = 30;
    
    scene.add( spotLight );
    //

    centerPoint = new THREE.Vector3( 0, 0, 0 );

    const Sgeometry = new THREE.SphereGeometry(2,20,10);
    const Smaterial = new THREE.MeshNormalMaterial( { color: 0xffffff } );
    // const Smaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
   
    //create Spheres
    sphereNum = 6;
    for (let x = -sphereNum; x <= sphereNum; x += 0.2) {
        for (let y = -sphereNum; y <= sphereNum; y += 0.2) {
            for (let z = -sphereNum; z <= sphereNum; z += 1) {

        const sphere = new THREE.Mesh (Sgeometry,Smaterial);

        sphere.position.x = x;
        sphere.position.y = y;
        sphere.position.z = z;
        
        scene.add(sphere);
        spheres.push(sphere);

        }
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

    let change = clock.getElapsedTime();

    for (let i = 0; i < spheres.length; i++) {
        let sphere = spheres[i];
        let distance = sphere.position.distanceTo(centerPoint);
        let sine = Math.sin(distance + clock.getElapsedTime()*5);//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math
        let height = THREE.MathUtils.mapLinear(sine,-1,1,1,2);//https://threejs.org/docs/?q=Math#api/en/math/MathUtils
        let n = Noise.noise(sphere.position.x*change*0.1,sphere.position.y*0.05,sphere.position.z*0.2);
        // sphere.position.y = 0+n*1.5;
        sphere.position.y = 0+height*1.5;
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


