import guildMemberAdd from './guildMemberAdd.js';
import guildMemberRemove from './guildMemberRemove.js';
import interactionCreate from './interactionCreate.js';
import messageCreate from './messageCreate.js';
import messageDelete from './messageDelete.js';
import ready from './ready.js';

export const events = {
  guildMemberAdd,
  guildMemberRemove,
  interactionCreate,
  messageCreate,
  messageDelete,
  ready,
};
