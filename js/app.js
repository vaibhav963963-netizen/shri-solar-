/**
 * Shri Solar Services - Single Page Quotation Generator App
 */

// Helper: Format Number as Indian Rupees
function formatINR(amount) {
    if (isNaN(amount) || amount === null || amount === undefined) return "₹0";
    return "₹" + Number(amount).toLocaleString('en-IN', {
        maximumFractionDigits: 0
    });
}

function formatDate(dateString) {
    if (!dateString) return "";
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    try {
        const d = new Date(dateString);
        return isNaN(d.getTime()) ? dateString : d.toLocaleDateString('en-IN', options);
    } catch (e) {
        return dateString;
    }
}

// Initial Empty Customer State + Default 3kW Plan
let currentQuote = {
    quoteNo: "SS-" + Math.floor(100 + Math.random() * 900),
    date: new Date().toISOString().split('T')[0],
    validityDays: 30,
    preparedBy: "Shyam Gadakh",
    
    // Customer Details - Blank by default (No pre-filled customer data)
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    clientAddress: "",
    category: "Residential",
    
    // Package & Specs
    packageId: "3kw",
    packageName: "3 kW On-Grid Solar System",
    capacityKW: 3,
    panelBrand: "Waaree Group",
    panelType: "Bifacial Mono PERC (TopCon)",
    panelCount: 6,
    panelWattage: "579W+",
    panelWarranty: "12/30 Yrs (Prod/Perf)",
    
    inverterBrand: "Sungrow / Havells",
    inverterType: "On-Grid Smart Inverter",
    inverterCapacity: "3 - 5 kW",
    inverterCount: 1,
    inverterWarranty: "10 Years",
    
    cableSpec: "Havells / Polycab UV-Resistant 4/6 sq.mm DC & AC Solar Cable",
    structureSpec: "JSW / Tata Steel HDGI 12kg/kW, IS 2062 Structure (25 Yrs)",
    electricalSpec: "True Power / Tata HDGI Earthing (3 Pits) + LA-25 Lightning Arrester",
    servicesSpec: "Complete Installation, Free AMC, Monitoring & Net Metering Support",
    
    // Performance & Savings
    dailyGeneration: "12 - 14 Units/day",
    monthlyGeneration: "370 - 400 Units",
    yearlySavings: 30500,
    paybackPeriod: "4 - 5 Years",
    
    // Financials
    basePrice: 188246,
    gstRate: 8.90,
    gstAmount: 16754,
    totalGrossPrice: 205000,
    subsidyAmount: 78000,
    netPayable: 127000,
    
    // Milestones
    advancePct: 40,
    procurementPct: 40,
    installationPct: 10,
    commissioningPct: 10,
    
    specialNotes: "Central Govt. Subsidy under PM Surya Ghar Muft Bijli Yojana will be credited directly to consumer bank account via DBT post net-meter installation."
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // Set initial date in input
    const dateInput = document.getElementById('input_date');
    if (dateInput) {
        dateInput.value = currentQuote.date;
    }
    
    const quoteNoInput = document.getElementById('input_quoteNo');
    if (quoteNoInput) {
        quoteNoInput.value = currentQuote.quoteNo;
    }

    // Load initial 3kW plan specs
    applyPackage('3kw');
    
    // Bind all form input change listeners for instant live updates
    bindFormListeners();
});

// Apply a preset package instantly
function applyPackage(pkgId) {
    const pkg = window.SOLAR_PACKAGES[pkgId];
    if (!pkg) return;
    
    currentQuote.packageId = pkgId;
    currentQuote.packageName = pkg.name;
    currentQuote.capacityKW = pkg.capacityKW;
    
    // Panels
    currentQuote.panelBrand = pkg.panels.brand;
    currentQuote.panelType = pkg.panels.type;
    currentQuote.panelCount = pkg.panels.count;
    currentQuote.panelWattage = pkg.panels.wattage;
    currentQuote.panelWarranty = pkg.panels.warranty;
    
    // Inverter
    currentQuote.inverterBrand = pkg.inverter.brand;
    currentQuote.inverterType = pkg.inverter.type;
    currentQuote.inverterCapacity = pkg.inverter.capacity;
    currentQuote.inverterCount = pkg.inverter.count;
    currentQuote.inverterWarranty = pkg.inverter.warranty;
    
    // Other hardware
    currentQuote.cableSpec = `${pkg.cables.brand} ${pkg.cables.spec}`;
    currentQuote.structureSpec = `${pkg.structure.brand} ${pkg.structure.spec}`;
    currentQuote.electricalSpec = `${pkg.electrical.brand} ${pkg.electrical.spec}`;
    currentQuote.servicesSpec = pkg.services;
    
    // Savings
    currentQuote.dailyGeneration = pkg.generation.dailyUnits;
    currentQuote.monthlyGeneration = pkg.generation.monthlyUnits;
    currentQuote.yearlySavings = pkg.generation.yearlySavings;
    currentQuote.paybackPeriod = pkg.generation.paybackYears;
    
    // Financials
    currentQuote.basePrice = pkg.pricing.basePrice;
    currentQuote.gstRate = pkg.pricing.gstRate;
    currentQuote.gstAmount = pkg.pricing.gstAmount;
    currentQuote.totalGrossPrice = pkg.pricing.totalGrossPrice;
    currentQuote.subsidyAmount = pkg.pricing.subsidyAmount;
    currentQuote.netPayable = pkg.pricing.netPayable;
    
    // Update active pill UI styling
    document.querySelectorAll('.pkg-pill-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.pkg === pkgId);
    });
    
    // Sync Package State into the form inputs (without touching customer details)
    syncPackageStateToInputs();
    
    // Instant live preview update
    updatePreview();
}

