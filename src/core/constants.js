// Colores de referencia de la app (se configuran por CSS variables en index.css)
export const COLOR_BG_DARK = "#050608";
export const COLOR_BG_PANEL = "#111216";
export const COLOR_ACCENT_GOLD = "#ffd700";
export const COLOR_ACCENT_TEAL = "#d1d5db";
export const COLOR_TEXT_LIGHT = "#ffffff";
export const COLOR_TEXT_MUTED = "#9ca3af";

export const TEAMS = [
    // Grupo A
    "MEX", "RSA", "KOR", "CZE",
    // Grupo B
    "CAN", "BIH", "QAT", "SUI",
    // Grupo C
    "BRA", "MAR", "HAI", "SCO",
    // Grupo D
    "USA", "PAR", "AUS", "TUR",
    // Grupo E
    "GER", "CUW", "CIV", "ECU",
    // Grupo F
    "NED", "JPN", "SWE", "TUN",
    // Grupo G
    "BEL", "EGY", "IRN", "NZL",
    // Grupo H
    "ESP", "CPV", "KSA", "URU",
    // Grupo I
    "FRA", "SEN", "NOR", "IRQ",
    // Grupo J
    "ARG", "ALG", "AUT", "JOR",
    // Grupo K
    "POR", "COD", "UZB", "COL",
    // Grupo L
    "ENG", "CRO", "GHA", "PAN"
];

export const TEAM_NAMES = {
    // Grupo A
    "MEX": "México", "RSA": "Sudáfrica", "KOR": "Corea del Sur", "CZE": "Chequia",
    // Grupo B
    "CAN": "Canadá", "BIH": "Bosnia y Herzegovina", "QAT": "Qatar", "SUI": "Suiza",
    // Grupo C
    "BRA": "Brasil", "MAR": "Marruecos", "HAI": "Haití", "SCO": "Escocia",
    // Grupo D
    "USA": "Estados Unidos", "PAR": "Paraguay", "AUS": "Australia", "TUR": "Turquía",
    // Grupo E
    "GER": "Alemania", "CUW": "Curazao", "CIV": "Costa de Marfil", "ECU": "Ecuador",
    // Grupo F
    "NED": "Países Bajos", "JPN": "Japón", "SWE": "Suecia", "TUN": "Túnez",
    // Grupo G
    "BEL": "Bélgica", "EGY": "Egipto", "IRN": "Irán", "NZL": "Nueva Zelanda",
    // Grupo H
    "ESP": "España", "CPV": "Cabo Verde", "KSA": "Arabia Saudita", "URU": "Uruguay",
    // Grupo I
    "FRA": "Francia", "SEN": "Senegal", "NOR": "Noruega", "IRQ": "Irak",
    // Grupo J
    "ARG": "Argentina", "ALG": "Argelia", "AUT": "Austria", "JOR": "Jordania",
    // Grupo K
    "POR": "Portugal", "COD": "República Democrática del Congo", "UZB": "Uzbekistán", "COL": "Colombia",
    // Grupo L
    "ENG": "Inglaterra", "CRO": "Croacia", "GHA": "Ghana", "PAN": "Panamá"
};

export const TEAM_EMOJIS = {
    "MEX": "🇲🇽", "RSA": "🇿🇦", "KOR": "🇰🇷", "CZE": "🇨🇿",
    "CAN": "🇨🇦", "BIH": "🇧🇦", "QAT": "🇶🇦", "SUI": "🇨🇭",
    "BRA": "🇧🇷", "MAR": "🇲🇦", "HAI": "🇭🇹", "SCO": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    "USA": "🇺🇸", "PAR": "🇵🇾", "AUS": "🇦🇺", "TUR": "🇹🇷",
    "GER": "🇩🇪", "CUW": "🇨🇼", "CIV": "🇨🇮", "ECU": "🇪🇨",
    "NED": "🇳🇱", "JPN": "🇯🇵", "SWE": "🇸🇪", "TUN": "🇹🇳",
    "BEL": "🇧🇪", "EGY": "🇪🇬", "IRN": "🇮🇷", "NZL": "🇳🇿",
    "ESP": "🇪🇸", "CPV": "🇨🇻", "KSA": "🇸🇦", "URU": "🇺🇾",
    "FRA": "🇫🇷", "SEN": "🇸🇳", "NOR": "🇳🇴", "IRQ": "🇮🇶",
    "ARG": "🇦🇷", "ALG": "🇩🇿", "AUT": "🇦🇹", "JOR": "🇯🇴",
    "POR": "🇵🇹", "COD": "🇨🇩", "UZB": "🇺🇿", "COL": "🇨🇴",
    "ENG": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "CRO": "🇭🇷", "GHA": "🇬🇭", "PAN": "🇵🇦"
};

