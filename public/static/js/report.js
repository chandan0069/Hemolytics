/*************************************************
 * HemoLytics – FINAL ROBUST REPORT LOGIC
 * (Handles all key mismatches automatically)
 *************************************************/

// ===================== LOAD RAW DATA =====================
const raw = localStorage.getItem("reportData");

if (!raw) {
    alert("Please predict disease first.");
    window.location.href = "/predict";
}

const reportData = JSON.parse(raw);
console.log("RAW reportData:", reportData);

// ===================== SMART KEY DETECTION =====================
const disease =
    reportData.prediction ||
    reportData.result ||
    reportData.predicted_disease ||
    reportData.disease ||
    "Unknown";

const parameters =
    reportData.parameters ||
    reportData.data ||
    reportData.inputs ||
    {};

// DEBUG
console.log("Resolved Disease:", disease);
console.log("Resolved Parameters:", parameters);

// ===================== USER INFO =====================
function saveUser() {
    const user = {
        name: document.getElementById("uName").value,
        age: document.getElementById("uAge").value,
        gender: document.getElementById("uGender").value
    };

    if (!user.name || !user.age || !user.gender) {
        alert("Please fill all details");
        return;
    }

    localStorage.setItem("userInfo", JSON.stringify(user));
    document.getElementById("userPopup").style.display = "none";
    loadUser();
}

function loadUser() {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (!user) return;

    document.getElementById("pName").innerText = user.name;
    document.getElementById("pAge").innerText = user.age;
    document.getElementById("pGender").innerText = user.gender;
}
loadUser();


