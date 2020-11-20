import { Spec, SpecType } from './Spec';

//------------------------------------------------------------------------------
// Line Type 0: Comments
//------------------------------------------------------------------------------
/**
 *
 */
export class Comment implements Spec {
  type = SpecType.COMMENT;
  lineNo = -1;
  line = '';
  constructor(props: Omit<Comment, 'type'>) {
    Object.assign(this, props);
  }
}
