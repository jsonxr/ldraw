import { Command, CommandType } from './Command';

//------------------------------------------------------------------------------
// Line Type 0: Comments
//------------------------------------------------------------------------------
/**
 *
 */
export class Empty implements Command {
  type: CommandType = 'EMPTY';
  lineNo = 0;
  constructor(props?: Pick<Empty, 'lineNo'>) {
    Object.assign(this, props);
  }
}
