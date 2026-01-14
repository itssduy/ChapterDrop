import 'dotenv/config'
import express from 'express'

import { Client, GatewayIntentBits } from 'discord.js'
import { 
    InteractionType,
    InteractionResponseType,
    InteractionResponseFlags,
    MessageComponentTypes,
    verifyKeyMiddleware 
} from 'discord-interactions'
const PORT = process.env.PORT || 3030
const app = express()

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages
    ]
});


client.login(process.env.DISCORD_TOKEN);


// client.on("messageCreate", async(message)=>{
//     console.log(message);

//     if (!message.author.bot){
//         message.author.send(`Echo ${message.content}`)
//     }
// })
app.use(express.json())

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 * Parse request body and verifies incoming requests using discord-interactions package
 */
app.post('/interactions', async function (req, res) {
  // Interaction id, type and data
  const { id, type, data } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // "test" command
    if (name === 'test') {
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: InteractionResponseFlags.IS_COMPONENTS_V2,
          components: [
            {
              type: MessageComponentTypes.TEXT_DISPLAY,
              content: `hello, world!`
            }
          ]
        },
      });
    }
    else if (name === 'ping') {
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                flags: InteractionResponseFlags.IS_COMPONENTS_V2,
                components: [
                    {
                        type: 10, //Text Display
                        content: `<@${req.body.member.user.id}>`
                    }
                ]
            }
        })
    }
    else if (name === 'manga') {
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                flags: InteractionResponseFlags.IS_COMPONENTS_V2,
                components: [
                    {
                        type: 10, //Text Display
                        content: "mangas"
                    }
                ]
            }
        })
    }

    console.error(`unknown command: ${name}`);
    return res.status(400).json({ error: 'unknown command' });
  }

  console.error('unknown interaction type', type);
  return res.status(400).json({ error: 'unknown interaction type' });
});


app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
})