// Bind Inputs for instant real-time sync
function bindFormListeners() {
    const inputs = [
        'quoteNo', 'date', 'validityDays', 'preparedBy',
        'clientName', 'clientPhone', 'clientEmail', 'clientAddress',
        'category',
        'packageName', 'capacityKW', 'panelBrand', 'panelCount', 'panelWattage', 'panelWarranty',
        'inverterBrand', 'inverterCapacity', 'inverterWarranty',
        'cableSpec', 'structureSpec', 'electricalSpec',
        'dailyGeneration', 'monthlyGeneration', 'yearlySavings', 'paybackPeriod',
        'basePrice', 'gstRate', 'totalGrossPrice', 'subsidyAmount',
        'specialNotes'
    ];
    
    inputs.forEach(id => {
        const el = document.getElementById('input_' + id);
        if (el) {
            const updateHandler = (e) => {
                let val = e.target.value;
                
                // Specific handlers for financial calculations
                if (id === 'basePrice' || id === 'gstRate') {
                    const base = parseFloat(document.getElementById('input_basePrice').value) || 0;
                    const rate = parseFloat(document.getElementById('input_gstRate').value) || 0;
                    const gst = Math.round(base * (rate / 100));
                    const gross = base + gst;
                    const sub = parseFloat(document.getElementById('input_subsidyAmount').value) || 0;
                    
                    currentQuote.basePrice = base;
                    currentQuote.gstRate = rate;
                    currentQuote.gstAmount = gst;
                    currentQuote.totalGrossPrice = gross;
                    currentQuote.subsidyAmount = sub;
                    currentQuote.netPayable = Math.max(0, gross - sub);
                    
                    const grossInput = document.getElementById('input_totalGrossPrice');
                    if (grossInput) grossInput.value = gross;
                } else if (id === 'totalGrossPrice') {
                    const gross = parseFloat(val) || 0;
                    const rate = parseFloat(document.getElementById('input_gstRate').value) || 8.9;
                    const base = Math.round(gross / (1 + (rate / 100)));
                    const gst = gross - base;
                    const sub = parseFloat(document.getElementById('input_subsidyAmount').value) || 0;
                    
                    currentQuote.totalGrossPrice = gross;
                    currentQuote.basePrice = base;
                    currentQuote.gstAmount = gst;
                    currentQuote.subsidyAmount = sub;
                    currentQuote.netPayable = Math.max(0, gross - sub);
                    
                    const baseInput = document.getElementById('input_basePrice');
                    if (baseInput) baseInput.value = base;
                } else if (id === 'subsidyAmount') {
                    const sub = parseFloat(val) || 0;
                    const gross = parseFloat(document.getElementById('input_totalGrossPrice').value) || 0;
                    currentQuote.subsidyAmount = sub;
                    currentQuote.netPayable = Math.max(0, gross - sub);
                } else {
                    currentQuote[id] = val;
                }
                
                // Immediate preview render
                updatePreview();
            };

            el.addEventListener('input', updateHandler);
            el.addEventListener('change', updateHandler);
            el.addEventListener('keyup', updateHandler);
        }
    });
}

// Sync package fields to the inputs (leaves customer info alone)
function syncPackageStateToInputs() {
    const packageKeys = [
        'packageName', 'capacityKW', 'panelBrand', 'panelCount', 'panelWattage', 'panelWarranty',
        'inverterBrand', 'inverterCapacity', 'inverterWarranty',
        'cableSpec', 'structureSpec', 'electricalSpec',
        'dailyGeneration', 'monthlyGeneration', 'yearlySavings', 'paybackPeriod',
        'basePrice', 'gstRate', 'totalGrossPrice', 'subsidyAmount'
    ];
    packageKeys.forEach(key => {
        const el = document.getElementById('input_' + key);
        if (el) {
            el.value = currentQuote[key];
        }
    });
}

