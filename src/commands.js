import 'dotenv/config';
import { InstallGlobalCommands } from './utils.js';
import { describe } from 'node:test';


const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const PING_COMMAND = {
    name: 'ping',
    description: 'ping yourself',
    type: 1,
    integration_types: [0,1],
    contexts: [0, 1]
}

const MANGA_COMMAND = {
    name: 'mangas',
    description: 'Get a list of manga',
    type: 1,
    integration_types: [0,1],
    contexts: [0, 1]
}

const SEARCH_MANGA_COMMAND = {
  name: "search",
  description: "Search manga based on name",
  type: 1,
  integration_types: [0,1],
  contexts: [0, 1],
  options: [
    {
      name: "query",
      description: "Manga name",
      type: 3, // STRING
      required: true
    }
  ]
}

const TRACK_MANGA_COMMAND ={
  name: "track",
  description: "track a manga for updates",
  type: 1,
  integration_types: [0,1],
  contexts: [0, 1],
  options: [
    {
      name: "query",
      description: "Manga name",
      type: 3, // STRING
      required: true
    }
  ]
}



const ALL_COMMANDS = [TEST_COMMAND, PING_COMMAND, MANGA_COMMAND, SEARCH_MANGA_COMMAND, TRACK_MANGA_COMMAND];

InstallGlobalCommands(process.env.DISCORD_APP_ID, ALL_COMMANDS);