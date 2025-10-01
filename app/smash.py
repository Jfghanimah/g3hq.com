import os
import csv
import hashlib
from .rating import new_rating


def get_color_for_name(name: str) -> str:
    """
    Generates a consistent, unique color for a name.
    Names starting with "CPU" are hardcoded to a neutral gray.
    """
    # Check if the name is for a CPU player
    if name.upper().startswith("CPU"):
        return "#9E9E9E"  # A neutral, medium gray for CPU players

    # For other players, generate a unique color from their name
    # Using HSL color space for more vibrant and readable colors
    hash_object = hashlib.md5(name.encode())
    # We use the integer value of the hash to get a hue value
    hue = int.from_bytes(hash_object.digest(), 'big') % 360
    
    saturation = 75  # Keep saturation high for vibrancy
    lightness = 60   # Keep lightness balanced for readability against a dark background
    
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


def add_player(name, character):
    """
    Adds a new player-character combination to the data file with default ratings.
    Returns a tuple (success: bool, message: str).
    """
    if not name or not character:
        return (False, "Error: Player name and character cannot be empty.")

    all_players = get_player_data()

    # Check for duplicates (case-insensitive)
    name = name.strip()
    character = character.strip()
    exists = any(p['Name'].lower() == name.lower() and p['Character'].lower() == character.lower() for p in all_players)
    if exists:
        return (False, f"Error: Player '{name}' with character '{character}' already exists.")

    new_player = {
        'Name': name, 'Character': character, 'Rating': 1500, 'Confidence': 350
    }
    all_players.append(new_player)
    write_player_data(all_players)
    
    return (True, f"Successfully added {name} ({character}) to the roster.")