import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      boxSizing: 'border-box',
      flexShrink: 0,
    },
    /* Styles applied to the `div` element that wraps the children. */
    tile: {
      position: 'relative',
      display: 'block', // In case it's not rendered with a div.
      height: '100%',
      overflow: 'hidden',
    },
    /* Styles applied to an `img` element child, if needed to ensure it covers the tile. */
    imgFullHeight: {
      position: 'relative',
      transform: 'translate(-50%,-50%)',
      top: '50%',
      left: '50%',
    },
    /* Styles applied to an `img` element child, if needed to ensure it covers the tile. */
    imgFullWidth: {
      position: 'relative',
      transform: 'translate(-50%,-50%)',
      top: '50%',
      left: '50%',
    },

    // root: {
    //   display: 'flex',
    //   flexWrap: 'wrap',
    //   justifyContent: 'space-around',
    //   overflow: 'hidden',
    //   backgroundColor: theme.palette.background.paper,
    // },
    gridList: {
      display: 'flex',
      flexWrap: 'wrap',
      width: '100%',
      height: '100%',
    },

    icon: {
      color: 'rgba(255, 255, 255, 0.54)',
    },

    card: {
      margin: '2px',
      width: 240,
      height: 240,
    },
    img: {
      objectFit: 'contain',
      maxHeight: 170,
      maxWidth: 240,
    },
    button: {
      backgroundColor: 'transparent',
      padding: '12px',
      overflow: 'visible',
      fontSize: '1.5rem',
      textAlign: 'center',
      transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      borderRadius: '50%',
    },
    svgIcon: {
      color: 'white',
      fill: 'currentColor',
      width: '1em',
      height: '1em',
      display: 'inline-block',
      fontSize: '1.5rem',
      transition: 'fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      flexShrink: 0,
      userSelect: 'none',
    },
  })
);

export default useStyles;