// ===================== BLOOD KNOWLEDGE BASE (ADVANCED) =====================
const BLOOD_DATA = {

    Diabetes: {
        intro: {
            en: `
🩸 Diabetes Mellitus
Diabetes is a chronic metabolic disorder in which blood glucose levels
remain persistently high due to improper insulin action.
            `,
            hi: `
🩸डायबिटीज एक ऐसी बीमारी है जिसमें खून में शुगर की मात्रा ज्यादा हो जाती है।
यह तब होता है जब शरीर में इंसुलिन सही तरह से काम नहीं करता।
            `
        },
        reason: {
            en: `
🔬 Why this disease occurs
Elevated fasting blood glucose levels
Increased HbA1c indicating poor long-term sugar control
Insulin resistance or insufficient insulin production
Lifestyle factors such as obesity, stress, and sedentary habits
            `,
            hi: `
🔬 डायबिटीज क्यों होती है
ब्लड शुगर का ज्यादा होना
लंबे समय से शुगर कंट्रोल में न रहना
इंसुलिन का कम बनना या सही से काम न करना
मोटापा, तनाव और कम शारीरिक गतिविधि
            `
        },
        medical: {
            en: `
💊 Medical Recommendations
Daily blood glucose monitoring
Regular HbA1c testing every 3 months
Strict adherence to prescribed antidiabetic medication
Weight management and physical activity
Regular consultation with a doctor
            `,
            hi: `
💊 डॉक्टर की सलाह
रोज ब्लड शुगर की जांच करें
हर 3 महीने में HbA1c टेस्ट कराएं
डॉक्टर की बताई दवाएं नियमित लें
वजन कंट्रोल रखें और रोज हल्का व्यायाम करें
समय-समय पर डॉक्टर से सलाह लेते रहें
            `
        },
        diet: {
            en: `
🥗 Recommended Diet Plan
Avoid refined sugar, sweets, bakery items, and cold drinks
Prefer whole grains, green vegetables, pulses, and salads
Include high-fiber foods
Eat small, frequent, balanced meals
Maintain proper hydration
            `,
            hi: `
🥗 खाने की सलाह
मीठा, कोल्ड ड्रिंक और जंक फूड से बचें
दाल, सब्ज़ी, सलाद और साबुत अनाज खाएं
फाइबर वाला खाना ज्यादा लें
थोड़ी-थोड़ी मात्रा में समय पर खाना खाएं
दिन भर पर्याप्त पानी पिएं
            `
        }
    },

    Anemia: {
        intro: {
            en: `
🩸Anemia is a condition where hemoglobin level is low,
leading to weakness and tiredness.
            `,
            hi: `
🩸एनीमिया में खून की कमी हो जाती है।
इससे कमजोरी और थकान महसूस होती है।
            `
        },
        reason: {
            en: `
🔬 Why this disease occurs
Low hemoglobin level
Low red blood cell count
Iron or vitamin deficiency
Poor nutrition or blood loss
            `,
            hi: `
🔬 एनीमिया क्यों होता है
हीमोग्लोबिन का कम होना
लाल रक्त कणों की कमी
आयरन या विटामिन की कमी
सही पोषण न मिलना या खून की कमी
            `
        },
        medical: {
            en: `
💊 Medical Recommendations
Iron supplements if advised
Regular blood tests
Treat the underlying cause
Follow doctor's advice
            `,
            hi: `
💊 डॉक्टर की सलाह
डॉक्टर की सलाह से आयरन की दवा लें
समय-समय पर खून की जांच कराएं
एनीमिया की वजह का इलाज कराएं
डॉक्टर के संपर्क में रहें
            `
        },
        diet: {
            en: `
🥗 Recommended Diet Plan
Spinach, beetroot, and pulses
Dates, jaggery, and raisins
Vitamin C rich fruits
Protein rich foods
            `,
            hi: `
🥗 खाने की सलाह
पालक, चुकंदर और दालें खाएं
खजूर, गुड़ और किशमिश लें
संतरा और नींबू जैसे फल खाएं
प्रोटीन वाला खाना जरूर लें
            `
        }
    },

    Thalasse: {
        intro: {
            en: `
🧬 Thalassemia is a genetic blood disorder present from birth.
            `,
            hi: `
🧬 थैलेसीमिया जन्म से होने वाली खून की बीमारी है।
            `
        },
        reason: {
            en: `
🔬 Why this disease occurs
Inherited from parents
Hemoglobin is not formed properly
            `,
            hi: `
🔬 थैलेसीमिया क्यों होता है
यह माता-पिता से मिलने वाली बीमारी है
खून में हीमोग्लोबिन सही नहीं बनता
            `
        },
        medical: {
            en: `
💊 Medical Recommendations
Regular blood checkups
Doctor consultation
Blood transfusion in severe cases
            `,
            hi: `
💊 डॉक्टर की सलाह
नियमित खून की जांच जरूरी है
डॉक्टर से इलाज कराएं
गंभीर हालत में खून चढ़ाना पड़ सकता है
            `
        },
        diet: {
            en: `
🥗 Recommended Diet Plan
Balanced diet
Avoid excess iron unless prescribed
Drink enough water
            `,
            hi: `
🥗 खाने की सलाह
संतुलित और पौष्टिक खाना खाएं
बिना डॉक्टर की सलाह आयरन न लें
खूब पानी पिएं
            `
        }
    },

    Thromboc: {
        intro: {
            en: `
🧫 Low Platelet Count
Platelet count is low which can cause bleeding problems.
            `,
            hi: `
🧫 प्लेटलेट की कमी
इसमें प्लेटलेट कम हो जाते हैं जिससे खून बह सकता है।
            `
        },
        reason: {
            en: `
🔬 Why this disease occurs
Platelets are destroyed
Viral infections
Medicine side effects
            `,
            hi: `
🔬 यह समस्या क्यों होती है
प्लेटलेट जल्दी खत्म हो जाते हैं
वायरल बीमारी के कारण
कुछ दवाइयों के असर से
            `
        },
        medical: {
            en: `
💊 Medical Recommendations
Regular platelet check
Avoid injuries
Consult doctor immediately if bleeding occurs
            `,
            hi: `
💊 डॉक्टर की सलाह
प्लेटलेट की जांच करते रहें
चोट लगने से बचें
खून बहने पर तुरंत डॉक्टर को दिखाएं
            `
        },
        diet: {
            en: `
🥗 Recommended Diet Plan
Papaya and citrus fruits
Light food
Plenty of fluids
            `,
            hi: `
🥗 खाने की सलाह
पपीता और संतरा खाएं
हल्का खाना लें
पानी और तरल चीजें ज्यादा लें
            `
        }
    },

    Healthy: {
        intro: {
            en: `
✅ Healthy Report
All blood values are normal.
            `,
            hi: `
✅ स्वस्थ रिपोर्ट
आपकी सभी खून की जांच सामान्य है।
            `
        },
        reason: {
            en: `
🔬 Why this result
All parameters are within normal range
            `,
            hi: `
🔬 यह रिपोर्ट क्यों आई
सभी जरूरी जांच सामान्य हैं
            `
        },
        medical: {
            en: `
💊 Medical Recommendations
No medicine required
Continue regular checkups
            `,
            hi: `
💊 डॉक्टर की सलाह
कोई दवा जरूरी नहीं
समय-समय पर जांच कराते रहें
            `
        },
        diet: {
            en: `
🥗 Recommended Diet Plan
Balanced diet
Drink enough water
Stay active
            `,
            hi: `
🥗 खाने की सलाह
संतुलित खाना खाएं
खूब पानी पिएं
थोड़ा बहुत रोज चलें
            `
        }
    }

};

