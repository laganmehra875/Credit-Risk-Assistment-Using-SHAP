import json

file_path = "/Users/mac/Downloads/ML Project/credit Risk.ipynb"

with open(file_path, "r") as f:
    nb = json.load(f)

changed = False
for cell in nb.get("cells", []):
    if cell.get("cell_type") == "code":
        source = cell.get("source", [])
        for i, line in enumerate(source):
            if "Best Threshold:{best_threshold}" in line:
                source[i] = line.replace("best_threshold", "threshold")
                changed = True

if changed:
    with open(file_path, "w") as f:
        json.dump(nb, f, indent=1)
    print("Fixed NameError")
else:
    print("String not found")
