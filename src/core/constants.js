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
    // Generales (FWC1 - FWC30)
    for (let i = 1; i <= 30; i++) {
        codes.push(`FWC${i}`);
    }
    
    // 48 Equipos x 19 figuritas
    for (const team of TEAMS) {
        for (let i = 1; i <= 19; i++) {
            codes.push(`${team}${i}`);
        }
    }
    
    // Leyendas (hasta llegar a 980)
    const currentLen = codes.length; // 30 + 912 = 942
    const remaining = 980 - currentLen;
    for (let i = 1; i <= remaining; i++) {
        codes.push(`LEG${i}`);
    }
    
    return codes;
}

export const STICKER_CODES = generateStickerCodes();
export const TOTAL_STICKERS = STICKER_CODES.length;

export function getStickerCategory(code) {
    if (code.startsWith("FWC")) {
        return ["Especiales FWC", "Inicio / FWC"];
    } else if (code.startsWith("LEG")) {
        return ["Leyendas LEG", "Leyendas"];
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
