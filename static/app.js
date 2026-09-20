document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('prediction-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.querySelector('.btn-text');
    const loader = document.getElementById('btn-loader');
    
    const placeholder = document.getElementById('result-placeholder');
    const resultContent = document.getElementById('result-content');
    
    const riskBadge = document.getElementById('risk-badge');
    const valProb = document.getElementById('val-prob');
    const valThresh = document.getElementById('val-thresh');
    const meterFill = document.getElementById('meter-fill');
    const meterMarker = document.getElementById('meter-marker');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // UI Loading State
        btnText.classList.add('hidden');
        loader.classList.remove('hidden');
        submitBtn.disabled = true;

        // Collect Form Data
        const formData = new FormData(form);
        const data = {
            person_age: parseInt(formData.get('person_age')),
            person_income: parseFloat(formData.get('person_income')),
            person_home_ownership: formData.get('person_home_ownership'),
            person_emp_length: parseFloat(formData.get('person_emp_length')),
            loan_intent: formData.get('loan_intent'),
            loan_grade: formData.get('loan_grade'),
            loan_amnt: parseFloat(formData.get('loan_amnt')),
            loan_int_rate: parseFloat(formData.get('loan_int_rate')),
            loan_percent_income: parseFloat(formData.get('loan_percent_income')),
            cb_person_default_on_file: formData.get('cb_person_default_on_file'),
            cb_person_cred_hist_length: parseInt(formData.get('cb_person_cred_hist_length'))
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            
            // Expected keys from Python: default_probability, threshold, Result
            displayResults(result);

        } catch (error) {
            console.error('Error fetching prediction:', error);
            alert('Failed to get prediction from the server. Check if the FastAPI backend is running.');
        } finally {
            // Revert UI Loading State
            btnText.classList.remove('hidden');
            loader.classList.add('hidden');
            submitBtn.disabled = false;
        }
    });

    function displayResults(data) {
        // Hide placeholder, show content
        placeholder.classList.add('hidden');
        resultContent.classList.remove('hidden');

        // Extract values
        const prob = data.default_probability;
        const thresh = data.threshold;
        const isHighRisk = data.Result === "High Risk";

        // Update Text
        valProb.textContent = (prob * 100).toFixed(2) + '%';
        valThresh.textContent = (thresh * 100).toFixed(2) + '%';

        // Update Badge
        riskBadge.textContent = data.Result;
        if (isHighRisk) {
            riskBadge.className = 'risk-badge risk-high';
        } else {
            riskBadge.className = 'risk-badge risk-low';
        }

        // Animate Meter
        // Set threshold marker position
        meterMarker.style.left = (thresh * 100) + '%';
        
        // Timeout to allow DOM update before animating width for transition
        setTimeout(() => {
            meterFill.style.width = (prob * 100) + '%';
            
            // Change fill color depending on risk
            if (isHighRisk) {
                meterFill.style.background = 'linear-gradient(to right, #f59e0b, #ef4444)';
            } else {
                meterFill.style.background = 'linear-gradient(to right, #10b981, #34d399)';
            }
        }, 50);
    }
});
