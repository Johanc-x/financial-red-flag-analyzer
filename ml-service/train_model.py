import pandas as pd
import joblib

from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report


DATA_PATH = "data/training_data.csv"
MODEL_PATH = "financial_analyzer_models.joblib"


def safe_divide(numerator, denominator, multiplier=1.0):
    if denominator == 0:
        return 0
    return numerator / denominator * multiplier


def add_financial_ratios(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    df["ebitda_margin"] = df.apply(
        lambda row: safe_divide(row["ebitda"], row["revenue"], 100), axis=1
    )
    df["debt_to_equity"] = df.apply(
        lambda row: safe_divide(row["debt"], row["equity"]), axis=1
    )
    df["cash_conversion"] = df.apply(
        lambda row: safe_divide(row["cash_flow"], row["ebitda"], 100), axis=1
    )
    df["cost_ratio"] = df.apply(
        lambda row: safe_divide(row["costs"], row["revenue"], 100), axis=1
    )
    df["cash_flow_margin"] = df.apply(
        lambda row: safe_divide(row["cash_flow"], row["revenue"], 100), axis=1
    )

    return df


def build_explanation_lookup(df: pd.DataFrame) -> dict:
    lookup = {}

    for explanation_type, group in df.groupby("explanation_type"):
        records = (
            group[["human_summary", "recommended_action"]]
            .drop_duplicates()
            .to_dict(orient="records")
        )
        lookup[explanation_type] = records

    return lookup


def main():
    df = pd.read_csv(DATA_PATH)
    df = add_financial_ratios(df)

    features = [
        "revenue",
        "costs",
        "ebitda",
        "cash_flow",
        "debt",
        "equity",
        "ebitda_margin",
        "debt_to_equity",
        "cash_conversion",
        "cost_ratio",
        "cash_flow_margin",
    ]

    X = df[features]
    y_risk = df["risk_level"]
    y_explanation = df["explanation_type"]

    X_train, X_test, y_risk_train, y_risk_test, y_exp_train, y_exp_test = train_test_split(
        X,
        y_risk,
        y_explanation,
        test_size=0.25,
        random_state=42,
        stratify=y_explanation,
    )

    risk_model = RandomForestClassifier(
        n_estimators=250,
        max_depth=8,
        random_state=42,
        class_weight="balanced",
    )

    explanation_model = GradientBoostingClassifier(
        n_estimators=180,
        learning_rate=0.06,
        max_depth=3,
        random_state=42,
    )

    risk_model.fit(X_train, y_risk_train)
    explanation_model.fit(X_train, y_exp_train)

    risk_predictions = risk_model.predict(X_test)
    explanation_predictions = explanation_model.predict(X_test)

    print("\n=== Risk Level Model ===")
    print(f"Accuracy: {accuracy_score(y_risk_test, risk_predictions):.4f}")
    print(classification_report(y_risk_test, risk_predictions))

    print("\n=== Explanation Type Model ===")
    print(f"Accuracy: {accuracy_score(y_exp_test, explanation_predictions):.4f}")
    print(classification_report(y_exp_test, explanation_predictions))

    model_bundle = {
        "risk_model": risk_model,
        "explanation_model": explanation_model,
        "features": features,
        "explanation_lookup": build_explanation_lookup(df),
    }

    joblib.dump(model_bundle, MODEL_PATH)
    print(f"\nModels saved successfully to: {MODEL_PATH}")


if __name__ == "__main__":
    main()
