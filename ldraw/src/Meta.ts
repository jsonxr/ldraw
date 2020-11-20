import { Spec, SpecType } from './Spec';

export class Meta implements Spec {
  type = SpecType.META;
  line = '';
  lineNo = -1;
  constructor(props: Partial<Meta>) {
    Object.assign(this, props);
  }
}
