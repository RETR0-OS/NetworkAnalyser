# SniffHound

SniffHound is a network analysis tool designed to capture network packets, analyze them for anomalies, and log the results. It uses machine learning models to detect various types of network attacks.

## Features

- **Packet Capture**: Captures network packets using the `scapy` library.
- **Anomaly Detection**: Uses a pre-trained machine learning model to detect anomalies in the captured network data.
- **Logging**: Logs detected anomalies to a file for further analysis.

## Requirements

- Python 3.x
- `scapy`
- `pandas`
- `numpy`
- `scikit-learn`

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/RETR0-OS/NetworkAnalyser.git
    cd NetworkAnalyser/SniffHound
    ```

2. Install the required Python packages:
    ```sh
    pip install -r requirements.txt
    ```

## Usage

1. **Start Packet Capture**: Run the `networkSniffer.py` script to start capturing network packets.
    ```sh
    python networkSniffer.py
    ```

2. **Stop Packet Capture**: Press `Ctrl+C` to stop the packet capture.

3. **Log Generation**: The captured data is saved to `captured_network_data.csv`, and a separate thread generates logs of detected anomalies.

## File Structure

- `networkSniffer.py`: Main script for capturing packets and detecting anomalies.
- `label_mapper.py`: Maps labels to human-readable attack names.
- `dataCleaner.py`: Cleans and preprocesses the captured data.
- `captureCleaner.py`: Additional data cleaning utilities.
- `captured_network_data.csv`: CSV file where captured network data is saved.
- `Logs/`: Directory where anomaly logs are stored.

## Configuration

- **Anomaly Mapping**: The `anolmaly_mapper` and `attack_category_mapper` functions in `networkSniffer.py` map numeric labels to human-readable attack names and categories.
- **Model and Scaler**: The pre-trained model and scaler are loaded from `sniffHound.dat`.

## Logging

Logs are saved in the `Logs` directory. If anomalies are detected, they are appended to `Logs/anomalies.txt`. If no anomalies are detected, the log file will contain "All ok".

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## Contact

For any questions or issues, please open an issue on GitHub.