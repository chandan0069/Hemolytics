// ---------- LOAD DATA ----------
const rawData = localStorage.getItem("reportData");
let params = {};
let prediction = "No Data";

if (rawData) {
    const parsed = JSON.parse(rawData);
    params = parsed.parameters || {};
    prediction = parsed.prediction || "No Data";
} else {
    alert("Please make a prediction first to see dashboard analytics.");
    window.location.href = "/predict";
}

// Update UI text
document.getElementById("dash-prediction").innerText = prediction;
const keys = [
    "Hemoglobin", "Platelets", "White Blood Cells", "Red Blood Cells", "Hematocrit",
    "Mean Corpuscular Volume", "Glucose", "HbA1c", "BMI", "Heart Rate", "Troponin",
    "Cholesterol", "LDL Cholesterol", "ALT", "Creatinine", "C-reactive Protein"
];
keys.forEach(k => {
    const el = document.getElementById("param-" + k);
    if(el) el.innerText = params[k] || "-";
});

// ---------- CATEGORY VALUES ----------
const safeVal = (k) => parseFloat(params[k]) || 0;

const blood = [safeVal("Hemoglobin"), safeVal("Platelets"), safeVal("White Blood Cells")];
const rbc = [safeVal("Red Blood Cells"), safeVal("Hematocrit"), safeVal("Mean Corpuscular Volume")];
const metabolic = [safeVal("Glucose"), safeVal("HbA1c"), safeVal("BMI")];
const cardiac = [safeVal("Heart Rate"), safeVal("Troponin")];
const lipid = [safeVal("Cholesterol"), safeVal("LDL Cholesterol"), safeVal("HDL Cholesterol"), safeVal("ALT")];
const kidney = [safeVal("Creatinine"), safeVal("C-reactive Protein")];

// ---------- BLOOD ----------
new Chart(document.getElementById('bloodChart'), {
    type: "bar",
    data: {
        labels: ["Hemoglobin", "Platelets", "WBC"],
        datasets: [{ data: blood, backgroundColor: "#3b82f6" }]
    }
});

// ---------- RBC ----------
new Chart(document.getElementById('rbcChart'), {
    type: "bar",
    data: {
        labels: ["RBC", "HCT", "MCV"],
        datasets: [{ data: rbc, backgroundColor: "#60a5fa" }]
    }
});

// ---------- METABOLIC ----------
new Chart(document.getElementById('metabolicChart'), {
    type: "line",
    data: {
        labels: ["Glucose", "HbA1c", "BMI"],
        datasets: [{ data: metabolic, borderColor: "#38bdf8", tension: 0.4 }]
    }
});

// ---------- CARDIAC ----------
new Chart(document.getElementById('cardiacChart'), {
    type: "radar",
    data: {
        labels: ["Heart Rate", "Troponin"],
        datasets: [{ data: cardiac, backgroundColor: "rgba(59, 130, 246, 0.3)", borderColor: "#3b82f6" }]
    },
    options: { scales: { r: { min: 0, max: 1 } } }
});

// ---------- LIPID ----------
new Chart(document.getElementById('lipidChart'), {
    type: "bar",
    data: {
        labels: ["Cholesterol", "LDL", "HDL", "ALT"],
        datasets: [{ data: lipid, backgroundColor: "#818cf8" }]
    }
});

// ---------- KIDNEY ----------
new Chart(document.getElementById('kidneyChart'), {
    type: "doughnut",
    data: {
        labels: ["Creatinine", "CRP"],
        datasets: [{ data: kidney, backgroundColor: ["#3b82f6", "#93c5fd"] }]
    }
});
