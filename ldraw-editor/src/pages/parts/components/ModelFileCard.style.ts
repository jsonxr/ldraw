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
      flex: 0,
      maxHeight: 170,
      maxWidth: 240,
    },
    text: {
      color: 'white',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    filename: {
      fontSize: '1rem',
    },
    description: {
      fontSize: '0.75rem',
    },
  })
);

export default useStyles;
