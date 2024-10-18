import sys
import os

def print_stage(stage_number):
    stage_identifiers = {
        "1": "Building Next.js application",
        "2": "Formatting index.html",
        "3": "Obfuscating Next.js JavaScript build code",
        "4": "Building Electron .app and .dmg files",
        "5": "Copying application to desktop"
    }

    stage_icons = {
        "1": "🧱 🚜 🦺 🚧 🔧",
        "2": "📝 📝 📝 📝 📝",
        "3": "😵‍💫 🤔 💫 🥴 😵‍💫",
        "4": "🏡 🏬 🏫 🏢 🏦",
        "5": "✅ 🏃 🏃‍♂️‍➡️ ⏩ 🖥️ "
    }

    # Check if the stage number exists in the identifiers
    if stage_number not in stage_identifiers:
        print(f"Error: Invalid stage number {stage_number}. Valid options are: {list(stage_identifiers.keys())}")
        sys.exit(1)

    terminal_width = os.get_terminal_size().columns
    dashes = '-' * terminal_width

    # Create the message
    stage_message = f"{stage_icons[stage_number]} < {stage_identifiers[stage_number]} > {stage_icons[stage_number][::-1]}"
    total_message_length = len(stage_message) + 4  # 4 for the surrounding spaces
    if total_message_length > terminal_width:
        # Truncate if message exceeds terminal width
        stage_message = stage_message[:terminal_width - 4] + '...'

    padding_length = (terminal_width - total_message_length) // 2
    padded_message = f"{' ' * padding_length}{stage_message}"

    print("\n" + dashes)
    print(padded_message)
    print(dashes + "\n")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 print_stage.py <stage_number>")
        sys.exit(1)

    # Convert stage_number to an integer
    stage_number = sys.argv[1]
    print_stage(stage_number)
