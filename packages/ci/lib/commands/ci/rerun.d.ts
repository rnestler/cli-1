import { Command } from '@heroku-cli/command';
export default class CiReRun extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        app: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
        pipeline: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
    };
    static args: {
        name: string;
        required: boolean;
    }[];
    run(): Promise<void>;
}