// Update the live HTML Quotation preview instantly
function updatePreview() {
    // Client Info
    const quoteNoEl = document.getElementById('pv_quoteNo');
    if (quoteNoEl) quoteNoEl.innerText = currentQuote.quoteNo || "SS-540";

    const dateEl = document.getElementById('pv_date');
    if (dateEl) dateEl.innerText = formatDate(currentQuote.date);
    
    const validDate = new Date(currentQuote.date || new Date());
    validDate.setDate(validDate.getDate() + (parseInt(currentQuote.validityDays) || 30));
    const validDateEl = document.getElementById('pv_validDate');
    if (validDateEl) validDateEl.innerText = formatDate(validDate.toISOString().split('T')[0]);
    
    // Customer Info Displays (Blank if user hasn't typed anything yet)
    const clientNameEl = document.getElementById('pv_clientName');
    if (clientNameEl) {
        clientNameEl.innerText = currentQuote.clientName && currentQuote.clientName.trim() !== "" 
            ? currentQuote.clientName 
            : "— (Enter Customer Name)";
    }

    const clientPhoneEl = document.getElementById('pv_clientPhone');
    if (clientPhoneEl) {
        clientPhoneEl.innerText = currentQuote.clientPhone && currentQuote.clientPhone.trim() !== "" 
            ? currentQuote.clientPhone 
            : "—";
    }

    const clientAddressEl = document.getElementById('pv_clientAddress');
    if (clientAddressEl) {
        clientAddressEl.innerText = currentQuote.clientAddress && currentQuote.clientAddress.trim() !== "" 
            ? currentQuote.clientAddress 
            : "—";
    }

    const categoryEl = document.getElementById('pv_category');
    if (categoryEl) categoryEl.innerText = currentQuote.category || "Residential";

    const preparedByEl = document.getElementById('pv_preparedBy');
    if (preparedByEl) preparedByEl.innerText = currentQuote.preparedBy || "Shyam Gadakh";
    
    // System Specifications
    const pkgNameEl = document.getElementById('pv_packageName');
    if (pkgNameEl) pkgNameEl.innerText = currentQuote.packageName;

    const capacityEl = document.getElementById('pv_capacity');
    if (capacityEl) capacityEl.innerText = currentQuote.capacityKW + " kW";
    
    // Table Details
    const panelDetailsEl = document.getElementById('pv_panelDetails');
    if (panelDetailsEl) {
        panelDetailsEl.innerHTML = `<strong>${currentQuote.panelBrand}</strong> - ${currentQuote.panelType} (${currentQuote.panelCount} panels x ${currentQuote.panelWattage})`;
    }

    const panelWarrantyEl = document.getElementById('pv_panelWarranty');
    if (panelWarrantyEl) panelWarrantyEl.innerText = currentQuote.panelWarranty;
    
    const inverterDetailsEl = document.getElementById('pv_inverterDetails');
    if (inverterDetailsEl) {
        inverterDetailsEl.innerHTML = `<strong>${currentQuote.inverterBrand}</strong> - ${currentQuote.inverterCapacity} ${currentQuote.inverterType}`;
    }

    const inverterWarrantyEl = document.getElementById('pv_inverterWarranty');
    if (inverterWarrantyEl) inverterWarrantyEl.innerText = currentQuote.inverterWarranty;
    
    const structureDetailsEl = document.getElementById('pv_structureDetails');
    if (structureDetailsEl) structureDetailsEl.innerText = currentQuote.structureSpec;

    const cableDetailsEl = document.getElementById('pv_cableDetails');
    if (cableDetailsEl) cableDetailsEl.innerText = currentQuote.cableSpec;

    const electricalDetailsEl = document.getElementById('pv_electricalDetails');
    if (electricalDetailsEl) electricalDetailsEl.innerText = currentQuote.electricalSpec;

    const servicesDetailsEl = document.getElementById('pv_servicesDetails');
    if (servicesDetailsEl) servicesDetailsEl.innerText = currentQuote.servicesSpec;
    
    // Generation & Savings
    const dailyGenEl = document.getElementById('pv_dailyGen');
    if (dailyGenEl) dailyGenEl.innerText = currentQuote.dailyGeneration;

    const monthlyGenEl = document.getElementById('pv_monthlyGen');
    if (monthlyGenEl) monthlyGenEl.innerText = currentQuote.monthlyGeneration;

    const yearlySavingsEl = document.getElementById('pv_yearlySavings');
    if (yearlySavingsEl) yearlySavingsEl.innerText = formatINR(currentQuote.yearlySavings) + "/year";

    const paybackEl = document.getElementById('pv_payback');
    if (paybackEl) paybackEl.innerText = currentQuote.paybackPeriod;
    
    // Financials
    const basePriceEl = document.getElementById('pv_basePrice');
    if (basePriceEl) basePriceEl.innerText = formatINR(currentQuote.basePrice);

    const gstLabelEl = document.getElementById('pv_gstLabel');
    if (gstLabelEl) gstLabelEl.innerText = `GST Amount (${currentQuote.gstRate}%)`;

    const gstAmountEl = document.getElementById('pv_gstAmount');
    if (gstAmountEl) gstAmountEl.innerText = formatINR(currentQuote.gstAmount);

    const totalGrossEl = document.getElementById('pv_totalGrossPrice');
    if (totalGrossEl) totalGrossEl.innerText = formatINR(currentQuote.totalGrossPrice);

    const subsidyAmountEl = document.getElementById('pv_subsidyAmount');
    if (subsidyAmountEl) subsidyAmountEl.innerText = "- " + formatINR(currentQuote.subsidyAmount);

    const netPayableEl = document.getElementById('pv_netPayable');
    if (netPayableEl) netPayableEl.innerText = formatINR(currentQuote.netPayable);
    
    // Notes
    const notesEl = document.getElementById('pv_specialNotes');
    if (notesEl) notesEl.innerText = currentQuote.specialNotes;
}