export const FIFA_TO_ISO2 = {
    "MEX": "mx", "RSA": "za", "KOR": "kr", "CZE": "cz",
    "CAN": "ca", "BIH": "ba", "QAT": "qa", "SUI": "ch",
    "BRA": "br", "MAR": "ma", "HAI": "ht", "SCO": "gb-sct",
    "USA": "us", "PAR": "py", "AUS": "au", "TUR": "tr",
    "GER": "de", "CUW": "cw", "CIV": "ci", "ECU": "ec",
    "NED": "nl", "JPN": "jp", "SWE": "se", "TUN": "tn",
    "BEL": "be", "EGY": "eg", "IRN": "ir", "NZL": "nz",
    "ESP": "es", "CPV": "cv", "KSA": "sa", "URU": "uy",
    "FRA": "fr", "SEN": "sn", "NOR": "no", "IRQ": "iq",
    "ARG": "ar", "ALG": "dz", "AUT": "at", "JOR": "jo",
    "POR": "pt", "COD": "cd", "UZB": "uz", "COL": "co",
    "ENG": "gb-eng", "CRO": "hr", "GHA": "gh", "PAN": "pa"
};

export const TEAM_COLORS = {
    "MEX": ["#006847", "#C8102E"], // Verde y Rojo
    "RSA": ["#007A4D", "#FFB81C"], // Verde y Oro
    "KOR": ["#CD113B", "#0F4C81"], // Rojo y Azul
    "CZE": ["#11457E", "#D91E36"], // Azul y Rojo
    "CAN": ["#FF0000", "#FFFFFF"], // Rojo y Blanco
    "BIH": ["#002F6C", "#FECB00"], // Azul y Amarillo
    "QAT": ["#8A1538", "#FFFFFF"], // Granate y Blanco
    "SUI": ["#DA291C", "#FFFFFF"], // Rojo y Blanco
    "BRA": ["#FECB00", "#009739"], // Amarillo y Verde
    "MAR": ["#C1272D", "#006233"], // Rojo y Verde
    "HAI": ["#00209F", "#D21034"], // Azul y Rojo
    "SCO": ["#0065BF", "#FFFFFF"], // Azul y Blanco
    "USA": ["#002868", "#BF0A30"], // Azul y Rojo
    "PAR": ["#D52B1E", "#0038A8"], // Rojo y Azul
    "AUS": ["#FFCD00", "#00843D"], // Oro y Verde
    "TUR": ["#E30A17", "#FFFFFF"], // Rojo y Blanco
    "GER": ["#000000", "#FFCC00"], // Negro y Oro
    "CUW": ["#002B7F", "#F9E316"], // Azul y Amarillo
    "CIV": ["#FF8200", "#009E60"], // Naranja y Verde
    "ECU": ["#FFDD00", "#032D74"], // Amarillo y Azul
    "NED": ["#FF4F00", "#21468B"], // Naranja y Azul
    "JPN": ["#0005CB", "#FF0000"], // Azul Samurái y Rojo
    "SWE": ["#006AA7", "#FECC00"], // Azul y Amarillo
    "TUN": ["#E20917", "#FFFFFF"], // Rojo y Blanco
    "BEL": ["#E30613", "#FFCC00"], // Rojo y Amarillo
    "EGY": ["#C8102E", "#000000"], // Rojo y Negro
    "IRN": ["#239F40", "#DA0000"], // Verde y Rojo
    "NZL": ["#FFFFFF", "#000000"], // Blanco y Negro (All Blacks)
    "ESP": ["#C60B1E", "#FFC400"], // Rojo y Oro
    "CPV": ["#002A8F", "#CE1126"], // Azul y Rojo
    "KSA": ["#006C35", "#FFFFFF"], // Verde y Blanco
    "URU": ["#00A6EF", "#FFFFFF"], // Celeste y Blanco
    "FRA": ["#002395", "#ED2939"], // Azul y Rojo
    "SEN": ["#00853F", "#E31B23"], // Verde y Rojo
    "NOR": ["#BA0C2F", "#00205B"], // Rojo y Azul
    "IRQ": ["#CE1126", "#007A3D"], // Rojo y Verde
    "ARG": ["#75AADB", "#FFFFFF"], // Celeste y Blanco
    "ALG": ["#006633", "#D21034"], // Verde y Rojo
    "AUT": ["#ED2939", "#FFFFFF"], // Rojo y Blanco
    "JOR": ["#E0162B", "#000000"], // Rojo y Negro
    "POR": ["#DA121A", "#114511"], // Rojo y Verde
    "COD": ["#007FFF", "#F7D117"], // Azul y Amarillo
    "UZB": ["#00A9E0", "#1EB53A"], // Celeste y Verde
    "COL": ["#FCD116", "#003893"], // Amarillo y Azul
    "ENG": ["#CE1124", "#FFFFFF"], // Blanco y Rojo (St George)
    "CRO": ["#FF0000", "#002F6C"], // Rojo y Azul (Tablero ajedrez)
    "GHA": ["#FCD116", "#006B3F"], // Amarillo y Verde
    "PAN": ["#005293", "#D21034"]  // Azul y Rojo
};

