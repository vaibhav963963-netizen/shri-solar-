// Preset solar packages definition
const COMPANY_INFO = {
    name: "Shri Solar Sales and Services",
    nameMarathi: "श्री सोलर सेल्स आणि सर्व्हिसेस",
    tagline: "BRIGHT SOLUTIONS. SUSTAINABLE FUTURE.",
    phones: ["9325868092", "8830562035"],
    email: "gadakhshyam@gmail.com",
    website: "www.shrisolar.com",
    address: "Khandala Road, Chikhli, Dist. Buldhana, Maharashtra - 443201",
    subOffice: "Gat No 14 near Painganga College, Yelgaon, Maharashtra 415111",
    logoPath: "assets/logo.jpg"
};

const SOLAR_PACKAGES = {
    "3kw": {
        id: "3kw",
        name: "3 kW On-Grid Solar System",
        shortTitle: "3 kW On-Grid",
        capacityKW: 3,
        panels: {
            brand: "Waaree Group",
            type: "Bifacial Mono PERC / TopCon",
            count: 6,
            wattage: "579W+",
            warranty: "12 Yrs Product / 30 Yrs Performance"
        },
        inverter: {
            brand: "Sungrow / Havells",
            type: "Grid-Tied Smart Inverter",
            capacity: "3 - 5 kW",
            count: 1,
            warranty: "10 Years"
        },
        cables: {
            brand: "Havells / Polycab",
            spec: "UV-Resistant, Double Insulated 4/6 sq.mm DC & 10 sq.mm AC",
            warranty: "8 Years"
        },
        structure: {
            brand: "JSW Steel / Tata Steel",
            spec: "Hot Dip Galvanized (HDGI), 12 kg/kW, IS 2062",
            warranty: "25 Years"
        },
        electrical: {
            brand: "True Power / Tata Power",
            spec: "HDGI Chemical Earthing (3 Pits), LA-25 Lightning Arrester, ACDB/DCDB with SPD"
        },
        services: "End-to-end Installation, Free AMC & Monitoring, Net Metering Liaisoning",
        generation: {
            dailyUnits: "12 - 14 Units/day",
            monthlyUnits: "370 - 400 Units",
            yearlySavings: 30500,
            lifetimeSavingsLakhs: 9,
            paybackYears: "4 - 5 Years"
        },
        pricing: {
            basePrice: 188246,
            gstRate: 8.90,
            gstAmount: 16754,
            totalGrossPrice: 205000,
            subsidyAmount: 78000,
            netPayable: 127000
        }
    },
    "5kw": {
        id: "5kw",
        name: "5 kW On-Grid Solar System",
        shortTitle: "5 kW On-Grid",
        capacityKW: 5,
        panels: {
            brand: "Waaree Group",
            type: "Bifacial Mono PERC / TopCon",
            count: 9,
            wattage: "579W+",
            warranty: "12 Yrs Product / 30 Yrs Performance"
        },
        inverter: {
            brand: "Sungrow / Havells",
            type: "Grid-Tied Smart Inverter",
            capacity: "5 kW (Dual MPPT)",
            count: 1,
            warranty: "10 Years"
        },
        cables: {
            brand: "Havells / Polycab",
            spec: "UV-Resistant, Double Insulated 4/6 sq.mm DC & 10 sq.mm AC",
            warranty: "8 Years"
        },
        structure: {
            brand: "JSW Steel / Tata Steel",
            spec: "Hot Dip Galvanized (HDGI), 12 kg/kW, IS 2062",
            warranty: "25 Years"
        },
        electrical: {
            brand: "True Power / Tata Power",
            spec: "HDGI Chemical Earthing (3 Pits), LA-25 Lightning Arrester, ACDB/DCDB with SPD"
        },
        services: "End-to-end Installation, Free AMC & Monitoring, Net Metering Liaisoning",
        generation: {
            dailyUnits: "20 - 22 Units/day",
            monthlyUnits: "600 - 650 Units",
            yearlySavings: 55000,
            lifetimeSavingsLakhs: 14,
            paybackYears: "4 - 4.5 Years"
        },
        pricing: {
            basePrice: 280073,
            gstRate: 8.90,
            gstAmount: 24927,
            totalGrossPrice: 305000,
            subsidyAmount: 78000,
            netPayable: 227000
        }
    },
    "6kw": {
        id: "6kw",
        name: "6 kW On-Grid Solar System",
        shortTitle: "6 kW On-Grid",
        capacityKW: 6,
        panels: {
            brand: "Waaree Group",
            type: "Bifacial Mono PERC / TopCon",
            count: 11,
            wattage: "579W+",
            warranty: "12 Yrs Product / 30 Yrs Performance"
        },
        inverter: {
            brand: "Sungrow / Havells",
            type: "Grid-Tied Smart Inverter",
            capacity: "6 kW (Dual MPPT)",
            count: 1,
            warranty: "10 Years"
        },
        cables: {
            brand: "Havells / Polycab",
            spec: "UV-Resistant, Double Insulated 4/6 sq.mm DC & 10 sq.mm AC",
            warranty: "8 Years"
        },
        structure: {
            brand: "JSW Steel / Tata Steel",
            spec: "Hot Dip Galvanized (HDGI), 12 kg/kW, IS 2062",
            warranty: "25 Years"
        },
        electrical: {
            brand: "True Power / Tata Power",
            spec: "HDGI Chemical Earthing (3 Pits), LA-25 Lightning Arrester, ACDB/DCDB with SPD"
        },
        services: "End-to-end Installation, Free AMC & Monitoring, Net Metering Liaisoning",
        generation: {
            dailyUnits: "24 - 27 Units/day",
            monthlyUnits: "750 - 800 Units",
            yearlySavings: 60800,
            lifetimeSavingsLakhs: 17,
            paybackYears: "4.5 Years"
        },
        pricing: {
            basePrice: 321396,
            gstRate: 8.90,
            gstAmount: 28604,
            totalGrossPrice: 350000,
            subsidyAmount: 78000,
            netPayable: 272000
        }
    }
};

window.COMPANY_INFO = COMPANY_INFO;
window.SOLAR_PACKAGES = SOLAR_PACKAGES;
