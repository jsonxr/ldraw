import { Command, CommandType } from './Command';

export class Meta implements Command {
  type: CommandType = 'META';
  line = '';
  lineNo = 0;
  constructor(props: Partial<Meta>) {
    Object.assign(this, props);
  }
}
