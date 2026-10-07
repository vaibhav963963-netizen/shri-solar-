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

    // Trigger mobile scaling check
    updateMobileScale();
});

// Dismiss preloader smoothly once everything is loaded
window.addEventListener('load', () => {
    setTimeout(() => {
        const preloader = document.getElementById('appPreloader');
        if (preloader) {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
        updateMobileScale();
    }, 700);
});

// Auto-scale quotation sheet on mobile screens so it fits without horizontal cutting
function updateMobileScale() {
    const sheet = document.getElementById('quotationDocument');
    const outer = document.querySelector('.preview-sheet-outer');
    if (!sheet || !outer) return;
    
    if (window.innerWidth <= 860) {
        const availableWidth = window.innerWidth - 24; // responsive margin
        const sheetWidth = 794; // 210mm in standard 96dpi pixels
        const scale = Math.min(1, availableWidth / sheetWidth);
        sheet.style.transform = `scale(${scale})`;
        sheet.style.transformOrigin = 'top center';
        sheet.style.margin = '0';
        
        // Adjust outer container height to prevent excess whitespace
        const actualHeight = sheet.scrollHeight || sheet.offsetHeight || 1123;
        outer.style.height = `${(actualHeight * scale) + 20}px`;
    } else {
        sheet.style.transform = 'none';
        sheet.style.margin = '0 auto';
        outer.style.height = 'auto';
    }
}

window.addEventListener('resize', updateMobileScale);
window.addEventListener('orientationchange', () => {
    setTimeout(updateMobileScale, 200);
});

// Mobile Tab Switcher Handler
function switchMobileTab(tab) {
    const sidebar = document.getElementById('editorSidebar');
    const preview = document.getElementById('previewWorkspace');
    const btnEditor = document.getElementById('tabBtnEditor');
    const btnPreview = document.getElementById('tabBtnPreview');
    
    if (tab === 'editor') {
        if (sidebar) sidebar.classList.remove('mobile-hidden');
        if (preview) preview.classList.add('mobile-hidden');
        if (btnEditor) btnEditor.classList.add('active');
        if (btnPreview) btnPreview.classList.remove('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        if (sidebar) sidebar.classList.add('mobile-hidden');
        if (preview) preview.classList.remove('mobile-hidden');
        if (btnEditor) btnEditor.classList.remove('active');
        if (btnPreview) btnPreview.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Recalculate scale when preview tab opens
        setTimeout(updateMobileScale, 50);
    }
}

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

    // Recalibrate mobile scaling if needed
    updateMobileScale();
}

// Helper: Generate crisp A4 PDF Blob without canvas taint or viewport issues
async function generatePDFBlob() {
    const source = document.getElementById('quotationDocument');
    if (!source) throw new Error("Document not found");

    // Clone element and ensure all images use safe Base64
    const clone = source.cloneNode(true);
    const images = clone.querySelectorAll('img');
    images.forEach(img => {
        if (window.SHRI_SOLAR_LOGO_BASE64) {
            img.src = window.SHRI_SOLAR_LOGO_BASE64;
        }
    });

    // Reset styles on clone for pure 1:1 unscaled A4 capture
    clone.style.transform = 'none';
    clone.style.boxShadow = 'none';
    clone.style.margin = '0';
    clone.style.width = '794px';
    clone.style.minWidth = '794px';
    clone.style.maxWidth = '794px';
    clone.style.minHeight = '1123px';
    clone.style.background = '#ffffff';

    // Temporary top-level staging container positioned at 0,0 so mobile viewport doesn't crop it
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '0';
    container.style.top = '0';
    container.style.width = '794px';
    container.style.minHeight = '1123px';
    container.style.background = '#ffffff';
    container.style.zIndex = '999999';
    container.style.overflow = 'visible';
    container.style.pointerEvents = 'none';
    container.style.opacity = '1';
    container.appendChild(clone);
    document.body.appendChild(container);

    const opt = {
        margin: [0, 0, 0, 0],
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
            letterRendering: true,
            width: 794,
            windowWidth: 794,
            scrollX: 0,
            scrollY: 0,
            x: 0,
            y: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
        if (typeof html2pdf === 'undefined') {
            throw new Error("html2pdf library is not loaded");
        }
        const pdfBlob = await html2pdf().set(opt).from(clone).output('blob');
        return pdfBlob;
    } finally {
        if (document.body.contains(container)) {
            document.body.removeChild(container);
        }
    }
}

// 1. Direct PDF Download (Direct file save, NO print dialog)
async function downloadPDF() {
    const btns = document.querySelectorAll('.btn-download-pdf-action');
    btns.forEach(btn => {
        btn.disabled = true;
        btn.dataset.oldText = btn.innerHTML;
        btn.innerHTML = `<svg class="animate-spin h-4 w-4 mr-1.5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Downloading...`;
    });

    try {
        const clientSanitized = (currentQuote.clientName || 'Quotation').trim().replace(/[^a-zA-Z0-9]/g, '_') || 'Quotation';
        const filename = `Shri_Solar_Quotation_${clientSanitized}_${currentQuote.capacityKW}kW.pdf`;

        const pdfBlob = await generatePDFBlob();
        
        // Trigger browser direct download
        const blobUrl = URL.createObjectURL(pdfBlob);
        const downloadAnchor = document.createElement('a');
        downloadAnchor.href = blobUrl;
        downloadAnchor.download = filename;
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        document.body.removeChild(downloadAnchor);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
    } catch (err) {
        console.error("Direct PDF download error:", err);
        alert("Direct download error. Opening print preview as alternative.");
        window.print();
    } finally {
        btns.forEach(btn => {
            btn.disabled = false;
            if (btn.dataset.oldText) btn.innerHTML = btn.dataset.oldText;
        });
    }
}

// 2. Direct PDF File Share (Web Share API to WhatsApp / Apps with attached PDF)
async function sharePDFDirect() {
    const shareBtns = document.querySelectorAll('.btn-share-pdf-action');
    shareBtns.forEach(btn => {
        btn.disabled = true;
        btn.dataset.oldText = btn.innerHTML;
        btn.innerHTML = `<svg class="animate-spin h-4 w-4 mr-1.5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Sharing...`;
    });

    try {
        const clientSanitized = (currentQuote.clientName || 'Customer').trim().replace(/[^a-zA-Z0-9]/g, '_') || 'Customer';
        const filename = `Shri_Solar_Quotation_${clientSanitized}_${currentQuote.capacityKW}kW.pdf`;
        const pdfBlob = await generatePDFBlob();
        const pdfFile = new File([pdfBlob], filename, { type: 'application/pdf' });

        if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
            await navigator.share({
                files: [pdfFile],
                title: `Solar Quotation - ${currentQuote.clientName || 'Customer'}`,
                text: `☀️ Shri Solar Services Quotation for ${currentQuote.packageName}`
            });
        } else {
            // Fallback for browsers that don't support file sharing: download PDF and open WhatsApp message
            downloadPDF();
            shareWhatsApp();
        }
    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error("Direct share error:", err);
            downloadPDF();
            shareWhatsApp();
        }
    } finally {
        shareBtns.forEach(btn => {
            btn.disabled = false;
            if (btn.dataset.oldText) btn.innerHTML = btn.dataset.oldText;
        });
    }
}

// 3. Print Quotation (Dedicated Print Button)
function printQuotation() {
    window.print();
}

// 4. Share Text Summary on WhatsApp
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

// 5. Reset / New Quote
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

