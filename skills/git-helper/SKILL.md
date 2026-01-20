---
name: git-helper
category: development
description: Advanced Git operations and workflow automation for version control tasks
---

# Git Helper

Expert assistance for Git version control operations, workflows, and troubleshooting.

## Common Operations

### Branch Management
```bash
# Create and switch to new branch
git checkout -b feature/your-feature

# List all branches (local and remote)
git branch -a

# Delete branch (local)
git branch -d branch-name

# Delete branch (remote)
git push origin --delete branch-name

# Rename branch
git branch -m old-name new-name
```

### Commit Operations
```bash
# Amend last commit
git commit --amend --no-edit

# Amend last commit with message change
git commit --amend -m "New message"

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Interactive rebase for last N commits
git rebase -i HEAD~N
```

### Stash Operations
```bash
# Stash current changes
git stash push -m "description"

# List stashes
git stash list

# Apply stash (keep it)
git stash apply stash@{0}

# Apply and drop stash
git stash pop stash@{0}

# Drop specific stash
git stash drop stash@{0}
```

### Cherry-pick
```bash
# Cherry-pick a commit
git cherry-pick commit-hash

# Cherry-pick multiple commits
git cherry-pick commit1 commit2

# Cherry-pick without committing
git cherry-pick -n commit-hash
```

## Troubleshooting

### Undo Changes
```bash
# Discard local file changes
git checkout -- filename

# Discard all local changes
git reset --hard HEAD

# Revert specific commit (create new commit)
git revert commit-hash
```

### Resolve Merge Conflicts
```bash
# After conflict, check status
git status

# Mark conflict as resolved
git add filename

# Continue merge after resolving
git commit

# Abort merge
git merge --abort
```

### Fix Common Issues
```bash
# Remove untracked files
git clean -f

# Remove untracked files and directories
git clean -fd

# Show commit history for file
git log --follow filename

# Find lost commits
git reflog
```

## Workflow Tips

### Feature Branch Workflow
```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make commits
git add .
git commit -m "Add new feature"

# 3. Push to remote
git push -u origin feature/new-feature

# 4. Create pull request
# (through GitHub/GitLab UI)

# 5. After merge, delete branch
git checkout main
git branch -d feature/new-feature
```

### Sync with Remote
```bash
# Fetch all remote changes
git fetch --all

# See what will be pulled
git log HEAD..origin/main

# Pull with rebase
git pull --rebase

# Push local changes after sync
git push
```
