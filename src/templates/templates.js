const gen = {
  genI: { name: "GEN-I", region: "Kanto", firstPokemon: 1, lastPokemon: 151 },
  genII: { name: "GEN-II", region: "Johto", firstPokemon: 152, lastPokemon: 251 },
  genIII: { name: "GEN-III", region: "Hoenn", firstPokemon: 252, lastPokemon: 386 },
  genIV: { name: "GEN-IV", region: "Sinnoh", firstPokemon: 387, lastPokemon: 493 },
  genV: { name: "GEN-V", region: "Unova", firstPokemon: 494, lastPokemon: 649 },
  genVI: { name: "GEN-VI", region: "Kalos", firstPokemon: 650, lastPokemon: 721 },
  genVII: { name: "GEN-VII", region: "Alola", firstPokemon: 722, lastPokemon: 809 },
  genVIII: { name: "GEN-VIII", region: "Galar", firstPokemon: 810, lastPokemon: 905 },
  genIX: { name: "GEN-IX", region: "Paldea", firstPokemon: 906, lastPokemon: 1010 },
};

const getData = (data) => {
  const types = [], abilities = [];
  data.types.forEach((x) => types.push(x.type.name));
  data.abilities.forEach((y) => abilities.push(y.ability.name));
  let info = {};
  info = {
    img: ((data?.sprites?.front_default) ? data?.sprites?.front_default : null),
    imgShiny: ((data?.sprites?.front_shiny) ? data?.sprites?.front_shiny : null),
    name: ((data?.name) ? data?.name : "???"),
    id: ((data?.id) ? data?.id : null),
    weight: ((data?.weight) ? (data?.weight / 10) : "???"),
    height: ((data?.height) ? (data?.height / 10) : "???"),
    types: ((types) ? types : "???"),
    abilities: ((abilities) ? abilities : "???"),
    base_experience: ((data?.base_experience) ? data?.base_experience : "???")
  };
  return info;
}

const printData = (values) => {
  const msg = `
Name: ${values?.name}
Pokédex number: #${values?.id}
Weight: ${values?.weight} kg
Height: ${values?.height} m
Type(s): ${values?.types}
Abilities: ${values?.abilities}
Base experience: ${values.base_experience}`;

  return msg;
}

const typeMenu = (ctx) => {
  ctx.reply(`Select a pokemon type:`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "bug", callback_data: "bug" },
            { text: "dark", callback_data: "dark" },
            { text: "dragon", callback_data: "dragon" },
            { text: "electric", callback_data: "electric" },
            { text: "fairy", callback_data: "fairy" },
          ],
          [
            { text: "fighting", callback_data: "fighting" },
            { text: "fire", callback_data: "fire" },
            { text: "flying", callback_data: "flying" },
            { text: "grass", callback_data: "grass" },
            { text: "ground", callback_data: "ground" },
          ],
          [
            { text: "ghost", callback_data: "ghost" },
            { text: "ice", callback_data: "ice" },
            { text: "normal", callback_data: "normal" },
            { text: "poison", callback_data: "poison" },
            { text: "psychic", callback_data: "psychic" },
          ],
          [{ text: "rock", callback_data: "rock" },
          { text: "steel", callback_data: "steel" },
          { text: "water", callback_data: "water" }]
        ]
      }
    })
};

export { gen, getData, printData, typeMenu };