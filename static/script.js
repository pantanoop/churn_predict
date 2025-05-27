document.addEventListener("DOMContentLoaded", () => {
  const showFormBtn = document.getElementById("show-form-btn");
  const dynamicContent = document.getElementById("dynamic-content");
  const statusDiv = document.getElementById("prediction-status");

  const formHTML = `
      <form id="prediction-form" class="form-section slide-in">
        <label>Senior Citizen (0 = No, 1 = Yes):</label>
        <input type="number" name="SeniorCitizen" min="0" max="1" required />
  
        <label>Partner:</label>
        <select name="Partner" required>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
  
        <label>Dependents:</label>
        <select name="Dependents" required>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
  
        <label>Tenure (in months):</label>
        <input type="number" name="tenure" required />
  
        <label>Phone Service:</label>
        <select name="PhoneService" required>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
  
        <label>Multiple Lines:</label>
        <select name="MultipleLines" required>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
          <option value="No phone service">No phone service</option>
        </select>
  
        <label>Internet Service:</label>
        <select name="InternetService" required>
          <option value="DSL">DSL</option>
          <option value="Fiber optic">Fiber optic</option>
          <option value="No">No</option>
        </select>
  
        <label>Online Security:</label>
        <select name="OnlineSecurity" required>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
          <option value="No internet service">No internet service</option>
        </select>
  
        <label>Online Backup:</label>
        <select name="OnlineBackup" required>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
          <option value="No internet service">No internet service</option>
        </select>
  
        <label>Device Protection:</label>
        <select name="DeviceProtection" required>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
          <option value="No internet service">No internet service</option>
        </select>
  
        <label>Tech Support:</label>
        <select name="TechSupport" required>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
          <option value="No internet service">No internet service</option>
        </select>
  
        <label>Streaming TV:</label>
        <select name="StreamingTV" required>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
          <option value="No internet service">No internet service</option>
        </select>
  
        <label>Streaming Movies:</label>
        <select name="StreamingMovies" required>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
          <option value="No internet service">No internet service</option>
        </select>
  
        <label>Contract:</label>
        <select name="Contract" required>
          <option value="Month-to-month">Month-to-month</option>
          <option value="One year">One year</option>
          <option value="Two year">Two year</option>
        </select>
  
        <label>Monthly Charges:</label>
        <input type="number" step="0.01" name="MonthlyCharges" required />
  
        <label>Total Charges:</label>
        <input type="number" step="0.01" name="TotalCharges" required />
  
        <button type="submit">Predict</button>
      </form>
    `;

  let loaded = false;

  showFormBtn.addEventListener("click", () => {
    loaded = !loaded;

    dynamicContent.innerHTML = loaded
      ? formHTML
      : `<p class="placeholder-text">Click "Start Prediction" to load the form.</p>`;

    showFormBtn.textContent = loaded
      ? "❌ Hide Prediction"
      : "📝 Start Prediction";

    const form = document.getElementById("prediction-form");

    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        statusDiv.innerHTML = `<p class="loading">🔄 Predicting... Please wait.</p>`;

        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
          data[key] = value;
        });

        try {
          const response = await fetch("/predict", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Requested-With": "XMLHttpRequest",
            },
            body: JSON.stringify(data),
          });

          const result = await response.json();
          if (result.result) {
            const isChurn = result.result.toLowerCase().includes("churn");

            statusDiv.innerHTML = `
              <p class="result ${isChurn ? "churn" : "not-churn"}">
                 <strong>Result:</strong> ${result.result}
              </p>`;
          } else {
            throw new Error(result.error || "Unknown error");
          }
        } catch (err) {
          statusDiv.innerHTML = `<p class="error">❌ ${err.message}</p>`;
        }
      });
    }
  });
});
