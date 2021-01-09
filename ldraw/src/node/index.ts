export * from '../shared';
export * from './fileLoader';
export * from './FancyNode';

import { LDraw } from '../shared';
import { fileLoader } from './fileLoader';
LDraw.defaultLoaders = [fileLoader()];
