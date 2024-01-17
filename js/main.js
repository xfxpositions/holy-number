
let cube, scene, camera, renderer;
let isAnimating = true;
let baseSpeed = 0.015;
let waveSpeed = baseSpeed;
let waveAmplitude = 0.005;
let waveFrequency = 0.05;
let music;

let coolonce = false;

let isMousePressed = false;
let mouseX = 0;
let mouseY = 0;

let isRightMousePressed = false; // Flag for right mouse button

let isRightMouseDown = false; // Sağ tuş basılı durumu için flag




function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, 800 / 800, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(500, 500);
  document.getElementById("cube-container").appendChild(renderer.domElement);

  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("/images/image1.jpg");
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const geometry = new THREE.BoxGeometry(8, 8, 8);
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 12.5;
}

document.getElementById("cube-container").addEventListener("mousedown", onMouseDown);
document.getElementById("cube-container").addEventListener("mousemove", onMouseMove);
document.getElementById("cube-container").addEventListener("mouseup", onMouseUp);

function onMouseDown(event) {
  if (event.button === 0) {
    isMousePressed = true;
    mouseX = event.clientX;
    mouseY = event.clientY;
  }
}

function onMouseMove(event) {
  if (isMousePressed) {
    const deltaX = event.clientX - mouseX;
    const deltaY = event.clientY - mouseY;

    // Adjust camera rotation based on mouse movement
    camera.rotation.y += deltaX * 0.005;
    camera.rotation.x += deltaY * 0.005;

    // Clamp camera rotation to avoid gimbal lock
    camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));

    mouseX = event.clientX;
    mouseY = event.clientY;
  }
  else if (isRightMousePressed) {
    // New code for cube rotation
    const deltaX = event.clientX - mouseX;
    const deltaY = event.clientY - mouseY;

    cube.rotation.y += deltaX * 0.005;
    cube.rotation.x += deltaY * 0.005;

    // Optional: Clamp cube rotation
    cube.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cube.rotation.x));

    mouseX = event.clientX;
    mouseY = event.clientY;
  }
}

function onMouseUp(event) {
  if (event.button === 0) {
    isMousePressed = false;
  } else if (event.button === 2) {
    isRightMousePressed = false;
  }
}

function handleRightClick(event) {
  event.preventDefault(); // Prevent the default context menu
  
  isRightMousePressed = true;
  mouseX = event.clientX;
  mouseY = event.clientY;
}

document.addEventListener("contextmenu", function (event) {
  event.preventDefault(); // Prevent the default context menu
  handleRightClick(event);
});

document.addEventListener("mouseup", onMouseUp);


function updateCubeSize() {
  const width = document.getElementById("widthSlider").value;
  const height = document.getElementById("heightSlider").value;
  const depth = document.getElementById("depthSlider").value;

  cube.geometry.dispose(); 
  cube.geometry = new THREE.BoxGeometry(
    Number(width),
    Number(height),
    Number(depth)
  );
}
document.getElementById("widthSlider").addEventListener("input", updateCubeSize);
document.getElementById("heightSlider").addEventListener("input", updateCubeSize);
document.getElementById("depthSlider").addEventListener("input", updateCubeSize);



function updateWaveSpeed() {
  waveSpeed = baseSpeed + waveAmplitude * Math.sin(Date.now() * waveFrequency);
}

function playMusic() {
  const musicSelection = document.getElementById("musicSelection");
  const selectedTrack = musicSelection.value;
  music = document.getElementById("backgroundMusic");
  music.src = selectedTrack; 
  music.volume = 0.25; 
  music.play();
}

document.getElementById("musicSelection").addEventListener("change", playMusic);

