from flask import Flask, render_template, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

# Load model and preprocessing tools
model = joblib.load('logistic_model.pkl')
scaler = joblib.load('scaler.pkl')
label_encoders = joblib.load('label_encoders.pkl')

@app.route('/')
def home():
    return render_template('index.html')
@app.route('/about')
def about():
    return render_template('aboutproject.html')
@app.route('/analysis')
def analysis():
    return render_template('analysis.html')

from sklearn.metrics import classification_report

@app.route('/classification_report')
def classification_report_view():
    # Example data — replace with your real test labels & predictions
    y_true = [0, 1, 1, 0, 1]
    y_pred = [0, 1, 0, 0, 1]
    # Generate the classification report
    report = classification_report(y_true, y_pred)
    return render_template('report.html', report=report)


@app.route('/predict', methods=['POST'])
def predict():
    try:
        input_data = request.get_json()  # now getting JSON via AJAX
        df = pd.DataFrame([input_data])

        # Normalize column names
        df.columns = df.columns.str.lower()

        # Lowercase encoder keys to match
        label_encoders_lower = {k.lower(): v for k, v in label_encoders.items()}

        # Encode categorical features
        for col in label_encoders_lower:
            if col in df.columns:
                le = label_encoders_lower[col]
                known_classes = set(le.classes_)

                # Handle unseen labels
                df[col] = df[col].apply(lambda x: x if x in known_classes else 'unknown')
                df[col] = le.transform(df[col])
            else:
                print(f"⚠️ Warning: Column '{col}' not found in input data.")

        # Scale numeric data
        df_scaled = scaler.transform(df)

        # Predict
        prediction = model.predict(df_scaled)
        result = 'Customer Will Churn' if prediction[0] == 1 else 'Customer Will Not Churn'

        return jsonify({"result": result})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
