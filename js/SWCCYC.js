

// Scene setup
const scene = new THREE.Scene();
const loader = new THREE.TextureLoader();  // Create an instance of TextureLoader
// bgTexture = loader.load("cobaltMine.jpeg",
//     // function ( texture ) {
//     //     var img = texture.image;
//     //     bgWidth= img.width;
//     //     bgHeight = img.height;
//     //     resize();
//     // } 
//   );
// scene.background = bgTexture;
// bgTexture.wrapS = THREE.MirroredRepeatWrapping;
// bgTexture.wrapT = THREE.MirroredRepeatWrapping;
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);  // Aspect ratio is now 1 (square)
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(600, 600);  // Set to a fixed square size
renderer.setClearColor(0x00000);  // Change to a slightly lighter color
document.body.appendChild(renderer.domElement);



// Center the canvas element using CSS
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '50%';
renderer.domElement.style.left = '50%';
renderer.domElement.style.transform = 'translate(-50%, -50%)';
renderer.domElement.style.zIndex = '-10'; // or any other value you need


// Coordinates for the keypad buttons
const keyCoords = {
  '1': { x: 250, y: 257 },
  '2': { x: 296, y: 257 },
  '3': { x: 344, y: 257 },
  '4': { x: 250, y: 300 },
  '5': { x: 296, y: 300 },
  '6': { x: 344, y: 300 },
  '7': { x: 250, y: 344 },
  '8': { x: 296, y: 344 },
  '9': { x: 344, y: 344 },
  '*': { x: 250, y: 391 },
  '0': { x: 296, y: 391 },
  '#': { x: 344, y: 391 },
  'Call': { x: 296, y: 435 }
};
const clickToleranceRadius = 15; // Pixels

const keyMessages = {
  '1': '&quotA landmark legal case has been launched against the world&apos;s largest tech <br>companies by Congolese families who say their children were killed or maimed <br>while mining for cobalt used to power smartphones...&quot -The Guardian (2019).',
  '2': '&quotTin, Tantalum (extracted from Coltan), Tungsten and Gold are some of the minerals making up Congo&apos;s $24 trillion untapped reserves and the backbone of modern day technology, including but not limited to smartphones, laptops, and electric vehicles. -CNBC (2023).',
  '3': '&#39;&#8230;although the DRC has more cobalt reserves than the rest of the planet combined, there&#39;s no such thing as a &quot;clean&quot; supply chain of cobalt from the country.&#39; -Siddharth Kara, as told to NPR&#39;s Terry Gross (2023)',
  '4': '&#39;Cobalt is the most expensive raw material inside a lithium-ion battery&#39;, with a ton of the refined mineral fetching about $26,000. &#39;Artisanal&#39; miners who are responsible for about 25% of the world&#39;s cobalt production earn between $2 and $3 digging in hazardous conditions - Washington Post (2016)',
  '5': '&#39;Our neighbors, the Rwandese&#8230; they&#39;re fighting us because of the resources we have. They want to colonize our country for the second time.&#39; -Esperance Batende, as told to Julia Steers, Vice News (2023)',
  '6': 'An estimated 40,000 children work in artisan mines in the Democratic Republic of Congo. They are often in the tunnels for 12 hours a day, hauling anywhere from 20-40kg. Some of them are as young as 7. - Amnesty International (2016)',
  '7': 'Mass rapes and sexual violence are commonplace due as the fighting over the DRC&#39;s metals and mineral ores has made women especially vulnerable.',
  '8': '15 out of the 19 cobalt-producing industrial mines in Congo are owned by Chinese companies, some of which have come to be linked with the displacement of thousands as well as increasing negligence of workplace safety. -The New York Times (2021)',
  '9': 'The country&#39;s history is plagued with heavy foreign interference and exploitation most notably under King Leopold II, who subjected the Congolese to extreme cruelty to extract rubber for global trade.',
  '*': 'Educate yourself on the crisis in the DRC<br>Reduce your reliance on and consumption of electronic consumer goods, make your tech last longer by fixing it when it breaks down or buying refurbished instead of brand new<br>Take note of where to recycle electronics near you<br>Look into brands that source ethically and are transparent about who is impacted by their production.',
  '0': 'Minerals like cobalt aren&#39t just found in phones, e-cigarettes and vapes rely on lithium-ion batteries as well and their high rate of disposability exacerbate the need for these minerals.',
  '#': 'Donate to support displaced families across the country, provide life-saving medical care, food and other essentials, as well as support to survivors of sexual violence.<br><br>Panzi Foundation<br>Action Against Hunger<br>Congo Action<br>Focus Congo.',
  'Call': 'Follow and uplift Congolese voices, share news and updates from people on the ground and continue to talk about what is happening in the DRC<br><br>@Pappyorion (TikTok)<br>@Foreverjuicebae (Instagram)<br>@Congofriends (Twitter)'
};

