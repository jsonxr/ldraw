import { Command, CommandType } from './Command';

//------------------------------------------------------------------------------
// Line Type 0: Comments
//------------------------------------------------------------------------------
/**
 *
 */
export class Comment implements Command {
  type: CommandType = 'COMMENT';
  lineNo = 0;
  line = '';
  constructor(props?: Omit<Comment, 'type'>) {
    Object.assign(this, props);
  }
}
