import os
import csv
import hashlib
from datetime import datetime
import pytz  # For timezone-aware daily reset
from .rating import new_rating

# Get the absolute path to the directory containing this script.
# This makes file paths independent of the current working directory,
# which is crucial when running with a WSGI server like Gunicorn.
_INITIAL_CONFIDENCE = 350
_BASE_DIR = os.path.dirname(os.path.abspath(__file__))
_ELO_CSV_PATH = os.path.join(_BASE_DIR, 'elos.csv')
_LAST_RESET_FILE = os.path.join(_BASE_DIR, 'last_reset_date.txt')

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
    hue = int.from_bytes(hash_object.digest(), 'big')*3 % 360
    
    saturation = 75  # Keep saturation high for vibrancy
    lightness = 60   # Keep lightness balanced for readability against a dark background
    
    return f"hsl({hue}, {saturation}%, {lightness}%)"


def check_and_reset_daily_changes():
    """
    Checks if the daily ELO changes need to be reset (e.g., once per day).
    Resets at 6 AM Central Time.
    """
    cst = pytz.timezone('America/Chicago')
    now_cst = datetime.now(cst)
    
    # We reset if it's a new day after 6 AM.
    reset_time_today = now_cst.replace(hour=6, minute=0, second=0, microsecond=0)

    last_reset_str = ""
    if os.path.exists(_LAST_RESET_FILE):
        with open(_LAST_RESET_FILE, 'r') as f:
            last_reset_str = f.read().strip()

    last_reset_date = None
    if last_reset_str:
        try:
            last_reset_date = datetime.fromisoformat(last_reset_str).astimezone(cst)
        except ValueError:
            last_reset_date = None # Handle malformed date string

    # Condition to reset:
    # 1. We've never reset before.
    # 2. The last reset was before today's 6 AM reset time, AND it's currently after 6 AM.
    if last_reset_date is None or (last_reset_date < reset_time_today and now_cst >= reset_time_today):
        players = get_player_data(perform_reset_check=False) # Avoid recursion
        for player in players:
            # 1. Reset the daily ELO change tracker
            player['DailyChange'] = 0

            # 2. Increase confidence (rating deviation) for inactivity
            # This simulates the "decay" of confidence over time.
            # We use a formula inspired by Glicko: new_RD = sqrt(old_RD^2 + c^2)
            # 'c' is a system constant that determines how fast uncertainty grows.
            # A value of ~6 equates to a significant drift over a year.
            c_squared = 6**2 
            old_confidence_sq = player['Confidence']**2
            new_confidence = (old_confidence_sq + c_squared)**0.5

            # Cap the confidence at the initial value (350)
            player['Confidence'] = min(round(new_confidence), _INITIAL_CONFIDENCE)

        write_player_data(players)
        with open(_LAST_RESET_FILE, 'w') as f:
            f.write(now_cst.isoformat())
        print(f"Daily ELO changes have been reset at {now_cst.isoformat()}")

def get_player_data(perform_reset_check=True):
    """Helper function to read and parse player data from the CSV."""
    if perform_reset_check:
        check_and_reset_daily_changes()
        
    players = []
    if not os.path.exists(_ELO_CSV_PATH):
        # If the file doesn't exist, create it with a header.
        with open(_ELO_CSV_PATH, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['Name', 'Character', 'Rating', 'Confidence', 'DailyChange'])
        return []
        
    try:
        with open(_ELO_CSV_PATH, mode='r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                row['Rating'] = int(float(row.get('Rating', 1500)))
                row['Confidence'] = int(float(row.get('Confidence', _INITIAL_CONFIDENCE)))
                row['DailyChange'] = int(float(row.get('DailyChange', 0)))
                players.append(row)
    except Exception as e:
        print(f"An error occurred reading elos.csv: {e}")
    return players


def write_player_data(players):
    """Safely writes the list of player dicts back to the CSV."""
    temp_filepath = _ELO_CSV_PATH + ".tmp"
    final_filepath = _ELO_CSV_PATH
    # Ensure DailyChange is always included in the header
    fieldnames = ['Name', 'Character', 'Rating', 'Confidence', 'DailyChange']
    
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
                    'Confidence': int(player.get('Confidence')),
                    'DailyChange': int(player.get('DailyChange', 0))
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
    
    # Store old ratings to show the change
    old_winner_rating = winner_obj['Rating']
    old_loser_rating = loser_obj['Rating']

    # Calculate new ratings and capture the changes
    new_winner_rating, new_winner_rd, winner_change = new_rating(old_winner_rating, winner_obj['Confidence'], old_loser_rating, loser_obj['Confidence'], 1)
    new_loser_rating, new_loser_rd, loser_change = new_rating(old_loser_rating, loser_obj['Confidence'], old_winner_rating, winner_obj['Confidence'], 0)

    # Update player objects with new stats
    winner_obj['Rating'] = new_winner_rating
    winner_obj['Confidence'] = new_winner_rd
    loser_obj['Rating'] = new_loser_rating
    loser_obj['Confidence'] = new_loser_rd

    # Update daily change trackers
    winner_obj['DailyChange'] = winner_obj.get('DailyChange', 0) + winner_change
    loser_obj['DailyChange'] = loser_obj.get('DailyChange', 0) + loser_change

    write_player_data(all_players)
    
    # Define colors for the message to improve readability
    win_color = "#28a745"  # A nice green
    lose_color = "#dc3545" # A standard red

    # Create a detailed, HTML-formatted message for the flash display
    message = (
        f"<b>Match Processed!</b><br>"
        f'<strong style="color: {win_color};">Winner:</strong> {winner_name} [{winner_char}] '
        f'{old_winner_rating} → {new_winner_rating} <span style="color: {win_color};">({winner_change:+})</span><br>'
        f'<strong style="color: {lose_color};">Loser:</strong> {loser_name} [{loser_char}] '
        f'{old_loser_rating} → {new_loser_rating} <span style="color: {lose_color};">({loser_change:+})</span>'
    )
    return (True, message)


def add_player(name, character):
    """
    Adds a new player-character combination to the data file with default ratings.
    Returns a tuple (success: bool, message: str).
    """
    # Strip whitespace first, then validate. This handles inputs that are only spaces.
    name = name.strip() if name else ""
    character = character.strip() if character else ""

    if not name or not character:
        return (False, "Error: Player name and character cannot be empty.")

    all_players = get_player_data()

    # Check for duplicates (case-insensitive)
    exists = any(p['Name'].lower() == name.lower() and p['Character'].lower() == character.lower() for p in all_players)
    if exists:
        return (False, f"Error: Player '{name}' with character '{character}' already exists.")

    new_player = {
        'Name': name, 'Character': character, 'Rating': 1500, 'Confidence': _INITIAL_CONFIDENCE, 'DailyChange': 0
    }
    all_players.append(new_player)
    write_player_data(all_players)
    
    return (True, f"Successfully added {name} ({character}) to the roster.")