const keyHeaders = {
  '1': 'Sorry, We Cannot Connect Your Call',
  '2': 'Sorry, We Cannot Connect Your Call',
  '3': 'Sorry, We Cannot Connect Your Call',
  '4': 'Sorry, We Cannot Connect Your Call',
  '5': 'Sorry, We Cannot Connect Your Call',
  '6': 'Sorry, We Cannot Connect Your Call',
  '7': 'Sorry, We Cannot Connect Your Call',
  '8': 'Sorry, We Cannot Connect Your Call',
  '9': 'Sorry, We Cannot Connect Your Call',
  '*': 'How Can You Help?',
  '0': 'Sorry, We Cannot Connect Your Call',
  '#': 'How Can You Help?',
  'Call': 'How Can You Help?'
};

let takeCloserLook = false; // State for the "Take a closer look" feature
const clickAudio = new Audio('/end-call.mp3'); 
clickAudio.preload = 'auto';


// Function to play the audio
function playClickAudio() {
  clickAudio.currentTime = 0; // Reset audio to start
  clickAudio.play().catch(error => {
    console.error('Audio play failed:', error);
  });
}


// Click detection and info box opening
function handleClick(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  Object.entries(keyCoords).forEach(([key, coord]) => {
    const dx = mouseX - coord.x;
    const dy = mouseY - coord.y;
    if (Math.sqrt(dx * dx + dy * dy) <= clickToleranceRadius) {
      playClickAudio();
      const infoBox = document.getElementById('infoBox');
      const message = keyMessages[key] || `Key: ${key} - Coordinates: (${coord.x}, ${coord.y})`;
      const header = keyHeaders[key] || 'Reminder';
      infoBox.innerHTML = `
        <div class="modal-header">${header}</div>
        <div class="modal-content">
          <b>${message}</b>
        </div>
        <div class="modal-footer">
          <button class="cancel-button">Cancel</button>
          <button class="try-again-button">Try Again</button>
        </div>
      `;
      infoBox.style.display = 'block';

      // Disable the "Take a Closer Look" button
      closerLookButton.disabled = true;

      // Add event listener for the "Cancel" button
      document.querySelector('.cancel-button').addEventListener('click', () => {
        infoBox.style.display = 'none';
        // Re-enable the "Take a Closer Look" button
        closerLookButton.disabled = false;
      });

      // Add event listener for the "Try Again" button
      const tryAgainButton = document.querySelector('.try-again-button');

      // Define the handler function
      const tryAgainHandler = () => {
        switch (key) {
          case '1':
            window.open('https://www.theguardian.com/global-development/2019/dec/16/apple-and-google-named-in-us-lawsuit-over-congolese-child-cobalt-mining-deaths', '_blank');
            break;
          case '2':
            window.open('https://www.cnbc.com/2023/02/15/how-conflict-minerals-make-it-into-our-phones.html#:~:text=Tin%2C%20tantalum%2C%20tungsten%20and%20gold,the%20Democratic%20Republic%20of%20Congo', '_blank');
            break;
          case '3':
            window.open('https://www.npr.org/transcripts/1152893248', '_blank');
            break;
          case '4':
            window.open('https://www.washingtonpost.com/graphics/business/batteries/congo-cobalt-mining-for-lithium-ion-battery/', '_blank');
            break;
          case '5':
            window.open('https://www.youtube.com/watch?v=j6liCsCSUoM', '_blank');
            break;
          case '6':
            window.open('https://www.amnesty.org/en/latest/campaigns/2016/06/drc-cobalt-child-labour/', '_blank');
            break;
          case '7':
            window.open('https://www.youtube.com/watch?v=-IffpoUQpDc&t=308s', '_blank');
            break;
          case '8':
            window.open('https://www.nytimes.com/2021/11/20/world/china-congo-cobalt.html', '_blank');
            break;
          case '9':
            window.open('https://www.youtube.com/watch?v=MU4vua2kNQY', '_blank');
            break;
            case '0':
              window.open('https://www.bbc.com/news/world-africa-67569996', '_blank');
              break;
              case '*':
              window.open('https://x.com/nyeusi_waasi/status/1724162043505205286', '_blank');
              break;
              case '#':
              window.open('https://panzifoundation.org/donation-page/', '_blank');
              break;
            case 'Call':
            window.open('https://www.tiktok.com/@pappyorion?_t=8motglcAREU&_r=1', '_blank');
            break;
          default:
            infoBox.style.display = 'none';
            break;
        }
        // Re-enable the "Take a Closer Look" button
        closerLookButton.disabled = false;
      };

      // Remove any existing event listeners to avoid duplication
      tryAgainButton.replaceWith(tryAgainButton.cloneNode(true));
      const newTryAgainButton = document.querySelector('.try-again-button');
      newTryAgainButton.addEventListener('click', tryAgainHandler);
    }
  });
}

