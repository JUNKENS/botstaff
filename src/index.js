const {
  ActionRowBuilder,
  Client,
  Collection,
  ChannelType,
  GatewayIntentBits,
  InteractionType,
  ModalBuilder,
  Routes,
  UserSelectMenuBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
  TextInputBuilder,
  TextInputStyle,
  PermissionsBitField,
  ButtonBuilder,
  ButtonStyle,
  Embed,
  ActivityType,
  Integration,
  Message,
  AttachmentBuilder,
  time,
  ChannelSelectMenuBuilder,
  StringSelectMenuInteraction,
} = require("discord.js");
const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { config } = require("dotenv");
config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildPresences,
  ],
});

const BOT_TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const CHANNEL_ID = '1082717381148807302';
const cooldowns = new Map();

const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);

client.once('ready', () => {
  console.log('Бот готов!');
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.customId.startsWith(`staff`)){

    const cooldownKey = `${interaction.user.id}-${interaction.customId}`;
    const cooldownTime = 20 * 60 * 1000; // 20 минут в миллисекундах

    if (cooldowns.has(cooldownKey)) {
      const lastUsed = cooldowns.get(cooldownKey);
      const elapsedTime = Date.now() - lastUsed;

      if (elapsedTime < cooldownTime) {
        const remainingTime = cooldownTime - elapsedTime;
        const minutes = Math.ceil(remainingTime / (60 * 1000));

        await interaction.reply({
          content: `Вы уже подали заявку в STAFF. Для подачи новой подождите ещё ${minutes} минут(ы).`,
          ephemeral: true,
        });
        return;
      }
    }

    const modal = new ModalBuilder()
    .setCustomId(`forma`)
    .setTitle('ЗАЯВКА НА STAFF')

    const imya = new TextInputBuilder()
    .setCustomId(`name`)
    .setLabel('Ваше имя и возраст?')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder(`Текст`)

    const vacancy = new TextInputBuilder()
    .setCustomId(`vacancy`)
    .setLabel('На какую должность желаете встать?')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder(`Текст`)
    
    const whyYou = new TextInputBuilder()
    .setCustomId(`whyYou`)
    .setLabel('Почему Вы хотите встать на эту должность?')
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder(`Минимум 2 предложения`)

    
    const aboutYou = new TextInputBuilder()
    .setCustomId(`aboutYou`)
    .setLabel('Расскажите о себе')
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder(`Текст`)

    
    const exp = new TextInputBuilder()
    .setCustomId(`exp`)
    .setLabel('Был ли опыт на подобной должности?')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder(`Название серверов`)

    const firstActionRow = new ActionRowBuilder().addComponents(imya);
    const secondActionRow = new ActionRowBuilder().addComponents(vacancy);
    const thirdActionRow = new ActionRowBuilder().addComponents(whyYou);
    const fourActionRow = new ActionRowBuilder().addComponents(aboutYou);
    const fiveActionRow = new ActionRowBuilder().addComponents(exp);

    modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourActionRow, fiveActionRow,);
    
    // console.log(interaction.message.CHANNEL_ID);
    // await interaction.showModal(modal);
    // interaction.deferReply({content: ``});
    if (!interaction.deferred && !interaction.replied) {
      // await interaction.deferReply({ content: '' });
      await interaction.showModal(modal);
    }

    cooldowns.set(cooldownKey, Date.now());

  }
  if (interaction.isModalSubmit()){
      
    const name = interaction.fields.getTextInputValue('name');
    const vacancy = interaction.fields.getTextInputValue('vacancy');
    const whyYou = interaction.fields.getTextInputValue('whyYou');
    const aboutYou = interaction.fields.getTextInputValue('aboutYou');
    const exp = interaction.fields.getTextInputValue('exp');
    const otvet = client.channels.cache.get(`1192530838039056477`);
    
    const embedAnsw = new EmbedBuilder()
      .setTitle('**Пришла новая заявка в STAFF**')
      .setThumbnail(`${interaction.user.avatarURL()}`)
      //.setImage(`https://i.pinimg.com/originals/88/b5/ce/88b5ce118dd23e35d476bdb77c44e0b5.gif`)
      .setImage(`https://media1.tenor.com/m/OEYPtHWPuG8AAAAd/%D0%BA%D0%BE%D1%82-%D0%BC%D0%B5%D0%BC.gif`)
      .setFields(
        {
          name:`Отправитель`,
          value: `<@${interaction.user.id}>`
        }, 
        {
        name: `Имя`,
        value: "```" + name + "```",
        inline: true,
        },
      
        { name: `Должность`,
        value: "```" + vacancy + "```",
        inline: true,
        },
        {
          name: `Почему я?`,
          value: "```" + whyYou + "```",
          inline: true,
        },
        {
          name: `Обо мне`,
          value: "```" + aboutYou + "```",
          inline: true,
        },
        {
          name: `Опыт на данной должности`,
          value: "```" + exp + "```",
          inline:false
        },
      )
    await otvet.send({content: `<@&733333598983422086>` , embeds: [embedAnsw]});
    await interaction.reply({ content: `<@${interaction.user.id}> Вы успешно подали заявку в STAFF, если её примут, вас уведомят об этом в личные сообщения и назначать собеседование`, ephemeral: true });
  };
  

});


client.on("error", console.error);
client.on("ready", () =>
  console.log("\x1b[31m%s\x1b[0m", `Bot -> [${client.user.tag}] ready!`)
);

async function main() {
  const Commands = [];
  try {
    console.log("Bot is starting...");
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: Commands,
    });
    client.login(BOT_TOKEN);
  } catch (err) {
    console.log(err);
  }
};
main();
