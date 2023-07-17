import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    // Form Select Properties
    formControl: {
        margin: theme.spacing(0.5),
        height: '2.5rem',
        minWidth: '9rem',
    },
    selectText: {
        height: '2.5rem',
        color: theme.palette.text.primary,
        padding: theme.spacing(0.5),
    },
    header: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        color: theme.palette.text.primary,
        marginBottom: theme.spacing(2.5),
    },
}));

export default useStyles;
