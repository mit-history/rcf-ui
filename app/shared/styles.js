export const STYLES = {
    titleChart: {
        backgroundColor: '#009687',
        color: 'white',
        fontVariant: 'small-caps',
        fontSize: '35px',
        fontWeight: 'bold',
        justifyContent: 'center',
    },
};

export const GENRE_COLORS = {
    comédie: '#ff7f0e',
    tragédie: '#1f77b4',
    'comedie-ballet': '#ffbb78',
    drame: '#17becf',
    autre: '#e377c2',
    null: '#f7b6d2',
};

export function genreColor(value) {
    return GENRE_COLORS[value] || '#ccc';
}