export const GROUPS = {
    "Grupo A": ["MEX", "RSA", "KOR", "CZE"],
    "Grupo B": ["CAN", "BIH", "QAT", "SUI"],
    "Grupo C": ["BRA", "MAR", "HAI", "SCO"],
    "Grupo D": ["USA", "PAR", "AUS", "TUR"],
    "Grupo E": ["GER", "CUW", "CIV", "ECU"],
    "Grupo F": ["NED", "JPN", "SWE", "TUN"],
    "Grupo G": ["BEL", "EGY", "IRN", "NZL"],
    "Grupo H": ["ESP", "CPV", "KSA", "URU"],
    "Grupo I": ["FRA", "SEN", "NOR", "IRQ"],
    "Grupo J": ["ARG", "ALG", "AUT", "JOR"],
    "Grupo K": ["POR", "COD", "UZB", "COL"],
    "Grupo L": ["ENG", "CRO", "GHA", "PAN"]
};

function generateStickerCodes() {
    const codes = [];
    // Cromo inicial especial 00
    codes.push("00");
    
    // Generales (FWC1 - FWC19)
    for (let i = 1; i <= 19; i++) {
        codes.push(`FWC${i}`);
    }
    
    // 48 Equipos x 20 figuritas
    for (const team of TEAMS) {
        for (let i = 1; i <= 20; i++) {
            codes.push(`${team}${i}`);
        }
    }
    
    // Especiales de Coca-Cola (CC1 - CC14)
    for (let i = 1; i <= 14; i++) {
        codes.push(`CC${i}`);
    }
    
    return codes;
}

export const STICKER_CODES = generateStickerCodes();
export const TOTAL_STICKERS = STICKER_CODES.length;

export function getStickerCategory(code) {
    if (code === "00" || code.startsWith("FWC")) {
        return ["Especiales FWC", "Especiales FWC"];
    } else if (code.startsWith("CC")) {
        return ["Coca-Cola CC", "Coca-Cola"];
    } else {
        const teamCode = code.slice(0, 3);
        for (const [grp, teamsList] of Object.entries(GROUPS)) {
            if (teamsList.includes(teamCode)) {
                const teamDisplay = `${TEAM_NAMES[teamCode] || teamCode} (${teamCode})`;
                return [grp, teamDisplay];
            }
        }
    }
    return ["Otros", "Otros"];
}
