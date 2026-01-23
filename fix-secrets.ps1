# Script to remove secrets from git history
# Run this from the megicode directory

cd e:\megicode

# Disable git pager
$env:GIT_PAGER = "cat"
[Environment]::SetEnvironmentVariable("GIT_PAGER", "cat", "Process")

# Use git filter-branch to remove the secret files from all commits
Write-Host "Removing secrets from git history..."
git filter-branch -f --tree-filter 'rm -f .env.production set-vercel-env.ps1' -- --all

# Clean up backup refs
Write-Host "Cleaning up backup references..."
Remove-Item .git\refs\original\ -Recurse -Force -ErrorAction SilentlyContinue
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push to remote
Write-Host "Force pushing to remote..."
git push -f origin main

Write-Host "Complete! Secrets have been removed from history."
