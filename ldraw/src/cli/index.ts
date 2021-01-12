import path from 'path';
import Handlebars from 'handlebars';
import { LDraw } from '../shared/LDraw';
import { fileLoader } from '../node/fileLoader';
import { isSingleFile } from '../shared/SingleFile';
import { fileURLToPath } from 'url';

const template = Handlebars.compile(`
//------------------------------------------------------------------------------
// DO NOT MODIFY!!!!!
//------------------------------------------------------------------------------
// Created by running bin/create-colours > src/shared/Colours.ts

import { Colour } from './Colour';

const colours: Colour[] = [];
export const getColours = (): Colour[] => colours;

{{#colours}}
colours[{{code}}] = new Colour({
  name: '{{ name }}',
  {{#if display}}
  display: '{{ display }}',
  {{/if}}
  {{#if legoId}}
  legoId: {{ legoId }},
  {{/if}}
  code: {{ code }},
  value: '{{ value }}',
  edge: '{{ edge }}',
  {{#if alpha}}
  alpha: {{ alpha }},
  {{/if}}
  {{#if luminance}}
  luminance: {{ luminance }},
  {{/if}}
  {{#if finish}}
  finish: '{{ finish }}',
  {{/if}}
  {{#if material}}
  material: {
    name: '{{material.name}}',
    value: '{{material.value}}',
    {{#if material.alpha}}
    alpha: {{ material.alpha }},
    {{/if}}
    {{#if material.luminance}}
    luminance: {{ material.luminance }},
    {{/if}}
    {{#if material.fraction}}
    fraction: {{material.fraction}},
    {{/if}}
    {{#if material.vfraction}}
    vfraction: {{material.vfraction}},
    {{/if}}
    {{#if material.minsize}}
    minsize: {{ material.minsize }},
    {{/if}}
    {{#if material.maxsize}}
    maxsize:  {{ material.maxsize }},
    {{/if}}
    {{#if material.size}}
    size:  {{ material.size }},
    {{/if}}
  }
  {{/if}}
});
{{/colours}}

`);

const cli = async () => {
  const __dirname = fileURLToPath(import.meta.url);
  const rootPath = path.resolve(
    path.join(__dirname, '../../../../docs/library')
  );

  const loader = fileLoader(rootPath);
  const ldraw = new LDraw({ loaders: [loader] });

  const config = await ldraw.load('LDConfig.ldr');
  if (isSingleFile(config)) {
    const text = template({ colours: config.colours });
    console.log(text);
  }
};

export default cli;
