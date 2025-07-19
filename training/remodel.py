import json

with open("data/prompts.json", "r", encoding="utf-8") as f:
    pairs = json.load(f)

with open("data/llama_format.txt", "w", encoding="utf-8") as out:
    for item in pairs:
        prompt = item["prompt"].strip().replace("\n", " ")
        response = item["response"].strip().replace("\n", " ")
        out.write(f"<s>[INST] {prompt} [/INST] {response} </s>\n")
