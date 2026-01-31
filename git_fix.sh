#!/bin/bash

# This script converts a folder downloaded as a ZIP into a proper Git repository
# so the bot's .update command can work.

# Check if the .git folder already exists (meaning it's already a repo)
if [ -d ".git" ]; then
    echo "✅ This folder is already a Git repository. No action needed."
    exit 0
fi

echo "--- Initializing Git Repository ---"

# 1. Initialize a new Git repository
git init

# 2. Add the remote origin (the GitHub repository)
git remote add origin https://github.com/MTE2011/REZERO-MD.git

# 3. Fetch the history from the remote
git fetch

# 4. Create a new branch 'main' and switch to it
git branch -M main

# 5. Add all current files to the new repository
git add .

# 6. Commit the current state of the files (this is their local version)
git commit -m "Initial commit of ZIP contents (before connecting to remote)"

# 7. Pull the remote history and merge it with the local files.
# This is the crucial step that connects their local files to the remote history.
# The --allow-unrelated-histories flag is needed because the local commit history
# is different from the remote's history.
echo "--- Merging with Remote History ---"
git pull origin main --allow-unrelated-histories

echo "--- Git Repository Setup Complete ---"
echo "You can now use the .update command in your Discord bot."
echo "If you have any local changes, they will be merged with the remote."
echo "If you want to discard local changes and get the latest from GitHub, run:"
echo "git reset --hard origin/main"
