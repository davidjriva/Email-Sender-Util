import os
import re

# File to modify
file_path = "./out/index.html"

# Check if the file exists
if not os.path.isfile(file_path):
    print(f"File not found: {file_path}")
    exit(1)

# Read the contents of the file
with open(file_path, 'r') as file:
    content = file.read()

# Replace all instances of /_next with ./_next
content = content.replace("/_next", "./_next")

content = content.replace("../_next", "./_next")

# Write the modified content back to the file
with open(file_path, 'w') as file:
    file.write(content)

print(f"Replaced all instances of '/_next' with './_next' and '../_next' with './_next' (preserving quotes) in {file_path}")
