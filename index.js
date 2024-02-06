const apiUrl = "https://swapi.dev/api/people/";
const charList = document.querySelector(".char-names");
const charName = document.querySelector(".char-info h3")
const planetName = document.querySelector(".other-info h3")
const charInfo = document.querySelector(".char-info .attributes");
const planetInfo = document.querySelector(".other-info .attributes");
const charInfoLoader = document.querySelector(".char-info-loader");
const planetInfoLoader = document.querySelector(".other-info-loader");
const charNameLoader = document.querySelector(".char-names-loader");
const nextPage = document.querySelector(".next");
const previousPage = document.querySelector(".previous");
const pageInfo = document.querySelector(".pages");

let nextUrl = null;
let prevUrl = null;

let currentPage = 1;
let lastPage = 0;

document.addEventListener("DOMContentLoaded", () => {
    fetchAndPopulateCharacterList(apiUrl)
    nextPage.addEventListener("click", () => {
        if(currentPage < lastPage){
            fetchAndPopulateCharacterList(nextUrl)
            currentPage++;}
        }) 
    previousPage.addEventListener('click', () => {
        if(currentPage > 1){
            fetchAndPopulateCharacterList(prevUrl)
            currentPage--;
        }
    }) 
})

function setPagination(){
    pageInfo.textContent = currentPage + " / " + lastPage;
}

async function fetchAndPopulateCharacterList(url) {
    const temp = charList.innerHTML;    
    try {
        
      charList.innerHTML = "";      
      charNameLoader.classList.remove("hider");
      const data = await fetchData(url);
      console.log(data.count)
      if(data.count){
        let fullPages = data.count / 10;        
        lastPage = Math.ceil(fullPages); 
        setPagination()      
      }
      charNameLoader.classList.add("hider"); 
       const characters = data.results;
      nextUrl = data.next;
      prevUrl = data.previous;
  
      characters.forEach(character => {
        addCharacterToList(character);
      });    
    } catch (error) {
    charList.innerHTML = temp;
      console.error("Error: ", error);
    }
  }

async function fetchData(url) {
    try {      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Response was not ok");      }
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
    whileLoading();
    const charData = await fetchData(charsUrl);
    updateCharInfo(charData);
    const planetData = await fetchData(planetUrl);
    updatePlanetInfo(planetData);
    whenLoaded()
  
 }

 function whileLoading(){
    charInfo.innerHTML="";
    planetInfo.innerHTML="";
    charInfo.style.display="none";
    charInfoLoader.classList.remove("hider");
    planetInfoLoader.classList.remove("hider");   
    charName.style.display="none";
    planetName.style.display="none";
 }

 function whenLoaded(){
    charInfoLoader.classList.add("hider");
    planetInfoLoader.classList.add("hider");
    charInfo.style.display="";
    charName.style.display="";
    planetName.style.display="";
 }

 function updateCharInfo(char){   
     charInfo.appendChild(addInfo("Height: ", char.height, "cm"))
     charInfo.appendChild(addInfo("Mass: ", char.mass, "kg"))
     charInfo.appendChild(addInfo("Hair color: ", char.hair_color))
     charInfo.appendChild(addInfo("Skin color: ", char.skin_color))
     charInfo.appendChild(addInfo("Eye color: ", char.eye_color))
     charInfo.appendChild(addInfo("Gender: ", char.gender))
     charName.textContent = char.name;
}

function updatePlanetInfo(planet){  
    planetInfo.appendChild(addInfo("Rotation period: ", planet.rotation_period, "h"))
    planetInfo.appendChild(addInfo("Orbital period: ", planet.orbital_period, " days"))
    planetInfo.appendChild(addInfo("Diameter: ", planet.diameter, "km"))
    planetInfo.appendChild(addInfo("Climate: ", planet.climate))
    planetInfo.appendChild(addInfo("Gravity: ", planet.gravity))
    planetInfo.appendChild(addInfo("Terrain: ", planet.terrain))
    planetName.textContent = planet.name;
}


function addInfo(infoName, info, suffix = ""){
    const el = document.createElement("div");
    el.textContent = infoName + info[0].toUpperCase() + info.substring(1) + suffix;
    return el;
}