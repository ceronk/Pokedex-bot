/* 
The following code is an improvement of bot.js; this code will extract data directly from the pokeapi's pokedex endpoint.
The idea is to extract each pokemon from pokedex endpoint, which means that the information will be more specific.
For example, Pokemon's region, description, color, genus, and also filtering by mythical or legendary per generation will be possible.

Most of the code is ready to be used with Telegraf framework or for other purposes...
*/
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
//const bot = new Telegraf(process.env.TOKEN, { handlerTimeout: 420_000 }); // 420s in ms 

// bot could crash while printing all pokémon from national dex (1010)... if that happens, increase handlerTimeout

  //--------------------------------------------------------------------------------------------------------------------------------------------------------------
  //LEVEL/SCENE 0 (Menu to select pokedex) ✅

  /* { text: `not found`, callback_data: "10" }, */    //Not found pokedex... validate missing pokedexes later (use status 404)...

  /*     ctx.reply("Select a pokédex",
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: `national`, callback_data: "1" }, { text: `kanto`, callback_data: "2" }, { text: `original-johto`, callback_data: "3" }],
    
              [{ text: `hoenn`, callback_data: "4" }, { text: `original-sinnoh`, callback_data: "5" }, { text: `extended-sinnoh`, callback_data: "6" }],
    
              [{ text: `updated-johto`, callback_data: "7" }, { text: `original-unova`, callback_data: "8" }, { text: `updated-unova`, callback_data: "9" }],
    
              [{ text: `conquest-gallery`, callback_data: "11" }, { text: `kalos-central`, callback_data: "12" }, { text: `kalos-coastal`, callback_data: "13" }],
    
              [{ text: `kalos-mountain`, callback_data: "14" }, { text: `updated-hoenn`, callback_data: "15" }, { text: `original-alola`, callback_data: "16" }],
    
              [{ text: `original-melemele`, callback_data: "17" }, { text: `original-akala`, callback_data: "18" }, { text: `original-akala`, callback_data: "19" }],
    
              [{ text: `original-poni`, callback_data: "20" }, { text: `updated-alola`, callback_data: "21" }, { text: `updated-melemele`, callback_data: "22" }],
    
              [{ text: `updated-akala`, callback_data: "23" }, { text: `updated-ulaula`, callback_data: "24" }, { text: `updated-poni`, callback_data: "25" }],
    
              [{ text: `letsgo-kanto`, callback_data: "26" }, { text: `galar`, callback_data: "27" }, { text: `isle-of-armor`, callback_data: "28" }],
    
              [{ text: `crown-tundra`, callback_data: "29" }, { text: `hisui`, callback_data: "30" }]
            ]
          }
        });
  //Syntax for -> WizardScene
        ctx.wizard.cursor = 0;
        return ctx.wizard.next(); */
  //--------------------------------------------------------------------------------------------------------------------------------------------------------------
  //LEVEL/SCENE 1 - Getting all pokémon from pokédex selected ✅

  //const kanto = 2; // temporal, pokedex will gotten with "ctx.callbackQuery.data" from cursor 0 (menu)
  //const galar = 30;
  //const alola = 16;

  /*   const pokedexAPI = await fetch(`https://pokeapi.co/api/v2/pokedex/${kanto}/`);
    const pokedexJSON = await pokedexAPI.json();
    const pokemon_species = [], pokedexDescription = [];
    let descriptn = {};
    pokedexJSON?.pokemon_entries?.forEach((i) => pokemon_species.push(i.pokemon_species?.url));
  
    pokedexJSON?.descriptions.filter((i) => { if (i.language?.name == "en") { pokedexDescription.push(i.description) } });
    descriptn = { description: pokedexDescription }; */
  /*
    //Syntax for -> WizardScene
    ctx.wizard.state.pokedexName = pokedexJSON.name;
    ctx.wizard.state.pokedexDescription = descriptn.description;
    ctx.wizard.state.pokemon_species = pokemon_species;
  
    ctx.wizard.cursor = 1;
    return ctx.wizard.next(); */
  //--------------------------------------------------------------------------------------------------------------------------------------------------------------
  //LEVEL/SCENE 2 - Extracting all data from selected pokemon (meowth in this static example)
  //console.log("Extracting all data from selected pokemon");


  /*   const pokemonSpeciesAPI = await fetch("https://pokeapi.co/api/v2/pokemon-species/52/");
    const pokemonSpeciesJSON = await pokemonSpeciesAPI.json();
  
    let isAlola = [], isGalar = [], isGmax = [], isNormal = [], entries = [];
    let pokemonData = {}, jpName = "", gen = "";
  
    pokemonSpeciesJSON?.varieties?.filter((i) => {
      if (i.pokemon.name.includes("alola")) { isAlola.push(i.pokemon.name); isAlola.push(i.pokemon.url); }
  
      else if (i.pokemon.name.includes("galar")) { isGalar.push(i.pokemon.name); isGalar.push(i.pokemon.url); }
  
      else if (i.pokemon.name.includes("gmax")) { isGmax.push(i.pokemon.name); isGmax.push(i.pokemon.url); }
  
      else { isNormal.push(i.pokemon.name); isNormal.push(i.pokemon.url); }
    });
  
    pokemonSpeciesJSON.names.filter((i) => { ((i.language.name == "ja") ? (jpName = i.name) : null) });
    pokemonSpeciesJSON.genera.filter((i) => { ((i.language.name == "en") ? (gen = i.genus) : null) });
    pokemonSpeciesJSON.flavor_text_entries.filter((i) => { ((i.language.name == "en") ? (entries.push(i.flavor_text)) : null) });
  
    pokemonData = {  
      japaneseName: jpName,
      englishName: pokemonSpeciesJSON.name,
      isLegendary: pokemonSpeciesJSON.is_legendary,
      isMythical: pokemonSpeciesJSON.is_mythical,
      generation: pokemonSpeciesJSON.generation.name,
      genus: gen,
      flavor_text_entries: entries,
  
      alolaPokemon: { pokeName: ((isAlola[0]) ? isAlola[0] : null), pokeURL: ((isAlola[1]) ? isAlola[1] : null), },
      galarPokemon: { pokeName: ((isGalar[0]) ? isGalar[0] : null), pokeURL: ((isGalar[1]) ? isGalar[1] : null), },
      gmaxPokemon: { pokeName: ((isGmax[0]) ? isGmax[0] : null), pokeURL: ((isGmax[1]) ? isGmax[1] : null), },
      normalPokemon: { pokeName: ((isNormal[0]) ? isNormal[0] : null), pokeURL: ((isNormal[1]) ? isNormal[1] : null), }
    };
  
    //To get a random flavor text entry! (see pokédex entries example)
    const random = Math.floor(Math.random() * entries.length);
  
  
    ctx.reply(`
    Name: ${pokemonData.englishName}  |  ${pokemonData.japaneseName}
    Generation: ${pokemonData.generation}
    
    Genus: ${pokemonData.genus}
  
  
    ${entries[random]} 
    `); */

  //Syntax for -> WizardScene
  // ctx.wizard.state.pokemonList = pokemonData;

  // ctx.wizard.cursor = 2;
  // return ctx.wizard.next();

  //--------------------------------------------------------------------------------------------------------------------------------------------------------------
  //LEVEL/SCENE 3 - show a menu to choose a pokedex                    (already done in bot.js script, see bot.js source code for details)
  //--------------------------------------------------------------------------------------------------------------------------------------------------------------
  //LEVEL/SCENE 4 - prepare variables to extract info                  (already done in bot.js script, see bot.js source code for details)
  //--------------------------------------------------------------------------------------------------------------------------------------------------------------
  //LEVEL/SCENE 5 - show a menu to interact with the selected pokédex  (already done in bot.js script, see bot.js source code for details)
  //--------------------------------------------------------------------------------------------------------------------------------------------------------------
  //LEVEL/SCENE 6 - Process final data                                 (already done in bot.js script, see bot.js source code for details)
  //--------------------------------------------------------------------------------------------------------------------------------------------------------------
  //LEVEL/SCENE 7 - find pokemon by name / select pokemon by type      (already done in bot.js script, see bot.js source code for details)
  //--------------------------------------------------------------------------------------------------------------------------------------------------------------