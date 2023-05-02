require("dotenv").config();
import fetch from 'node-fetch';
const { Telegraf, session, Scenes: { Stage, WizardScene } } = require("telegraf");
const { gen, getData, printData, typeMenu } = require("./templates/templates");
const bot = new Telegraf(process.env.TOKEN, { handlerTimeout: 420_000 }); // 420s in ms 
let generation = " ", genName = " ", regionName = " ", firstPokemon = " ", lastPokemon = " ";

bot.start(async (ctx) => {
  await ctx.reply(`Welcome to Pokedex bot!🐠\n\nCommands:\n\n/pokedex - Select a pokédex`);
});
//-----------------------------------------------------------------------------------------------------
const pokedex = new WizardScene("main menu",
  //Level 0--------------------------------------------------------------------------------------------
  async (ctx) => {
    del = (ctx?.message?.text == undefined || ctx?.message?.text != '/pokedex') ? " " : ctx.deleteMessage();
    await ctx.reply(`Select a pokédex`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: `Kanto`, callback_data: "genI" }, { text: `Johto`, callback_data: "genII" }, { text: `Hoenn`, callback_data: "genIII" }],
            [{ text: `Sinnoh`, callback_data: "genIV" }, { text: `Unova`, callback_data: "genV" }, { text: `Kalos`, callback_data: "genVI" }],
            [{ text: `Alola`, callback_data: "genVII" }, { text: `Galar`, callback_data: "genVIII" }, { text: `Paldea`, callback_data: "genIX" }],
            [{ text: `Close`, callback_data: "close" }]
          ]
        }
      });
    gifURL = 'https://media.giphy.com/media/93YKeY8qRO94cgQkXl/giphy.gif',
      await bot.telegram.sendAnimation(ctx.chat.id, gifURL,
        {
          type: 'animation',
          caption: `Spiritomb has been doing several misdeeds!\n\nIf you notice something "strange" 👻, you can /leave the session and start a new one.`
        })
        .then(({ message_id }) => { setTimeout(() => ctx.deleteMessage(message_id), 12000) });
    //Note: I've tried to handle/prevent the menu(s) from being deleted, but I couldn't... yet

    //Context: There is a validation that deletes any user messages while the wizard session exists.
    // If the menu is deleted, the wizard session will still be running, so the user will be in an infinite loop, 
    //and new messages or commands will be deleted with no possibility of leaving the current session.

    //Idea: I tried to use solve this using a timeinterval that checks 3 times if the message (menu) was deleted
    //The idea is to leave the session if the menu has been deleted, but I can't figure how to handle it based on errror 400*...

    //Error 400*. Bad Request: message to delete not found, on "deleteMessage"

    //Here's an example: 

    /* await ctx.reply(`This simulates a "menu"`)
      .then(({ message_id }) => {
        let i = 0;
        const timerFn = () => {
          i++; if (i > 3) { clearInterval(timer); }


          //This simulates a deleted menu on the first 30 seconds, next step should be leaving 
          //the session due to menu is no longer visible to interact.
          ctx?.deleteMessage(message_id)
            .catch((e) => { console.log(`Error ${e.response.error_code}.\n\n${e.response.description}, on "${e.on.method}"`); });
        }
        let timer = setInterval(timerFn, 3000);
      }); */

    ctx.wizard.cursor = 0;
    return ctx.wizard.next();
  },
  //Level 1--------------------------------------------------------------------------------------------
  async (ctx) => {
    jalapeno = (ctx?.message?.text === '/leave') ? ctx.scene.leave() : " ";
    if (ctx?.message && ctx?.callbackQuery?.data !== true) {
      return ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id);
    }
    else {
      if (ctx?.callbackQuery?.data === "close") {
        ctx.answerCbQuery();
        ctx.wizard.state.close = ctx.callbackQuery.data;
        ctx.deleteMessage();
        return ctx.scene.leave();
      }
      ctx.answerCbQuery();
      ctx.deleteMessage();
      generation = ctx?.callbackQuery?.data;
      firstPokemon = gen[generation]["firstPokemon"];
      lastPokemon = gen[generation]["lastPokemon"];
      genName = gen[generation]["name"];
      regionName = gen[generation]["region"];
      ctx.wizard.cursor = 1;
      return ctx.wizard.steps[2](ctx);
    }
  },
  //Level 2--------------------------------------------------------------------------------------------
  async (ctx) => {
    await ctx.reply(`${regionName} pokédex. (${genName}) 📕`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: `All pokémon's`, callback_data: "all" }, { text: `All pokémon's (Shiny)`, callback_data: "allShiny" }],
            [{ text: `Filter by type`, callback_data: "byType" }, { text: `Filter by type (shiny)`, callback_data: "byTypeShiny" }],
            [{ text: `Search by name`, callback_data: "byName" }, { text: `Random pokémon`, callback_data: "random" }],
            [{ text: `Pokémon type chart`, callback_data: "typeChart" }],
            [{ text: `Change pokédex`, callback_data: "back" }, { text: `Close menu`, callback_data: "close" }]
          ]
        }
      });
    ctx.wizard.cursor = 2;
    return ctx.wizard.next();
  },
  //Level 3--------------------------------------------------------------------------------------------
  async (ctx) => {
    jalapeno = (ctx?.message?.text === '/leave') ? ctx.scene.leave() : " ";
    if (ctx?.message && ctx?.callbackQuery?.data !== true) {
      return ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id);
    }
    else {
      switch (ctx?.callbackQuery?.data) {
        case undefined: ctx.scene.leave(); return "ctx.callbackQuery is undefined";
        //-----------------------------------------------------------------------------------------------
        case "all":
          ctx.answerCbQuery();
          ctx.wizard.state.all = ctx.callbackQuery.data;
          ctx.deleteMessage();
          ctx.reply(`All pokémon's from ${regionName}'s region. ❇️`);
          for (let i = firstPokemon; i <= lastPokemon; i++) {
            const pokeAPI = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`);
            if (pokeAPI.status === 404) {
              ctx.replyWithPhoto({ url: "https://http.cat/404" }, { caption: `Error: Pokémon #${i} not found. ❌` });
              continue;
            }
            const data = await pokeAPI.json();
            const info = getData(data);
            const src = { source: './src/utils/error.png' }, url = { url: info?.img };
            isImgNull = (info?.img === null) ? src : url;
            await ctx.replyWithPhoto(isImgNull, { caption: printData(info) });
          }
          ctx.wizard.cursor = 3;
          return ctx.wizard.steps[2](ctx);
        //-----------------------------------------------------------------------------------------------
        case "allShiny":
          ctx.answerCbQuery();
          ctx.wizard.state.all = ctx.callbackQuery.data;
          ctx.deleteMessage();
          ctx.reply(`All shiny pokémon's from ${regionName}'s region. ❇️`);
          for (let i = firstPokemon; i <= lastPokemon; i++) {
            const pokeAPI = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`);
            if (pokeAPI.status === 404) {
              ctx.replyWithPhoto({ url: "https://http.cat/404" }, { caption: `Error: Pokémon #${i} not found. ❌` });
              continue;
            }
            const data = await pokeAPI.json();
            const info = getData(data);
            if (info.imgShiny) {
              const src = { source: './src/utils/error.png' }, url = { url: info?.imgShiny };
              isImgNull = (info?.imgShiny === null) ? src : url;
              await ctx.replyWithPhoto(isImgNull, { caption: printData(info) });
            }
          }
          ctx.wizard.cursor = 3;
          return ctx.wizard.steps[2](ctx);
        //-----------------------------------------------------------------------------------------------
        case "random":
          ctx.answerCbQuery();
          ctx.deleteMessage();
          ctx.wizard.state.random = ctx.callbackQuery.data;
          let randomId = Math.floor(Math.random() * (lastPokemon - firstPokemon + 1) + firstPokemon);
          const pokeAPI = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}/`);
          if (pokeAPI.status === 404) {
            ctx.reply(`Random pokémon from ${regionName}'s region. 🎲`);
            await ctx.replyWithPhoto({ url: "https://http.cat/404" }, { caption: `Error: Pokémon #${randomId} not found. ❌` });
            return ctx.wizard.steps[2](ctx);
          }
          const data = await pokeAPI.json();
          ctx.reply(`Random pokémon from ${regionName}'s region. 🎲`);
          const info = getData(data);
          const src = { source: './src/utils/error.png' }, url = { url: info?.img };
          isImgNull = (info?.img === null) ? src : url;
          await ctx.replyWithPhoto(isImgNull, { caption: printData(info) });
          ctx.wizard.cursor = 3;
          return ctx.wizard.steps[2](ctx);
        //-----------------------------------------------------------------------------------------------
        case "byType":
          ctx.answerCbQuery();
          ctx.deleteMessage();
          ctx.wizard.state.dataLvl1 = ctx.callbackQuery.data;
          typeMenu(ctx);
          ctx.wizard.cursor = 3;
          return ctx.wizard.next();
        //-----------------------------------------------------------------------------------------------      
        case "byTypeShiny":
          ctx.answerCbQuery();
          ctx.deleteMessage();
          ctx.wizard.state.dataLvl1 = ctx.callbackQuery.data;
          typeMenu(ctx);
          ctx.wizard.cursor = 3;
          return ctx.wizard.next();
        //-----------------------------------------------------------------------------------------------      
        case "byName":
          ctx.answerCbQuery();
          ctx.deleteMessage();
          ctx.wizard.state.dataLvl1 = ctx.callbackQuery.data;
          ctx.wizard.state.name = {};
          await ctx.reply(`What is the pokémon's name?`);
          await ctx.reply(`Examples:\n\nMeowth\n\nMeowth shiny\n\nMeowth alola\n\nMeowth galar\n\nMeowth gmax\n\nSneasel hisui\n\nGengar mega`)
            .then(({ message_id }) => { setTimeout(() => ctx.deleteMessage(message_id), 15000) });
          ctx.wizard.cursor = 3;
          return ctx.wizard.next();
        //-----------------------------------------------------------------------------------------------
        case "typeChart":
          ctx.answerCbQuery();
          ctx.wizard.state.typeChart = ctx.callbackQuery.data;
          ctx.deleteMessage();
          await ctx.replyWithPhoto({ source: "./src/utils/typeChart.png" }, { caption: "Pokémon type chart. 📊" });
          ctx.wizard.cursor = 3;
          return ctx.wizard.steps[2](ctx);
        //-----------------------------------------------------------------------------------------------
        case "back":
          ctx.deleteMessage();
          ctx.wizard.cursor = 3;
          return ctx.wizard.steps[0](ctx);
        //-----------------------------------------------------------------------------------------------
        case "close":
          ctx.answerCbQuery();
          ctx.wizard.state.close = ctx.callbackQuery.data;
          ctx.deleteMessage();
          return ctx.scene.leave();
        //-----------------------------------------------------------------------------------------------
        default: ctx.scene.leave(); return "OK";
      }
    }
  },
  //Level 4--------------------------------------------------------------------------------------------
  async (ctx) => {
    switch (ctx?.wizard?.state?.dataLvl1) {
      case undefined: ctx.scene.leave(); return "ctx.wizard.state is undefined";
      //-----------------------------------------------------------------------------------------------
      case "byName":
        filteredPoke = "";
        if ((ctx.message.text).includes("shiny")) {
          isShiny = ctx.message.text.split(" ");
          isShiny.pop();
          filteredPoke = isShiny.join("-");
        }
        else {
          isNormal = ctx.message.text.split(" ");
          filteredPoke = (isNormal.length > 1) ? isNormal.join("-") : ctx.message.text;
        }
        pokeURL = ((ctx.message.text).includes("shiny")) ? (filteredPoke.toLocaleLowerCase()) : (filteredPoke.toLocaleLowerCase());
        if (ctx?.message?.text == undefined) {
          ctx.reply('Please enter name for real');
          return;
        }
        else {
          const pokeAPI = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeURL}/`);
          ctx.reply(`Searching pokémon by name. 🔍`);
          if (pokeAPI.status === 404) {
            await ctx.replyWithPhoto({ url: "https://http.cat/404" }, { caption: `Error: Pokémon not found. ❌\n\nMaybe you misspelled the name, try again.` });
          } else {
            const data = await pokeAPI.json();
            const info = getData(data);
            lol = ((ctx.message.text).includes("shiny")) ? info?.imgShiny : info?.img;
            const src = { source: './src/utils/error.png' }, url = { url: lol };
            isImgNull = (lol === null) ? src : url;
            await ctx.replyWithPhoto(isImgNull, { caption: printData(info) });
          }
          ctx.wizard.cursor = 5;
          return ctx.wizard.steps[2](ctx);
        }
      //-----------------------------------------------------------------------------------------------
      case "byType":
        if (ctx?.message) {
          jalapeno = (ctx?.message?.text === '/leave') ? (ctx.scene.leave()) : " ";
          return ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id);
        }
        else if (ctx?.callbackQuery?.data === "dark" && regionName === "Kanto") {
          ctx.answerCbQuery();
          return ctx.reply(`There is no dark pokémon type in ${regionName}. 🤕`)
            .then(({ message_id }) => { setTimeout(() => ctx.deleteMessage(message_id), 3000) });
        }
        else {
          ctx.answerCbQuery();
          ctx.deleteMessage();
          ctx.reply(`Getting all ${regionName}'s ${ctx?.callbackQuery?.data} pokémon. ⏳`);
          for (let i = firstPokemon; i <= lastPokemon; i++) {
            const pokeAPI = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`);
            if (pokeAPI.status === 404) { continue; }
            const data = await pokeAPI.json();
            const info = getData(data);
            for (j of info?.types) {
              if (j === ctx?.callbackQuery?.data) {
                const src = { source: './src/utils/error.png' }, url = { url: info?.img };
                isImgNull = (info?.img === null) ? src : url;
                await ctx.replyWithPhoto(isImgNull, { caption: printData(info) });
              }
            }
          }
          ctx.wizard.cursor = 5;
          return ctx.wizard.steps[2](ctx);
        }
      //-----------------------------------------------------------------------------------------------
      case "byTypeShiny":
        if (ctx?.message) {
          jalapeno = (ctx?.message?.text === '/leave') ? ctx.scene.leave() : " ";
          return ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id);
        }
        else if (ctx?.callbackQuery?.data === "dark" && regionName === "Kanto") {
          ctx.answerCbQuery();
          return ctx.reply(`There is no dark pokémon type in ${genName}. 🤕`)
            .then(({ message_id }) => { setTimeout(() => ctx.deleteMessage(message_id), 3000) });
        }
        else {
          ctx.answerCbQuery();
          ctx.deleteMessage();
          ctx.reply(`Getting all ${regionName}'s ${ctx?.callbackQuery?.data} shiny pokémon. ⏳`);
          for (let i = firstPokemon; i <= lastPokemon; i++) {
            const pokeAPI = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`);
            if (pokeAPI.status === 404) { continue; }
            const data = await pokeAPI.json();
            const info = getData(data);
            for (j of info?.types) {
              if (j === ctx?.callbackQuery?.data) {
                if (info.imgShiny) {
                  const src = { source: './src/utils/error.png' }, url = { url: info?.imgShiny };
                  isImgNull = (info?.imgShiny === null) ? src : url;
                  await ctx.replyWithPhoto(isImgNull, { caption: printData(info) });
                }
              }
            }
          }
          ctx.wizard.cursor = 5;
          return ctx.wizard.steps[2](ctx);
        }
      //-----------------------------------------------------------------------------------------------
      default: ctx.scene.leave(); return "OK";
    }
  }
);
//-----------------------------------------------------------------------------------------------------
const stage = new Stage([pokedex], { sessionName: 'pokedexSession' });
session({ property: 'pokedexSession', getSessionKey: (ctx) => ctx.chat && ctx.chat.id, });
bot.use(session());
bot.use(stage.middleware());
stage.register(pokedex);
bot.command("pokedex", async (ctx) => { ctx.scene.enter("main menu") });
//-----------------------------------------------------------------------------------------------------
bot.launch();