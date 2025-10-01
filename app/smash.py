import os
import csv
import hashlib
from rating import new_rating

def get_color_for_name(name):
    """
    Generates a consistent, unique HSL color for a given name string
    using an MD5 hash to ensure the color is always the same for the same name.
    """
    # Create a hash of the name to get a consistent integer.
    hash_object = hashlib.md5(name.encode())
    hash_digest = hash_object.hexdigest()
    hash_int = int(hash_digest, 16)
    
    # Use the integer to generate a hue value (0-360)
    hue = hash_int % 360
    
    # Use fixed saturation and lightness for a consistent, pleasant color palette.
    saturation = 75 
    lightness = 40
    
    return f"hsl({hue}, {saturation}%, {lightness}%)"

def get_player_data():
    """Helper function to read and parse player data from the CSV."""
    players = []
    if not os.path.exists("elos.csv"):
        print("elos.csv not found.")
        return []
        
    try:
        with open("elos.csv", mode='r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                row['Rating'] = int(float(row['Rating']))
                row['Confidence'] = int(float(row['Confidence']))
                players.append(row)
    except Exception as e:
        print(f"An error occurred reading elos.csv: {e}")
    return players

def write_player_data(players):
    """Safely writes the list of player dicts back to the CSV."""
    temp_filepath = "elos.csv.tmp"
    final_filepath = "elos.csv"
    fieldnames = ['Name', 'Character', 'Rating', 'Confidence']
    
    try:
        with open(temp_filepath, mode='w', encoding='utf-8', newline='') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            
            data_to_write = []
            for player in players:
                filtered_player = {
                    'Name': player.get('Name'),
                    'Character': player.get('Character'),
                    'Rating': int(player.get('Rating')),
                    'Confidence': int(player.get('Confidence'))
                }
                data_to_write.append(filtered_player)

            writer.writerows(data_to_write)
        os.replace(temp_filepath, final_filepath)
    except Exception as e:
        print(f"An error occurred writing to {final_filepath}: {e}")
        if os.path.exists(temp_filepath):
            os.remove(temp_filepath)

def process_match_report(winner_str, loser_str):
    """
    Processes a match result, calculates new ratings, and updates the data file.
    Returns a tuple (success: bool, message: str).
    """
    if not winner_str or not loser_str or winner_str == loser_str:
        return (False, "Error: Invalid player selection.")

    try:
        winner_name, winner_char = winner_str.split('|')
        loser_name, loser_char = loser_str.split('|')
    except ValueError:
        return (False, "Error: Malformed player data submitted.")

    all_players = get_player_data()

    winner_obj = next((p for p in all_players if p['Name'] == winner_name and p['Character'] == winner_char), None)
    loser_obj = next((p for p in all_players if p['Name'] == loser_name and p['Character'] == loser_char), None)
    
    if not winner_obj or not loser_obj:
        return (False, "Error: Could not find one of the selected players in the data.")
    
    new_winner_stats = new_rating(winner_obj['Rating'], winner_obj['Confidence'], loser_obj['Rating'], loser_obj['Confidence'], 1) 
    new_loser_stats = new_rating(loser_obj['Rating'], loser_obj['Confidence'], winner_obj['Rating'], winner_obj['Confidence'], 0)

    winner_obj['Rating'] = new_winner_stats[0]
    winner_obj['Confidence'] = new_winner_stats[1]
    loser_obj['Rating'] = new_loser_stats[0]
    loser_obj['Confidence'] = new_loser_stats[1]

    write_player_data(all_players)
    
    return (True, "Match processed successfully.")