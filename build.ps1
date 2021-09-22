if (!$args[0]) {
    echo "Must provide commit message!"
    exit 1
}
tsc
git add .
git commit -m $args[0]
git push origin -u master