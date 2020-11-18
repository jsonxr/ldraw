import React, { ChangeEvent, useCallback, useMemo, useState, ReactElement } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  TextField,
  Paper,
} from '@material-ui/core';
import Autocomplete, { AutocompleteRenderInputParams } from '@material-ui/lab/Autocomplete';
import MenuIcon from '@material-ui/icons/Menu';
import { LDrawFile, LDrawFileType, SingleFile } from 'ldraw';
import { useLDraw } from 'ldraw-react';
import PartList from './PartList';
import useStyles from './Home.styles';

export default function Home(): ReactElement {
  const classes = useStyles();
  const [url, setUrl] = useState('/library/models/10270 - Bookshop.mpd');
  const [files, setFiles] = useState<LDrawFile[]>([]);
  const ldraw = useLDraw();

  const parts = useMemo(
    () =>
      files.filter(
        (m: LDrawFile) => m && [LDrawFileType.Part, LDrawFileType.Unofficial_Part].includes(m.type)
      ) as SingleFile[],
    [files]
  );

  const changeText = useCallback((value: string) => setUrl(value), []);

  const onModelChange = (e: ChangeEvent<HTMLInputElement>): void => {
    changeText(`/library/${e.target.value}`);
  };

  const onAutoChange = (event: React.ChangeEvent<unknown>, value: string | null): void => {
    changeText(`/library/${value}`);
  };

  const onClick = useCallback(async () => {
    const model = await ldraw.load(url);
    console.log('model: ', model);
    const f: LDrawFile[] = Object.values(ldraw.list);
    setFiles(f);
  }, [ldraw, url]);
  return (
    <div className={classes.root}>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            LDraw Editor
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Paper>
        <div style={{ display: 'flex' }}>
          <Autocomplete
            id="model"
            freeSolo
            style={{ flexGrow: 1 }}
            options={[
              'parts/3001.dat',
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
        </div>
        <PartList parts={parts} />
      </Paper>
    </div>
  );
}
