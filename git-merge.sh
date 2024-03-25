git remote add spruce https://github.com/evergreen-ci/spruce.git
git fetch spruce main
git branch spruce-main spruce/main
git checkout spruce-main
mkdir -p apps/spruce
git ls-tree -z --name-only HEAD | xargs -0 -I {} git mv {} apps/spruce
git add .
git commit -m "Moved Spruce into apps/"
git checkout main
git merge --allow-unrelated-histories spruce-main

git remote add parsley https://github.com/evergreen-ci/parsley.git
git fetch parsley main
git branch parsley-main parsley/main
git checkout parsley-main
mkdir -p apps/parsley
git ls-tree -z --name-only HEAD | xargs -0 -I {} git mv {} apps/parsley
git add .
git commit -m "Moved Parsley into apps/"
git checkout main
git merge --allow-unrelated-histories parsley-main
