// 1/? querys to improve performance as well as good practices by using GraphQL to get pokemon (working on it for now)

/* query all_from_generation {

  # Gets all the pokemon belonging to generation 1
  generationI: pokemon_v2_pokemonspecies(
    where: {pokemon_v2_generation: {name: {_eq: "generation-i"}}}, order_by: {id: asc}){
      id 
    	name 
      base_region: pokemon_v2_generation {region: pokemon_v2_region {name}}
      japanese_name: pokemon_v2_pokemonspeciesnames(where: {pokemon_v2_language: {name: {_eq: "ja"}}}){name }
      gen: pokemon_v2_pokemonspeciesnames(where: {pokemon_v2_language: {name: {_eq: "en"}}}){genus}
  		is_legendary
      is_mythical
      info: pokemon_v2_pokemons{
        id
        name
        height
        weight
        types: pokemon_v2_pokemontypes{type: pokemon_v2_type{name}}
        abilities: pokemon_v2_pokemonabilities{ability: pokemon_v2_ability{name}}
        #all_sprites: pokemon_v2_pokemonsprites{sprites}
      }
      flavor_texts: pokemon_v2_pokemonspeciesflavortexts(where: {pokemon_v2_language: {name: {_eq: "en"}}}){flavor_text }
      }
}

#Due to an error(1) getting sprites, these could be gotten by writing url and using id from info.id

#error(1): https://github.com/PokeAPI/pokeapi/issues/614




#front_default: https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png

#front_shiny: https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/150.png */

