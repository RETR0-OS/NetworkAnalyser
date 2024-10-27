import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.utils import to_categorical
import pickle

def train_nn(X_train, y_train):
    # Feature scaling
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)

    # Ensure labels are within the correct range
    num_classes = len(np.unique(y_train))
    y_train = np.where(y_train >= num_classes, num_classes - 1, y_train)
    y_train_cat = to_categorical(y_train, num_classes)

    # Define the model
    model = Sequential([
        Dense(128, activation='relu', input_shape=(X_train.shape[1],)),
        Dropout(0.2),
        Dense(64, activation='relu'),
        Dropout(0.2),
        Dense(32, activation='relu'),
        Dense(num_classes, activation='softmax')
    ])

    # Compile the model
    model.compile(optimizer=Adam(learning_rate=0.001),
                  loss='categorical_crossentropy',
                  metrics=['accuracy'])

    # Train the model
    model.fit(X_train_scaled, y_train_cat,
              epochs=50, batch_size=32,
              validation_split=0.2, verbose=1)

    return model, scaler

def evaluate_classifier(model, scaler, X_test, y_test):
    # Feature scaling
    X_test_scaled = scaler.transform(X_test)

    # Make predictions
    y_pred_proba = model.predict(X_test_scaled)
    y_pred = np.argmax(y_pred_proba, axis=1)

    # Evaluate the classifier
    print(classification_report(y_test, y_pred))

# Load and prepare data
data = pd.read_csv('Dataset/train_data_cleaned.csv')
X_train = data.drop('label_numeric', axis=1)
y_train = data['label_numeric']

# Train the neural network
trained_model, scaler = train_nn(X_train, y_train)

# Load and prepare test data
test_data = pd.read_csv('Dataset/test_data_cleaned.csv')
X_test = test_data.drop('label_numeric', axis=1)
y_test = test_data['label_numeric']

with open("sniffHound.dat", "wb") as f:
    pickle.dump((trained_model, scaler), f)
# Evaluate the model
evaluate_classifier(trained_model, scaler, X_test, y_test)