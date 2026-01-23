#!/usr/bin/env python3
import os
import subprocess
import sys
import shutil

os.chdir(r'e:\megicode')

# First, abort any stuck rebase
print("Checking for stuck rebase...")
rebase_dir = r'.git\rebase-merge'
if os.path.exists(rebase_dir):
    print("Found stuck rebase, removing...")
    shutil.rmtree(rebase_dir)
    print("Removed rebase directory")

# Check git status
print("\nCurrent git status:")
result = subprocess.run(['git', 'status', '--short'], capture_output=True, text=True)
print(result.stdout)

# Now run filter-branch to remove secrets
print("\nRemoving secrets from git history...")
env = os.environ.copy()
env['GIT_PAGER'] = ''

result = subprocess.run(
    ['git', 'filter-branch', '-f', '--tree-filter', 'rm -f .env.production set-vercel-env.ps1', 'HEAD'],
    capture_output=True,
    text=True,
    env=env
)

print(result.stdout)
if result.stderr:
    print("STDERR:", result.stderr)

# Clean up
print("\nCleaning up...")
orig_head = r'.git\refs\original'
if os.path.exists(orig_head):
    shutil.rmtree(orig_head)

subprocess.run(['git', 'reflog', 'expire', '--expire=now', '--all'], capture_output=True)
subprocess.run(['git', 'gc', '--prune=now', '--aggressive'], capture_output=True)

# Force push
print("\nForce pushing to remote...")
result = subprocess.run(['git', 'push', '-f', 'origin', 'main'], capture_output=True, text=True)
print(result.stdout)
if result.returncode != 0:
    print("Push output:", result.stderr)
    sys.exit(1)

print("\nSuccess! Secrets removed and pushed.")
