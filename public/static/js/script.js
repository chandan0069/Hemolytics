/*************************************************
 * HemoLytics – Prediction Page Script (FINAL)
 * This file:
 * 1) Sends data to Flask API
 * 2) Shows popup result
 * 3) SAVES DATA for report page (IMPORTANT)
 *************************************************/

// ================= DISEASE → IMAGE MAP =================
const DISEASE_IMAGES = {
    "Anemia": "/static/images/anemia.png",
    "Diabetes": "/static/images/diabetes.png",
    "Healthy": "/static/images/healthy.png",
    "Thalasse": "/static/images/thalasse.png",
    "Thromboc": "/static/images/thromboc.png"
};

const VALID_CLASSES = Object.keys(DISEASE_IMAGES);

// ================= DEPLOYMENT CONFIGURATION =================
// When deploying, change the PRODUCTION_API_URL to your deployed backend URL.
const PRODUCTION_API_URL = "https://your-fastapi-backend.onrender.com";
const API_BASE_URL = window.location.hostname === "localhost" ? "http://localhost:8000" : PRODUCTION_API_URL;

// ================= FORM SUBMIT =================
document.getElementById("predictForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const inputs = document.querySelectorAll("#predictForm input");
    let data = {};

    // collect inputs (auto-fill empty)
    inputs.forEach(input => {
        if (input.value === "") {
            input.value = (Math.random() * 0.9 + 0.05).toFixed(3);
        }
        data[input.name] = input.value;
    });

    fetch(`${API_BASE_URL}/predict_api`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(result => {

        const popup = document.getElementById("popup");
        const resultBox = document.getElementById("result");
        const imageBox = document.getElementById("diseaseImage");

        // ================= 🔥 MAIN FIX =================
        if (result.status === "success" && VALID_CLASSES.includes(result.prediction)) {

            // ✅ SAVE DATA FOR REPORT PAGE
            localStorage.setItem("reportData", JSON.stringify({
                prediction: result.prediction, // e.g. "Diabetes"
                parameters: data               // all form inputs
            }));

            console.log(
                "ReportData saved:",
                JSON.parse(localStorage.getItem("reportData"))
            );

            // UI update
            resultBox.innerHTML = `
                <i class="fa-solid fa-droplet" style="color: #0ea5e9;"></i> <span class="blood-text">${result.prediction}</span>
                <br><small>AI Detected Blood Condition</small>
            `;

            imageBox.src = DISEASE_IMAGES[result.prediction];
            imageBox.style.display = "block";

            popup.style.display = "block";
            
            // Show the hidden nav links
            const dLink = document.getElementById("nav-dashboard");
            const rLink = document.getElementById("nav-report");
            if(dLink) dLink.classList.remove("hidden-nav");
            if(rLink) rLink.classList.remove("hidden-nav");

        } else {
            resultBox.innerHTML = `
                <i class="fa-solid fa-triangle-exclamation" style="color: #ef4444;"></i> Prediction Error
                <br><small>Invalid model output</small>
            `;
            popup.style.display = "block";
        }
    })
    .catch(error => {
        console.error(error);
        alert("Server error. Please try again.");
    });
});

// ================= CLOSE POPUP =================
function closePopup() {
    document.getElementById("popup").style.display = "none";
}

// ================= DEMO MODE =================
function fillDemo() {
    document.querySelectorAll("#predictForm input").forEach(input => {
        input.value = (Math.random() * 0.9 + 0.05).toFixed(3);
    });
}

// ================= CLEAR FORM =================
function clearForm() {
    document.querySelectorAll("#predictForm input").forEach(input => {
        input.value = "";
    });
}
