import 'dotenv/config'
import express from 'express'
import axios from 'axios'
import {prisma} from './prisma.js'
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

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 * Parse request body and verifies incoming requests using discord-interactions package
 */
app.post('/interactions', verifyKeyMiddleware(process.env.DISCORD_PUBLIC_KEY), async function (req, res) {
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
    else if (name === 'mangas') {
      try {        
        const URL = `${process.env.API_URL}/manga`;
        const response = await axios.get(URL);

        const mangas = formatMangaList(response.data.data)
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            type: 10,
            content: mangas
          }
        })
    
      } catch(error){
        console.log(error)
      }
    }
    else if (name === 'search') {
      try {

        let mangaName = data['options'][0]['value'];
        const URL = `${process.env.API_URL}/manga`;
        const response = await axios.get(URL, {
          params: {
            "title": mangaName
          }
        })

        const manga = response.data.data[0]
        let mangaId = manga["id"];
        let mangaTitle = `${manga["attributes"]["title"]['en'] || manga["attributes"]["title"]['ja-ro'] || manga["attributes"]["title"]['ko-ro']}\n`
        let mangaDescription = `${manga["attributes"]["description"]['en']}`
        let coverId;
        //console.log(manga["relationships"])
        for (const rel of manga.relationships){
          if (rel.type === "cover_art") {
            coverId = rel.id;
            //console.log(coverId)
            break;
          }
        }


        const chapter = await getChapter(manga['attributes']['latestUploadedChapter'])
        const coverNameUrl = `${process.env.API_URL}/cover/${coverId}`;
        const coverNameResponse = await axios.get(coverNameUrl)
        //console.log(coverNameResponse.data.data.attributes)
        const coverName = coverNameResponse.data.data.attributes.fileName


        const coverUrl = `https://uploads.mangadex.org/covers/${mangaId}/${coverName}`

        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            type: 10,
            embeds: [
              {
                title: mangaTitle,
                description: mangaDescription,
                image: {
                  url: coverUrl
                },
                fields: [
                  {
                    name: "Latest Chapter",
                    value: chapter?.attributes?.chapter || "Unknown",
                    inline: true
                  },
                ]
              }
            ]
          }
        })
      }
      catch (err) {
        console.log(err)
      }
    }
    else if (name === 'track'){
      try {
        const userId = req.body.member.user.id;
        const username = req.body.member.user.username;
        let mangaName = data['options'][0]['value'];

        const mangaUrl = `${process.env.API_URL}/manga`

        const mangaResponse = await axios.get(mangaUrl, {
          params: {
            "title": mangaName
          }
        })
        const mangadexManga = mangaResponse.data.data[0]

        const mangadexId = mangadexManga.id;
        const mangaTitle = mangadexManga.attributes.title.en;
        const lastChapterId = mangadexManga.attributes.latestUploadedChapter;

        let coverId = '';
        for (const rel of mangadexManga.relationships){
          if (rel.type === "cover_art") {
            coverId = rel.id;
            //console.log(coverId)
            break;
          }
        }

        const coverNameUrl = `${process.env.API_URL}/cover/${coverId}`;
        const coverNameResponse = await axios.get(coverNameUrl)
        const coverFileName = coverNameResponse.data.data.attributes.fileName;

        let user = await prisma.user.findUnique({
          where: { discordId: userId },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              discordId: userId,
              username: username,
              created_at: new Date()
            }
          });
        }

        let manga = await prisma.manga.findUnique({
          where: { mangadexId: mangadexId } // this is MangaDex UUID
        });

        if (!manga) {
          manga = await prisma.manga.create({
            data: {
              mangadexId: mangadexId,
              name: mangaTitle
            }
          });
        }

        let tracker = await prisma.tracker.findUnique({
          where: { userId: user.id },
        });

        if (!tracker) {
          tracker = await prisma.tracker.create({
            data: { userId: user.id }
          });
        }
        
        await prisma.mangaTrackerRelation.create({
          data: {
            trackerId: tracker.id,
            mangaId: manga.id,
            latestChapterId: lastChapterId,   // optional, from MangaDex
            coverFilename: coverFileName
          }
        });
        
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                flags: InteractionResponseFlags.IS_COMPONENTS_V2,
                components: [
                    {
                        type: 10, //Text Display
                        content: `Tracked ${mangaTitle} for <@${req.body.member.user.id}>`
                    }
                ]
            }
        })
      } catch(err){
        console.log(err)
      }
    }
    console.error(`unknown command: ${name}`);
    return res.status(400).json({ error: 'unknown command' });
  }

  console.error('unknown interaction type', type);
  return res.status(400).json({ error: 'unknown interaction type' });
});

const getChapter = async (chapterId)=>{
  const URL = `${process.env.API_URL}/chapter/${chapterId}`
  const response = await axios.get(URL)

  return response.data.data
}

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
})


async function checkForUpdates() {
  try {
    const tracked = await prisma.mangaTrackerRelation.findMany({
      include: {
        manga: true,
        tracker: { include: { user: true } }
      }
    });

    for (const track of tracked) {
      const mangaId = track.manga.mangadexId;

      // Fetch latest chapter from MangaDex
      const latestChapterFromAPI = await getChapter(track.latestChapterId);

      if (latestChapterFromAPI.id !== track.latestChapterId) {
        // Send Discord notification
        const user = await client.users.fetch(track.tracker.user.discordId);
        user.send(`New chapter for ${track.manga.name}: ${latestChapterFromAPI.attributes.chapter}`);

        // Update DB
        await prisma.mangaTrackerRelation.update({
          where: { trackerId_mangaId: { trackerId: track.trackerId, mangaId: track.mangaId } },
          data: { latestChapterId: latestChapterFromAPI.id }
        });

        console.log(`Updated ${track.manga.name} for ${track.tracker.user.username}`);
      }
    }
  } catch (err) {
    console.error("Error checking updates:", err);
  }
}

// Run every 10 minutes
const POLL_INTERVAL = 10 * 60 * 1000;
setInterval(checkForUpdates, POLL_INTERVAL);