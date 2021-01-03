import React, {
  ChangeEvent,
  useCallback,
  useState,
  ReactElement,
  useEffect,
} from 'react';
import { Button, TextField, Paper, Box } from '@material-ui/core';
import Autocomplete, {
  AutocompleteRenderInputParams,
} from '@material-ui/lab/Autocomplete';
import { SingleFile } from 'ldraw';
import { useLDraw } from 'react-ldraw';
import PartList from './components/PartList';
import useStyles from './PartsList.styles';
import LDrawLoading from './components/LDrawLoading';

const PartsList = (): ReactElement => {
  console.log('PartsList');
  const ldraw = useLDraw();
  const classes = useStyles();
  const [url, setUrl] = useState('models/multi.mpd');
  const [parts, setParts] = useState<SingleFile[]>(
    () => (ldraw.parts as unknown) as SingleFile[]
  );

  const changeText = useCallback((value: string) => setUrl(value), []);

  const onModelChange = (e: ChangeEvent<HTMLInputElement>): void => {
    changeText(`${e.target.value}`);
  };

  const onAutoChange = (
    event: React.ChangeEvent<unknown>,
    value: string | null
  ): void => {
    changeText(`${value}`);
  };

  const onClick = useCallback(async () => {
    const model = await ldraw.load(url);
    console.log('model: ', model);
    setParts(ldraw.parts);
  }, [ldraw, url]);
  return (
    <Box className={classes.root}>
      <Paper>
        <Box display="flex">
          <Autocomplete
            id="model"
            freeSolo
            style={{ flexGrow: 1 }}
            options={[
              'models/multi.mpd',
              '3001.dat',
              '3070a.dat',
              '3070b.dat',
              'models/10270 - Bookshop.mpd',
              'models/10179-1 - Millennium Falcon - UCS.mpd',
              'models/76042 - The SHIELD Helicarrier.mpd',
            ]}
            onChange={onAutoChange}
            renderInput={(params: AutocompleteRenderInputParams) => (
              <TextField
                {...params}
                label="Lego Model File"
                margin="normal"
                variant="outlined"
                onChange={onModelChange}
              />
            )}
          />
          <Button onClick={onClick}>Get Model</Button>
        </Box>
        <LDrawLoading />
        <PartList parts={parts} />
      </Paper>
    </Box>
  );
};

export default PartsList;
