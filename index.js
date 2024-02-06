const apiUrl = "https://swapi.dev/api/people/";
const charList = document.querySelector(".char-names");
const charName = document.querySelector(".char-info h3")
const planetName = document.querySelector(".other-info h3")
const charInfo = document.querySelector(".char-info .attributes");
const planetInfo = document.querySelector(".other-info .attributes");

let nextUrl = null;
let prevUrl = null;


fetchData(apiUrl)
  .then(data => {
    const characters = data.results; 
    nextUrl = data.next;
    prevUrl = data.previous;
    characters.forEach(character => {
      addCharacterToList(character); 
    });
  })
  .catch(error => {
    console.error("Error: ", error);
  });


async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
}

function addCharacterToList(chars){   
    const el = document.createElement("div");
    el.classList.add("char-name");
    el.textContent = chars.name;
    el.addEventListener("click", () => {
        fetchNameAndPlanet(chars.url, chars.homeworld);
      });
    charList.appendChild(el);
 }


 async function fetchNameAndPlanet(charsUrl, planetUrl){
    const charData = await fetchData(charsUrl);
    updateCharInfo(charData);
    const planetData = await fetchData(planetUrl);
    updatePlanetInfo(planetData);
 }


 function updateCharInfo(char){
    charInfo.innerHTML="";
    charName.textContent = char.name;
    charInfo.appendChild(addInfo("Height: ", char.height, "cm"))
    charInfo.appendChild(addInfo("Mass: ", char.mass, "kg"))
    charInfo.appendChild(addInfo("Hair color: ", char.hair_color))
    charInfo.appendChild(addInfo("Skin color: ", char.skin_color))
    charInfo.appendChild(addInfo("Eye color: ", char.eye_color))
    charInfo.appendChild(addInfo("Gender: ", char.gender))
}

function updatePlanetInfo(planet){
    planetInfo.innerHTML="";
    planetName.textContent = planet.name;
    planetInfo.appendChild(addInfo("Rotation period: ", planet.rotation_period, "h"))
    planetInfo.appendChild(addInfo("Orbital period: ", planet.orbital_period, " days"))
    planetInfo.appendChild(addInfo("Diameter: ", planet.diameter, "km"))
    planetInfo.appendChild(addInfo("Climate: ", planet.climate))
    planetInfo.appendChild(addInfo("Gravity: ", planet.gravity))
    planetInfo.appendChild(addInfo("Terrain: ", planet.terrain))
}


function addInfo(infoName, info, suffix = ""){
    const el = document.createElement("div");
    el.textContent = infoName + info[0].toUpperCase() + info.substring(1) + suffix;
    return el;
}