
import moment from "moment-timezone";



export const labels = [
    { name: "datum", text: "Datum", filterType: 'date'  },
    { name: "wagen", text: "Wagen", filterType: 'checkbox' },
    { name: "werk", text: "Werk", filterType: 'checkbox' },
    { name: "cbm", text: "Cbm", filterType: 'range' },
    { name: "abfahrt", text: "Abfahrt", filterType: 'checkbox'  },
    { name: "kmAbfahrt", text: "Km Stand bei Abfahrt", filterType: 'range'  },
    { name: "ankunft", text: "Ankunft", filterType: 'range'  },
    { name: "kmAnkunft", text: "Km Stand bei Ankunft", filterType: 'range'  },
    { name: "lieferscheinNr", text: "Lieferschein Nr.", filterType: 'checkbox'  },
    { name: "fahrer", text: "Fahrer", filterType: 'checkbox'  },
    { name: "baustelle", text: "Baustelle", filterType: 'checkbox'  },
    { name: "entladeBeginn", text: "EntladeBeginn", filterType: 'range'  },
    { name: "entladeEnde", text: "EntladeEnde", filterType: 'range'  },
    { name: "entladeTyp", text: "EntladeTyp", filterType: 'checkbox'  },
    { name: "wartezeit", text: "Wartezeit", filterType: 'range'  },
    { name: "sonstiges", text: "Sonstiges", filterType: 'none' }
]

export default [
    {   
        "id" : 1,
        "datum" : moment().format("DD.MM.YYYY"),
        "wagen" : 702,
        "werk" : "Paparidis Kostas Paparidis  Kostas Paparidis ",
        "cbm" : 7.5,
        "abfahrt" : 8,
        "kmAbfahrt" : 250,
        "ankunft" : 18,
        "kmAnkunft" : 1210.80,
        "lieferscheinNr" : 188888188,
        "fahrer" : "Uwe Schwille",
        "baustelle" : "Verfuss Hemere",
        "entladeBeginn" : 85.35,
        "entladeEnde" : 85.45,
        "entladeTyp" : "Rutschee",
        "wartezeit" : 155,
        "sonstiges" : "Rohr kaputte"

    },
    {
        "id" : 2,
        "datum" : moment().format("DD.MM.YYYY"),
        "wagen" : 703,
        "werk" : "Meine Rutsche ist kaputt",
        "cbm" : 7.55,
        "abfahrt" : 7,
        "kmAbfahrt" : 120,
        "ankunft" : 8,
        "kmAnkunft" : 120.80,
        "lieferscheinNr" : 18888888,
        "fahrer" : "Dimitrios Tsafas",
        "baustelle" : "Verfuss Hemer",
        "entladeBeginn" : 8.35,
        "entladeEnde" : 8.45,
        "entladeTyp" : "Rutsche",
        "wartezeit" : 15,
        "sonstiges" : "Rohr kaputt"

    },
    {
        "id" : 3,
        "datum" : moment().format("DD.MM.YYYY"),
        "wagen" : 703,
        "werk" : "Meine ",
        "cbm" : 7.55,
        "abfahrt" : 7,
        "kmAbfahrt" : 120,
        "ankunft" : 8,
        "kmAnkunft" : 120.80,
        "lieferscheinNr" : 18888888,
        "fahrer" : "Uwe Schwill",
        "baustelle" : "Verfuss Hemer",
        "entladeBeginn" : 8.35,
        "entladeEnde" : 8.45,
        "entladeTyp" : "Rutsche",
        "wartezeit" : 15,
        "sonstiges" : "Rohr kaputt"

    },
    {
        "id" : 4,
        "datum" : moment().format("DD.MM.YYYY"),
        "wagen" : 703,
        "werk" : "Meine ",
        "cbm" : 7.55,
        "abfahrt" : 7,
        "kmAbfahrt" : 120,
        "ankunft" : 8,
        "kmAnkunft" : 120.80,
        "lieferscheinNr" : 18888888,
        "fahrer" : "Uwe Schwill",
        "baustelle" : "Verfuss Hemer",
        "entladeBeginn" : 8.35,
        "entladeEnde" : 8.45,
        "entladeTyp" : "Rutsche",
        "wartezeit" : 15,
        "sonstiges" : "Rohr kaputt"

    },
    {
        "id" : 7,
        "datum" : moment().format("DD.MM.YYYY"),
        "wagen" : 703,
        "werk" : "Meine ",
        "cbm" : 7.55,
        "abfahrt" : 7,
        "kmAbfahrt" : 120,
        "ankunft" : 8,
        "kmAnkunft" : 120.80,
        "lieferscheinNr" : 18888888,
        "fahrer" : "Uwe Schwill",
        "baustelle" : "Verfuss Hemer",
        "entladeBeginn" : 8.35,
        "entladeEnde" : 8.45,
        "entladeTyp" : "Rutsche",
        "wartezeit" : 15,
        "sonstiges" : "Rohr kaputt"

    },
    {
        "id" : 6,
        "datum" : moment().format("DD.MM.YYYY"),
        "wagen" : 703,
        "werk" : "Meine ",
        "cbm" : 7.55,
        "abfahrt" : 7,
        "kmAbfahrt" : 120,
        "ankunft" : 8,
        "kmAnkunft" : 120.80,
        "lieferscheinNr" : 18888888,
        "fahrer" : "Uwe Schwill",
        "baustelle" : "Verfuss Hemer",
        "entladeBeginn" : 8.35,
        "entladeEnde" : 8.45,
        "entladeTyp" : "Rutsche",
        "wartezeit" : 15,
        "sonstiges" : "Rohr kaputt"

    },
    {
        "id" : 9,
        "datum" : moment().format("DD.MM.YYYY"),
        "wagen" : 703,
        "werk" : "Meine ",
        "cbm" : 7.55,
        "abfahrt" : 7,
        "kmAbfahrt" : 120,
        "ankunft" : 8,
        "kmAnkunft" : 120.80,
        "lieferscheinNr" : 18888888,
        "fahrer" : "Uwe Schwill",
        "baustelle" : "Verfuss Hemer",
        "entladeBeginn" : 8.35,
        "entladeEnde" : 8.45,
        "entladeTyp" : "Rutsche",
        "wartezeit" : 15,
        "sonstiges" : "Rohr kaputt"

    },
    {
        "id" : 10,
        "datum" : moment().format("DD.MM.YYYY"),
        "wagen" : 703,
        "werk" : "Meine ",
        "cbm" : 7.55,
        "abfahrt" : 7,
        "kmAbfahrt" : 120,
        "ankunft" : 8,
        "kmAnkunft" : 120.80,
        "lieferscheinNr" : 18888888,
        "fahrer" : "Uwe Schwill",
        "baustelle" : "Verfuss Hemer",
        "entladeBeginn" : 8.35,
        "entladeEnde" : 8.45,
        "entladeTyp" : "Rutsche",
        "wartezeit" : 15,
        "sonstiges" : "Rohr kaputt"

    }
        
]