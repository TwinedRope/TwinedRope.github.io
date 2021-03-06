const ColorHex = {
    White: '#ffffff',
    Black: '#000000',
    Gray: '#aaaaaa',
    DarkGray: '#555555',
    LightPurple: '#ff55ff',
    DarkPurple: '#aa00aa',
    DarkAqua: '#00aaaa',
    Aqua: '#55ffff',
    DarkBlue: '#0000aa',
    Blue: "#5555ff",
    DarkGreen: '#00aa00',
    Green: '#55ff55',
    Gold: '#ffaa00',
    Yellow: '#ffff55',
    DarkRed: '#aa0000',
    Red: '#ff5555'
};

const ColorDecodeHex = {
    '#ffffff': 'White',
    '#000000': 'Black',
    '#aaaaaa': 'Gray',
    '#555555': 'DarkGray',
    '#ff55ff': 'LightPurple',
    '#aa00aa': 'DarkPurple',
    '#00aaaa': 'DarkAqua',
    '#55ffff': 'Aqua',
    '#0000aa': 'DarkBlue',
    '#5555ff': 'Blue',
    '#00aa00': 'DarkGreen',
    '#55ff55': 'Green',
    '#ffaa00': 'Gold',
    '#ffff55': 'Yellow',
    '#aa0000': 'DarkRed',
    '#ff5555': 'Red'
}

const ColorDecodeMC = {
    '#ffffff': 'white',
    '#000000': 'black',
    '#aaaaaa': 'gray',
    '#555555': 'dark_gray',
    '#ff55ff': 'light_purple',
    '#aa00aa': 'dark_purple',
    '#00aaaa': 'dark_aqua',
    '#55ffff': 'aqua',
    '#0000aa': 'dark_blue',
    '#5555ff': 'blue',
    '#00aa00': 'dark_green',
    '#55ff55': 'green',
    '#ffaa00': 'gold',
    '#ffff55': 'yellow',
    '#aa0000': 'dark_red',
    '#ff5555': 'red'
}

const ColorEncodeMCHex = {
    'white': '#ffffff',
    'black': '#000000',
    'gray': '#aaaaaa',
    'dark_gray': '#555555',
    'light_purple': '#ff55ff',
    'dark_purple': '#aa00aa',
    'dark_aqua': '#00aaaa',
    'aqua': '#55ffff',
    'dark_blue': '#0000aa',
    'blue': '#5555ff',
    'dark_green': '#00aa00',
    'green': '#55ff55',
    'gold': '#ffaa00',
    'yellow': '#ffff55',
    'dark_red': '#aa0000',
    'red': '#ff5555'
}

const Format = {
    'bold': 0,
    'italic': 1, 
    'underline': 2, 
    'strikethrough': 3, 
    'obfuscated': 4, 
    'enchanted': 5
}

const FormatArr = ["bold", "italic", "underlined", "strikethrough", "obfuscated", "enchanted"];

const RelevantKeyCodes = {
    PageUp: 33,
    PageDown: 34,
    End: 35,
    Home: 36,
    Left: 37,
    Up: 38,
    Right: 39,
    Down: 40
}