// Download PDF using html2pdf
function downloadPDF() {
    const element = document.getElementById('quotationDocument');
    const clientSanitized = (currentQuote.clientName || 'Quotation').trim().replace(/[^a-zA-Z0-9]/g, '_') || 'Quotation';
    const filename = `Shri_Solar_Quotation_${clientSanitized}_${currentQuote.capacityKW}kW.pdf`;
    
    const opt = {
        margin: [8, 8, 8, 8],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // Show download indicator
    const btn = document.getElementById('btnDownloadPDF');
    const originalText = btn.innerHTML;
    btn.innerHTML = `<svg class="animate-spin h-4 w-4 mr-2 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generating PDF...`;
    
    html2pdf().set(opt).from(element).save().then(() => {
        btn.innerHTML = originalText;
    }).catch(err => {
        console.error("PDF generation error:", err);
        btn.innerHTML = originalText;
        // Fallback to print
        window.print();
    });
}

// Print Quotation
function printQuotation() {
    window.print();
}

// Share on WhatsApp
function shareWhatsApp() {
    const client = currentQuote.clientName && currentQuote.clientName.trim() !== "" ? currentQuote.clientName : "Customer";
    const capacity = currentQuote.capacityKW + " kW";
    const gross = formatINR(currentQuote.totalGrossPrice);
    const subsidy = formatINR(currentQuote.subsidyAmount);
    const net = formatINR(currentQuote.netPayable);
    const phone = currentQuote.clientPhone ? currentQuote.clientPhone.replace(/[^0-9]/g, '') : '';
    
    const text = `*☀️ SHRI SOLAR SERVICES - SOLAR QUOTATION*%0A%0A` +
        `Dear *${client}*,%0A` +
        `Thank you for contacting Shri Solar Sales & Services.%0A%0A` +
        `📋 *System Proposal:* ${currentQuote.packageName}%0A` +
        `⚡ *Capacity:* ${capacity}%0A` +
        `💰 *Total Gross Cost (incl. GST):* ${gross}%0A` +
        `🎁 *Govt. Subsidy (PM Surya Ghar):* ${subsidy}%0A` +
        `🟢 *Net Effective Investment:* ${net}%0A` +
        `⚡ *Est. Monthly Generation:* ${currentQuote.monthlyGeneration}%0A` +
        `💵 *Est. Yearly Savings:* ${formatINR(currentQuote.yearlySavings)}/yr%0A%0A` +
        `📞 For full details & site survey, contact: +91 9325868092 / 8830562035%0A` +
        `📍 Khandala Road, Chikhli, Dist. Buldhana`;
        
    const waUrl = phone.length >= 10 
        ? `https://wa.me/91${phone.slice(-10)}?text=${text}`
        : `https://wa.me/?text=${text}`;
        
    window.open(waUrl, '_blank');
}

// Reset / New Quote
function newQuotation() {
    currentQuote.quoteNo = "SS-" + Math.floor(100 + Math.random() * 900);
    currentQuote.clientName = "";
    currentQuote.clientPhone = "";
    currentQuote.clientEmail = "";
    currentQuote.clientAddress = "";
    
    const nameInput = document.getElementById('input_clientName');
    if (nameInput) nameInput.value = "";
    const phoneInput = document.getElementById('input_clientPhone');
    if (phoneInput) phoneInput.value = "";
    const addrInput = document.getElementById('input_clientAddress');
    if (addrInput) addrInput.value = "";
    const quoteNoInput = document.getElementById('input_quoteNo');
    if (quoteNoInput) quoteNoInput.value = currentQuote.quoteNo;

    applyPackage('3kw');
}
