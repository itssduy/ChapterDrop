import 'dotenv/config';
import { InstallGlobalCommands } from './utils.js';


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
    name: 'manga',
    description: 'Get a list of manga',
    type: 1,
    integration_types: [0,1],
    contexts: [0, 1]
}

const ALL_COMMANDS = [TEST_COMMAND, PING_COMMAND, MANGA_COMMAND];

InstallGlobalCommands(process.env.DISCORD_APP_ID, ALL_COMMANDS);