import './style.css'
import { fetchPokemon, fetchPokemonByType } from './api.js';

const startBtn = document.getElementById('startBtn');
const battleBtn = document.getElementById('battleBtn');
const pokemonContainer = document.getElementById('pokemonContainer');
const resultContainer = document.getElementById('resultContainer');
const typeContainer = document.getElementById('typeContainer');

let pokemon1 = null;
let pokemon2 = null;
battleBtn.classList.add('hidden');

function randomId(){
    return Math.floor(Math.random() * 1025) +1;
}
//Carga de los pokemons
async function loadNewPokemons (){
  try{
    resultContainer.innerHTML = '';
    typeContainer.innerHTML = '';
    battleBtn.classList.add('hidden');

    const id1 = randomId();
    const id2 = randomId();

    const [p1,p2] = await Promise.all([fetchPokemon(id1), fetchPokemon(id2)]);
    pokemon1 = p1;
    pokemon2 = p2;

    pokemonContainer.innerHTML = `
    <div class="pokemon">
      <h3>${p1.name}</h3>
      <img src="${p1.imageFront}" alt="${p1.name}" 
            data-front="${p1.imageFront}" data-back="${p1.imageBack}">
      <p>HP: ${p1.attack}</p>
      <p>Type: ${p1.type}</p>
    </div>
    <div class="vs">⚡ VS ⚡</div>
    <div class="pokemon">
      <h3>${p2.name}</h3>
      <img src="${p2.imageFront}" alt="${p2.name}" 
            data-front="${p2.imageFront}" data-back="${p2.imageBack}">
      <p>HP: ${p2.attack}</p>
      <p>Type: ${p2.type}</p>
    </div>
  `;
  
  battleBtn.textContent = 'Battle';
  battleBtn.disabled = false;
  battleBtn.classList.remove('hidden');

  pokemonContainer.querySelectorAll('img').forEach (img => {
   const front = img.dataset.front;
   const back = img.dataset.back;
   
    img.addEventListener('mouseenter',() => {
    if(back) img.src = back;
    });
    img.addEventListener('mouseleave',() => {
    img.src = front;
    });
 });

} catch (error){
    console.error ('Error loading Pokemons', error);
    pokemonContainer.innerHTML = '<p>Something went wrong while loading Pokemons</p>';
    battleBtn.disabled = true;
}
}
//Función para la batalla
async function startBattle() {
    battleBtn.disabled=true;

    const messagesBattle = ['Fighting.','Fighting..','Fighting...'];
    for (let i = 0; i< messagesBattle.length; i++) {
        battleBtn.textContent = messagesBattle[i];
        await new Promise (res => setTimeout(res, 1000));
    }

    let winner;
    if (pokemon1.attack > pokemon2.attack) winner = pokemon1;
    else if (pokemon2.attack > pokemon1.attack) winner = pokemon2;
    else {
        resultContainer.innerHTML = '<h2>Its a tie!</h2>';
        battleBtn.textContent = 'Battle';
        battleBtn.disabled = false;
        return;
    }
    
    battleBtn.textContent = 'Battle';
    battleBtn.disabled = false;

    resultContainer.innerHTML = `<h2>The Winner is:<br>${winner.name.toUpperCase()} (${winner.attack} HP)</h2>`;

//Para añadir animación con CSS al Pokemon ganador
const pokemonDivs = pokemonContainer.querySelectorAll('.pokemon');

pokemonDivs.forEach(div => {
    if (div.querySelector('h3').textContent === winner.name){
        div.classList.add('winner');
    } else {
        div.classList.remove('winner');
    }
});

// Tipo de Ganador
    typeContainer.innerHTML=`<p>Type: ${winner.type}</p>`;    

    const typePokemons = await fetchPokemonByType(winner.type);
    const others = typePokemons.filter(p => p.name !== winner.name).sort(() => 0.5 - Math.random()).slice(0, 3); 
    
    const otherDetails = await Promise.all(
        others.map(p => {
        const id = p.url.split('/').filter(Boolean).pop(); 
        return fetchPokemon(id);
  })
);
if (otherDetails.length > 0) {
  const html = otherDetails.map(p => `
    <div class="pokemon">
      <h4>${p.name}</h4>
      <img src="${p.imageFront}" alt="${p.name}">
      <p>HP: ${p.attack}</p>
      <p>Type: ${p.type}</p>
    </div>
  `).join('');

  typeContainer.innerHTML += `
    <h3>Other ${winner.type}-type Pokémon:</h3>
    <div class="sameType">${html}</div>
  `;
 }
}
//Eventos que llaman a las funciones
startBtn.addEventListener('click', loadNewPokemons);
battleBtn.addEventListener('click', startBattle);
