import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    card: {
      border: '1px solid rgba(0, 0, 0, 0.5)',
      margin: '5px',
      width: 240,
      height: 240,
      textDecoration: 'none',
    },
    img: {
      objectFit: 'contain',
      maxHeight: 170,
      maxWidth: 240,
    },
  })
);

export default useStyles;
