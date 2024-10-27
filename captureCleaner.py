import pandas as pd

def clean_data(file_path):
    data = pd.DataFrame(pd.read_csv(file_path))
    label_mapping = {
        'normal': 0,
        'neptune': 1,
        'warezclient': 2,
        'ipsweep': 3,
        'portsweep': 4,
        'teardrop': 5,
        'nmap': 6,
        'satan': 7,
        'smurf': 8,
        'pod': 9,
        'back': 10,
        'guess_passwd': 11,
        'ftp_write': 12,
        'multihop': 13,
        'rootkit': 14,
        'buffer_overflow': 15,
        'imap': 16,
        'warezmaster': 17,
        'phf': 18,
        'land': 19,
        'loadmodule': 20,
        'spy': 21,
        'perl': 22
    }

    # Define attack categories
    attack_mapping = {
        'normal': 'normal',
        'neptune': 'DoS',
        'warezclient': 'R2L',
        'ipsweep': 'Probe',
        'portsweep': 'Probe',
        'teardrop': 'DoS',
        'nmap': 'Probe',
        'satan': 'Probe',
        'smurf': 'DoS',
        'pod': 'DoS',
        'back': 'DoS',
        'guess_passwd': 'R2L',
        'ftp_write': 'R2L',
        'multihop': 'R2L',
        'rootkit': 'U2R',
        'buffer_overflow': 'U2R',
        'imap': 'R2L',
        'warezmaster': 'R2L',
        'phf': 'R2L',
        'land': 'DoS',
        'loadmodule': 'U2R',
        'spy': 'R2L',
        'perl': 'U2R'
    }

    # Map labels to categories
    data['attack_category'] = data['label'].map(attack_mapping)

    # Encode categories numerically
    category_encoding = {
        'normal': 0,
        'DoS': 1,
        'Probe': 2,
        'R2L': 3,
        'U2R': 4
    }

    data['attack_category_encoded'] = data['attack_category'].map(category_encoding)

    data['label_numeric'] = data['label'].map(label_mapping)

    data = data.drop(['label', 'attack_category'], axis=1)
    data['protocol_type'] = data['protocol_type'].map({'tcp': 0, 'udp': 1, 'icmp': 2})

    service_mapping = {
        "http": 0,
        "private": 1,
        "domain_u": 2,
        "smtp": 3,
        "ftp_data": 4,
        "eco_i": 5,
        "other": 6,
        "ecr_i": 7,
        "telnet": 8,
        "finger": 9,
        "ftp": 10,
    }

    data["service"] = data["service"].map(service_mapping)

    flag_mapping = {
        "SF": 0,
        "S0": 1,
        "REJ": 2,
        "RSTR": 3,
        "RSTO": 4,
        "SH": 5,
        "S1": 6,
        "S2": 7,
        "RSTOS0": 8,
        "S3": 9,
        "OTH": 10,
    }

    data["flag"] = data["flag"].map(flag_mapping)
    data = data.dropna()
    return data