function animate() {
  console.log("animatings");
  if (isAnimating) {
    setTimeout(function () {
      requestAnimationFrame(animate);

      updateWaveSpeed();

      cube.rotation.x += waveSpeed;
      cube.rotation.y += waveSpeed;

      document.getElementById("info").innerHTML =
        `Position: ${cube.position.x.toFixed(2)}, ${cube.position.y.toFixed(
          2
        )}, ${cube.position.z.toFixed(2)}<br>` +
        `Rotation: ${cube.rotation.x.toFixed(2)}, ${cube.rotation.y.toFixed(
          2
        )}, ${cube.rotation.z.toFixed(2)}<br>` +
        `Base Speed: ${baseSpeed.toFixed(3)}<br>` +
        `Current Speed: ${waveSpeed.toFixed(3)}`;

      renderer.render(scene, camera);
    }, 1000 / 120); 
  }
}

function toggleAnimation() {
  isAnimating = !isAnimating;
  if (isAnimating) {
    animate();
    playMusic(); 
  } else {
    if (music) {
      music.pause(); 
    }
  }
}

function setMusicVolume() {
  const volumeSlider = document.getElementById("volumeSlider");
  if (music) {
    music.volume = volumeSlider.value;
  }
}

function setCubeSpeed() {
  const speedSlider = document.getElementById("speedSlider");
  baseSpeed = parseFloat(speedSlider.value);
  updateMusicPlaybackRate(); 
}

document.getElementById("speedSlider").addEventListener("input", setCubeSpeed);

document.getElementById("speedSlider").value = baseSpeed;

document
  .getElementById("volumeSlider")
  .addEventListener("input", setMusicVolume);

document.getElementById("volumeSlider").value = 0.25; 

document
  .getElementById("volumeSlider")
  .addEventListener("input", setMusicVolume);

function increaseSpeed() {
  baseSpeed += 0.001;
}

function decreaseSpeed() {
  baseSpeed -= 0.001;
}

function selectRandomImageAndStartAnimation() {
  const inputNumber = document.getElementById("holyNumber").value; 
  if (inputNumber.length === 6) {
    const randomNumber = Math.floor(Math.random() * 12) + 1; 
    const imageUrl = `/images/image${randomNumber}.jpg`;
    loadTextureAndStartAnimation(imageUrl);
  } else {
    alert("Lütfen 6 basamaklı bir sayı girin.");
  }
}

function loadTextureAndStartAnimation(imageUrl) {
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(imageUrl, function (texture) {
    cube.material.map = texture;
    cube.material.needsUpdate = true;
    console.log(imageUrl);
    start();
  });
}

document
  .getElementById("jackPotButton")
  .addEventListener("click", selectRandomImageAndStartAnimation);

function cool() {
  if(coolonce){
    return;
  }else{
    coolonce = true;
  }
  const currentBottom = document.getElementById("bottom");
  currentBottom.style.animation = "fadeOut 1s forwards";

  setTimeout(function () {
    currentBottom.style.display = "none";

    const newBottom = document.getElementById("bottom");
    newBottom.style.display = "block";
    newBottom.style.animation = "fadeIn 1s forwards";
  }, 1000); 
}

function start() {
  cool();
  isAnimating = true;
  animate();
  setTimeout(() => {
    playMusic();
  }, 1000);
}

document.getElementById("startButton").addEventListener("click", function () {
  start();
  baseSpeed = 0.015;
});

// document
//   .getElementById("stopButton")
//   .addEventListener("click", toggleAnimation);

document
  .getElementById("stopButton")
  .addEventListener("click", ()=>{
      baseSpeed = 0;
  });


document
  .getElementById("speedUpButton")
  .addEventListener("click", increaseSpeed);
document
  .getElementById("slowDownButton")
  .addEventListener("click", decreaseSpeed);

  document.addEventListener("contextmenu", handleRightClick);
  document.addEventListener("mouseup", onMouseUp);
  document.getElementById("cube-container").addEventListener("contextmenu", handleRightClick);
  document.addEventListener("mousedown", function(event) {
    if (event.button === 2 && event.target.id !== "cube-container") {
      // Eğer tıklama cube-container dışındaysa ve sağ tıklama ise
      isRightMousePressed = false;
    }
  });
  document.addEventListener("keydown", (event)=>{
    console.log(event.key);
    if(event.key == "Escape"){
      isRightMousePressed = false;
      isRightMouseDown = false;
    }
  })
init();
