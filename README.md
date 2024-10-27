# SniffHound

SniffHound is a network analysis tool designed to capture network packets, analyze them for anomalies, and log the results. It uses machine learning models to detect various types of network attacks.
Even though SniffHound is designed to log vulnerabilities, it can be coupled with Network Protocol Mangers, and Intrusion Detection Systems to provide a truly robust network security framework. SniffHound can prevent not only against bad actors online, but also against intra-network attacks such as ARP spoofing, MITM, and Deauthentication attacks. The script is meant to ne installed on routers to monitor all data packets flowing through the network; however, it can also be run locally by clients to safeguard personal PCs. Sniffhound can currently monitor and scan TCP, UDP, and ICMP packets. It can cater to HTTP, Private, DNS, SMTP, FTP, TELNET, FINGER, and a few other protocols and services.

## Features
- **92% Accuracy**: The currently trained pipline provides 92% accuracy in anomaly and threat detection.
- **Packet Capture**: Captures network packets using the `scapy` library.
- **Anomaly Detection**: Uses a pre-trained machine learning model to detect anomalies in the captured network data.
- **Logging**: Logs detected anomalies to a file for further analysis.

## Requirements

- `NpCap`
- `Python 3.x`
- `scapy`
- `pandas`
- `numpy`
- `scikit-learn`
- `tensorflow`

## Installation

1. Download NpCap:
   Visit ```https://npcap.com/#download``` and install NpCap by Nmap.
   ```NOTE: be sure to tick the WinPcap API-compatible option while installing.``` 

2. Clone the repository:
    ```sh
    git clone https://github.com/RETR0-OS/NetworkAnalyser.git
    cd NetworkAnalyser/SniffHound
    ```

3. Install the required Python packages:
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
- `captured_network_data.csv`: CSV file where captured network data is saved.
- `Logs/`: Directory where anomaly logs are stored.
- `sniffHound.dat`: Trained ANN pipeline to detect anomalies.
- `Dataset/`: Directory containing the datasets used to train and test the pipeline. 

## Configuration

- **Anomaly Mapping**: The `anolmaly_mapper` and `attack_category_mapper` functions in `networkSniffer.py` map numeric labels to human-readable attack names and categories.
- **Model and Scaler**: The pre-trained model and scaler are loaded from `sniffHound.dat`.

## Logging

Logs are saved in the `Logs` directory. If anomalies are detected, they are appended to `Logs/anomalies.txt`. If no anomalies are detected, the log file will contain "All ok".

## Inspiration
SniffHound is developed to address issue of rising cases of cyber security threats against small-scale low-budget systems. Low-budget systems do not possess the resources to safeguard themselves against advanced modern cyber threats. The users of such systems are also not technically trained to safeguard systems against online and intra-network cyber attacks. Hence, we came up with the idea of SniffHound. While it cannot actively prevent cyber attacks in its current form, SniffHound can easily be integrated with Network Monitor Tools, and Network Protocols to prevent malacious requests from going theough. 

## How We Built It
SniffHound was built using Python and several key libraries:  
- scapy: For capturing and analyzing network packets.
- pandas: For data manipulation and analysis.
- numpy: For numerical operations.
- scikit-learn: For machine learning model training and anomaly detection.
We trained a machine learning model to detect network anomalies using a dataset of network traffic. The model and scaler are saved in sniffHound.dat and loaded during runtime to analyze captured network data. Storing the model and scaler as pipelines in a dat file saves  valuable space and computation time. The tool logs detected anomalies for further analysis and can be integrated with other network security tools to enhance protection.

## Challenges We Ran Into
- Our orignal project was (an track) was not this. We had spent 26th October, 2024 in developing another project that was eventually recalled over IP issues.
- We had a serious shortage of time and motivation after our orignal project was scrapped.
- The first challenge was to clean the dataset and identify key parameters relevant to anomaly detection.
- Next, we had to figure out a way to encode the string parameters into numerics for easy processing. 
- We could not figure out how to capture real time data from the network and filter it to mark different type of packets.
- Once we managed to capture the real time data, were facing issues in transforming it into a way that can be analysed by our neural network.
- After the Neural Network issue was resolved, we had problems in implmenting email service for logging purpose. We eventually scrapped that idea and went with standard CSV logging due to lack of time.

## Accomplishments We Are Proud Of
- 92% accuracy in anomaly detection.
- Custom ANN.
- Capable of catering to 3 types of packets along with over 10 types of services.
- Integrated a third party app (NpCap) for packet sniffing over the network.
- Developed the entire project in less than 12 hours.

## What we learned
- Implementation of ANNs
- Data processing
- Exporting models
- Basics of Intrusion Detection
- Different types of protocols (TCP, UDP, ICMP)
- Different types of Cyber Attacks
  
## What's next for SniffHound: Network Security Monitor
- Expand the range of services covered
- Improve the accuracy of the model
- Integrate it with a Network Monitor that can forward normal requests and drop harmful one to prevent network compromization.
- Implement IP and MAC logging to detect point of origination of malicious requests
- Send logs over SMTP or FTP to external server to prevent loss of data in case of a breach.

## Acknowledgments

- Dataset credit: ```https://www.kaggle.com/datasets/hassan06/nslkdd``` 

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## Contact

For any questions or issues, please open an issue on GitHub.
