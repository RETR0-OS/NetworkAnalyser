from scapy.all import *
from collections import defaultdict
import numpy as np
import pickle
import csv
import pandas as pd
import threading

# Dictionary to store packet statistics
packet_stats = defaultdict(lambda: defaultdict(int))

# Mapping dictionaries
protocol_mapping = {'tcp': 0, 'udp': 1, 'icmp': 2}
service_mapping = {
    "http": 0, "private": 1, "domain_u": 2, "smtp": 3, "ftp_data": 4,
    "eco_i": 5, "other": 6, "ecr_i": 7, "telnet": 8, "finger": 9, "ftp": 10
}
flag_mapping = {
    "SF": 0, "S0": 1, "REJ": 2, "RSTR": 3, "RSTO": 4, "SH": 5,
    "S1": 6, "S2": 7, "RSTOS0": 8, "S3": 9, "OTH": 10
}

try:
    def packet_callback(packet):
        if IP in packet and (TCP in packet or UDP in packet or ICMP in packet):
            src_ip = packet[IP].src
            dst_ip = packet[IP].dst

            # Update packet statistics
            stats = packet_stats[src_ip]
            stats['duration'] += packet.time - stats.get('start_time', packet.time)
            stats['start_time'] = packet.time
            stats['protocol_type'] = protocol_mapping.get(packet[IP].proto, 2)  # Default to ICMP if unknown
            stats['src_bytes'] += len(packet[IP])
            stats['dst_bytes'] += len(packet[IP].payload)
            stats['count'] += 1

            if TCP in packet:
                stats['service'] = service_mapping.get(packet[TCP].dport, 6)  # Default to "other" if unknown
                stats['flag'] = flag_mapping.get(packet[TCP].flags, 10)  # Default to "OTH" if unknown
                stats['srv_count'] += 1 if packet[TCP].dport == stats.get('last_service', None) else 0
                stats['last_service'] = packet[TCP].dport

    def save_to_csv(filename):
        with open(filename, 'w', newline='') as csvfile:
            fieldnames = ['duration', 'protocol_type', 'service', 'flag', 'src_bytes', 'dst_bytes',
                          'logged_in', 'num_compromised', 'root_shell', 'su_attempted', 'num_root',
                          'num_file_creations', 'num_shells', 'count', 'srv_count', 'serror_rate',
                          'srv_serror_rate', 'rerror_rate', 'srv_rerror_rate', 'same_srv_rate',
                          'diff_srv_rate', 'srv_diff_host_rate', 'dst_host_count', 'dst_host_srv_count',
                          'dst_host_same_srv_rate', 'dst_host_diff_srv_rate', 'dst_host_same_src_port_rate',
                          'dst_host_srv_diff_host_rate', 'dst_host_serror_rate', 'dst_host_srv_serror_rate',
                          'dst_host_rerror_rate', 'dst_host_srv_rerror_rate', 'attack_category_encoded']

            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()

            for ip, stats in packet_stats.items():
                row = {field: stats.get(field, 0) for field in fieldnames}
                writer.writerow(row)


    def anolmaly_mapper(label):
        attack_mapping = {
            0: 'normal',
            1: 'neptune',
            2: 'back',
            3: 'land',
            4: 'pod',
            5: 'smurf',
            6: 'teardrop',
            7: 'apache2',
            8: 'udpstorm',
            9: 'guess_passwd',
            10: 'ftp_write',
            11: 'imap',
            12: 'multihop',
            13: 'phf',
            14: 'rootkit',
            15: 'warezclient',
            16: 'warezmaster',
            17: 'xlock',
            18: 'xsnoop'
        }
        return attack_mapping[label]

    def attack_category_mapper(label):
        attack_mapping = {
            0: 'normal',
            1: 'DoS',
            2: 'R2L',
            3: 'Probe',
            4: 'U2R'
        }
        return attack_mapping[label]


    def generate_log(csv_file):
        with open("sniffHound.dat", "rb") as f:
            model, scaler = pickle.load(f)

        # Read the CSV file into a DataFrame
        data = pd.DataFrame(pd.read_csv(csv_file))

        # Ensure the correct number of features
        features = data.astype(float)

        # Transform the features
        features_scaled = scaler.transform(features)

        # Make predictions for all rows
        predictions = model.predict(features_scaled)

        anomalies = []
        for i, prediction in enumerate(predictions):
            if np.argmax(prediction) != 0:
                # Anomaly detected
                anomalies.append(
                    f"Anomaly detected in request {i}: {data.iloc[i].tolist()}\nAnomaly type: {np.argmax(prediction)}\n\n")

        # Ensure Logs directory exists
        os.makedirs("Logs", exist_ok=True)

        # Write anomalies to the log file
        with open("Logs/anomalies.txt", "a") as log:
            if anomalies:
                log.writelines(anomalies)
            else:
                log.write("All ok\n")

        print("Log generation complete.")



    while True:
        # Start packet capture
        print("Starting packet capture... Press Ctrl+C to stop.")
        sniff(prn=packet_callback, store=0, timeout=60)  # Capture for 60 seconds using default interface
        # Save captured data to CSV
        save_to_csv('captured_network_data.csv')
        print("Data saved to captured_network_data.csv")
        log_thread = threading.Thread(target=generate_log, args=('captured_network_data.csv',))
        log_thread.start()
        log_thread.join()
except KeyboardInterrupt:
    print("\nPacket capture stopped.")
    exit()