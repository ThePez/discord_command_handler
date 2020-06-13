import { Message, Collection } from 'discord.js';

export interface ICommand {
    name: string;
    description: string;
    run: (message: Message, args: Array<string>) => any;
}

export class Command {
    public command: ICommand;

    constructor(command: ICommand) {
        this.command = command;
    }
}

export default class CommandHandler {
    public PREFIX: string;
    public COMMANDS: Collection<string, ICommand>;

    constructor(PREFIX: string, COMMANDS: Array<ICommand>) {
        this.PREFIX = PREFIX;
        this.COMMANDS = new Collection();

        for (let index = 0; index < COMMANDS.length; index++) {
            this.COMMANDS.set(COMMANDS[index].name, COMMANDS[index]);
        }
    }

    onMessage(message: Message) {
        try {
            if (!message.content.startsWith(this.PREFIX) || message.author.bot) return;

            const args: string[] = message.content.slice(this.PREFIX.length).trim().split(/ +/g);
            const command: string = args.shift()?.toLowerCase() || '';

            if (!this.COMMANDS.has(command)) return message.channel.send(`Command not found`);

            this.COMMANDS.get(command)?.run(message, args);
        }
        catch (error) {
            console.log(error);
        }
    }
}