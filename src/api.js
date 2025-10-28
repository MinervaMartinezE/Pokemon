// Función para devolver los datos de un Pokemon
export async function fetchPokemon(id) {
 try{
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await response.json();

  return {
    name: data.name,
    imageFront: data.sprites.front_default, 
    imageBack: data.sprites.back_default,
    attack: data.stats.find(stat => stat.stat.name === 'attack').base_stat,
    type: data.types[0].type.name            
  };
 } catch (error){
    console.error ('Error fetching Pokemon: ', error);
    return null;
 }
}

// Función para devolver los Pokemon de un tipo
export async function fetchPokemonByType(type) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    if (!response.ok) throw new Error('Type not found');
    const data = await response.json();

  return data.pokemon.map(p => p.pokemon); 
 } catch (error) {
    console.error ('Error fetching Pokemon by type: ', error);
    return [];
 }
}