renderer.domElement.addEventListener('click', handleClick);

// Create the "Take a closer look" button
const closerLookButton = document.createElement('button');
closerLookButton.textContent = 'Take a closer look';
closerLookButton.className = 'closer-look-button';  // Add a class instead of setting styles directly
document.body.appendChild(closerLookButton);

closerLookButton.addEventListener('click', () => {
  
  takeCloserLook = !takeCloserLook;
  closerLookButton.textContent = takeCloserLook ? 'Return to normal view' : 'Take a closer look';
  controls.enabled = takeCloserLook; // Enable/disable orbit controls based on the button state

  if (takeCloserLook) {
    renderer.domElement.removeEventListener('click', handleClick); // Disable keypad click
  } else {
    renderer.domElement.addEventListener('click', handleClick); // Enable keypad click
    resetCameraPosition(); // Reset the camera position when toggled off
  }
});

// Camera position
const initialCameraPosition = new THREE.Vector3(0, 0, 5); // Store the initial camera position
const initialCameraQuaternion = new THREE.Quaternion(); // Store the initial camera orientation

camera.position.copy(initialCameraPosition);
camera.lookAt(new THREE.Vector3(0, 0, 0));
camera.up.set(0, 1, 0);
camera.quaternion.copy(camera.quaternion); // Save initial orientation

const hlight = new THREE.AmbientLight(0x404040, 1);
scene.add(hlight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 10, 0); // Position it high above the model
directionalLight.target.position.set(0, 0, 0); // Ensure it points toward the center of the scene        
directionalLight.castShadow = true;
scene.add(directionalLight);

const light = new THREE.PointLight(0xc4c4c4, 0);
light.position.set(0, 300, 500);
scene.add(light);

const light2 = new THREE.PointLight(0xc4c4c4, 0.6);
light2.position.set(500, 100, 0);
scene.add(light2);

const light3 = new THREE.PointLight(0xc4c4c4, 2);
light3.position.set(0, 100, -500);
scene.add(light3);

const light4 = new THREE.PointLight(0xc4c4c4, 1.5);
light4.position.set(-500, 300, 500);
scene.add(light4);

const light5 = new THREE.PointLight(0xc4c4c4, 0.8);
light5.position.set(-500, -100, 0); // Negate each component of the position
scene.add(light5);

// Dynamic rotating light
const rotatingLight = new THREE.PointLight(0xffffff, 1.5);
rotatingLight.position.set(20, 5, 0);
scene.add(rotatingLight);

const cameraLight = new THREE.PointLight(0xffffff, 2); // Dynamic light attached to camera
camera.add(cameraLight);

const bottomLight = new THREE.PointLight(0xc4c4c4, 1.5);
bottomLight.position.set(0, -300, 0);
scene.add(bottomLight);

// Model loader
let phoneModel; // This will store the GLTF scene once loaded

const gltfLoader = new THREE.GLTFLoader();
gltfLoader.load('/model/iphone14promax.gltf', function (gltf) {
  gltf.scene.traverse(function (child) {
    if (child.isMesh) {
      const texture = child.material.map; // assuming the map is already loaded
      if (texture) {
        child.material = new THREE.MeshPhongMaterial({
          map: texture
        });
      }
    }
  });

  gltf.scene.position.set(0, -3, 0); // Move the model down along the Y axis
  gltf.scene.rotation.set(0, Math.PI, 0); // Rotate the model to show the front face
  scene.add(gltf.scene);
  renderer.render(scene, camera);
  phoneModel = gltf.scene; // Store the loaded model
});

// Function to reset the camera position and orientation to its initial values
function resetCameraPosition() {
  camera.position.copy(initialCameraPosition);
  camera.quaternion.copy(initialCameraQuaternion);
  controls.update(); // Update controls to reflect changes
  renderer.render(scene, camera); // Re-render the scene to reflect changes
  console.log('Reset to Initial Camera Position and Orientation');
}

// Orbit Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0); // Set rotation center to the center of the scene
controls.enablePan = false; // Disable panning permanently
controls.enableZoom = true; // Optionally, keep zoom enabled, adjust as needed
controls.enabled = false; // Disable controls by default



function animate() {
  requestAnimationFrame(animate);
  controls.update(); // Include this to handle camera movement updates
  renderer.render(scene, camera);
}

animate(); // Start the rendering loop