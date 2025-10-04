import pytest
import csv

# Import from the 'app' package, assuming tests are run from the project root.
from app.smash import get_color_for_name, add_player, get_player_data, _INITIAL_CONFIDENCE

@pytest.fixture
def mock_smash_data_files(tmp_path, monkeypatch):
    """
    Pytest fixture to create temporary data files (elos.csv, last_reset_date.txt)
    and monkeypatch the paths in the smash module to use them.
    This ensures tests are isolated and don't touch the real data.
    """
    temp_data_dir = tmp_path / "data"
    temp_data_dir.mkdir()

    temp_elo_csv = temp_data_dir / "elos.csv"
    temp_reset_file = temp_data_dir / "last_reset_date.txt"

    # Monkeypatch the global path variables in the 'smash' module
    monkeypatch.setattr('app.smash._ELO_CSV_PATH', str(temp_elo_csv))
    monkeypatch.setattr('app.smash._LAST_RESET_FILE', str(temp_reset_file))


def test_get_color_for_cpu():
    """
    Tests that any name starting with 'CPU' (case-insensitive)
    always returns the specific hardcoded gray color.
    """
    assert get_color_for_name("CPU1") == "#9E9E9E"
    assert get_color_for_name("cpu9") == "#9E9E9E"
    assert get_color_for_name("CpuPlayer") == "#9E9E9E"

def test_get_color_for_player_is_consistent():
    """
    Tests that calling the function multiple times with the same
    player name consistently returns the same color.
    """
    color1 = get_color_for_name("Abe")
    color2 = get_color_for_name("Abe")
    assert color1 == color2

def test_get_color_for_different_players_is_different():
    """
    Tests that two different player names produce different colors.
    While hash collisions are theoretically possible, they should be extremely rare.
    """
    color_abe = get_color_for_name("Abe")
    color_jt = get_color_for_name("JT")
    assert color_abe != color_jt
    assert get_color_for_name("Joey") != get_color_for_name("Kevin")


# --- Tests for add_player function ---

def test_add_player_success(mock_smash_data_files):
    """
    Tests that a new player can be successfully added to an empty file.
    """
    success, message = add_player("TestPlayer", "TestChar")
    assert success is True
    assert message == "Successfully added TestPlayer (TestChar) to the roster."

    # Verify the data was written correctly
    players = get_player_data(perform_reset_check=False)
    assert len(players) == 1
    new_player = players[0]
    assert new_player['Name'] == "TestPlayer"
    assert new_player['Character'] == "TestChar"
    assert new_player['Rating'] == 1500
    assert new_player['Confidence'] == _INITIAL_CONFIDENCE

def test_add_player_duplicate_fails(mock_smash_data_files):
    """
    Tests that adding a duplicate player (case-insensitive) fails.
    """
    # Add the first player
    add_player("TestPlayer", "TestChar")
    
    # Try to add the same player again with different casing
    success, message = add_player("testplayer", "testchar")
    
    assert success is False
    assert "already exists" in message

    # Ensure only one player is in the data file
    players = get_player_data(perform_reset_check=False)
    assert len(players) == 1

def test_add_player_empty_name_fails(mock_smash_data_files):
    """
    Tests that adding a player with an empty name fails.
    """
    success, message = add_player("", "SomeChar")
    assert success is False
    assert "cannot be empty" in message

    success, message = add_player("   ", "SomeChar") # Test with whitespace
    assert success is False
    assert "cannot be empty" in message