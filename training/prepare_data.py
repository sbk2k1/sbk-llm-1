import json

with open("data/prompts.json", "r") as f:
    examples = json.load(f)

with open("data/formatted_data.jsonl", "w") as out:
    for ex in examples:
        prompt = f"### Question:\n{ex['prompt']}\n\n### Answer:\n{ex['response']}"
        out.write(json.dumps({"text": prompt}) + "\n")