// ===================== LANGUAGE STATE =====================
function getCurrentLang() {
    return document.getElementById("langSelect")?.value || "en";
}

// ===================== LOAD REPORT =====================
window.onload = () => {

    const lang = getCurrentLang();

    document.getElementById("diseaseName").innerText = disease;

    const info = BLOOD_DATA[disease];

    if (info) {
        document.getElementById("diseaseIntro").innerText =
            info.intro[lang] + "\n\n" + info.reason[lang];

        document.getElementById("medicalReco").innerText =
            info.medical[lang];

        document.getElementById("dietChart").innerText =
            info.diet[lang];
    } else {
        document.getElementById("diseaseIntro").innerText =
            "Disease information not available.";
        document.getElementById("medicalReco").innerText = "-";
        document.getElementById("dietChart").innerText = "-";
    }

    // PARAMETERS
    const list = document.getElementById("parameterList");
    list.innerHTML = "";

    if (Object.keys(parameters).length === 0) {
        list.innerHTML = "<li>No parameters available</li>";
    } else {
        Object.entries(parameters).forEach(([key, value]) => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${key}</strong>: ${value}`;
            list.appendChild(li);
        });
    }
};

// ===================== AI DOCTOR VOICE =====================
function speakReport() {
    const lang = document.getElementById("langSelect").value;
    const user = JSON.parse(localStorage.getItem("userInfo")) || { name: "Patient" };
    const info = BLOOD_DATA[disease];

    if (!info) {
        alert("Disease information not available");
        return;
    }

    const text = lang === "hi"
        ? `
नमस्ते ${user.name}।
आपको ${disease} रोग पाया गया है।

${info.intro.hi}

${info.reason.hi}

चिकित्सकीय सलाह:
${info.medical.hi}

आहार संबंधी सलाह:
${info.diet.hi}

कृपया अंतिम पुष्टि के लिए डॉक्टर से अवश्य परामर्श लें।
        `
        : `
Hello ${user.name}.
The predicted disease is ${disease}.

${info.intro.en}

${info.reason.en}

Medical recommendations:
${info.medical.en}

Dietary advice:
${info.diet.en}

Please consult a qualified doctor for confirmation.
        `;

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = lang === "hi" ? "hi-IN" : "en-IN";
    speech.rate = 0.9;

    speechSynthesis.cancel();
    speechSynthesis.speak(speech);
}

function cleanText(text) {
    if (!text) return "";
    return text
        .replace(/[*•🩸💊🥗🔬✅🧬🧫]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

// ===================== PDF =====================
async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "mm", "a4");

    // PDF ALWAYS ENGLISH
    const lang = "en";

    const user = JSON.parse(localStorage.getItem("userInfo")) || {
        name: "Patient",
        age: "--",
        gender: "--"
    };

    const info = BLOOD_DATA[disease];
    const params = parameters || {};

    /* ================= COLORS ================= */
    const RED = [59, 130, 246];
    const BLACK = [20, 20, 20];
    const GREY = [120, 120, 120];

    /* ================= LOAD HEADER IMAGE ================= */
    async function loadImage(url) {
        const res = await fetch(url);
        const blob = await res.blob();
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    }

    // 🔹 LEFT HEADER IMAGE (NOT BACKGROUND)
    const headerImg = await loadImage("/static/images/thromboc.png");

    let y = 20;

    /* ================= HEADER ================= */
    doc.addImage(headerImg, "PNG", 15, 10, 30, 30);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(...RED);
    doc.text("HemoLytics Medical Report", 55, 20);

    doc.setFontSize(10);
    doc.setTextColor(...GREY);
    doc.text("AI Based Blood Disease Diagnostic Report", 55, 27);

    doc.setDrawColor(...RED);
    doc.setLineWidth(1);
    doc.line(15, 45, 195, 45);

    y = 55;

    /* ================= PATIENT INFO ================= */
    doc.setFontSize(12);
    doc.setTextColor(...BLACK);
    doc.text("Patient Information", 15, y);

    y += 8;
    doc.setFontSize(11);
    doc.text(`Name: ${user.name}`, 15, y);
    doc.text(`Age: ${user.age}`, 90, y);
    doc.text(`Gender: ${user.gender}`, 150, y);

    /* ================= DISEASE ================= */
    y += 12;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...RED);
    doc.text("Predicted Disease", 15, y);

    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...BLACK);
    doc.text(disease, 15, y);

    y += 8;
    doc.text(
        cleanText(info.intro.en),
        15,
        y,
        { maxWidth: 180 }
    );

    /* ================= CLINICAL EXPLANATION ================= */
    y += 20;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...RED);
    doc.text("Clinical Explanation", 15, y);

    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...BLACK);
    doc.text(
        cleanText(info.reason.en),
        15,
        y,
        { maxWidth: 180 }
    );

    /* ================= PARAMETERS ================= */
    y += 22;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...RED);
    doc.text("Observed Blood Parameters", 15, y);

    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...BLACK);

    Object.entries(params).forEach(([key, value]) => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        doc.text(`- ${key}: ${value}`, 18, y);
        y += 6;
    });

    /* ================= MEDICAL ================= */
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...RED);
    doc.text("Medical Recommendations", 15, y);

    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...BLACK);
    doc.text(
        cleanText(info.medical.en),
        15,
        y,
        { maxWidth: 180 }
    );

    /* ================= DIET ================= */
    y += 22;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...RED);
    doc.text("Dietary Recommendations", 15, y);

    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...BLACK);
    doc.text(
        cleanText(info.diet.en),
        15,
        y,
        { maxWidth: 180 }
    );

    /* ================= FOOTER ================= */
    doc.setFontSize(9);
    doc.setTextColor(...GREY);
    doc.text(
        "Disclaimer: This report is generated by an AI system for screening purposes only. Please consult a certified doctor.",
        105,
        290,
        { align: "center", maxWidth: 180 }
    );

    doc.save(`HemoLytics_Medical_Report_${user.name}.pdf`);
}



document.getElementById("langSelect")?.addEventListener("change", () => {

    const lang = getCurrentLang();
    const info = BLOOD_DATA[disease];

    if (!info) return;

    document.getElementById("diseaseIntro").innerText =
        info.intro[lang] + "\n\n" + info.reason[lang];

    document.getElementById("medicalReco").innerText =
        info.medical[lang];

    document.getElementById("dietChart").innerText =
        info.diet[lang];
});
