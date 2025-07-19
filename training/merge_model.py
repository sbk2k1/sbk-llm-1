import torch
import os
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel
from dotenv import load_dotenv

load_dotenv()


def merge_lora_model():
    print("Loading base model...")

    # Load base model and tokenizer
    base_model_name = "meta-llama/Llama-3.2-1B"

    # Load base model (use same settings as training for consistency)
    base_model = AutoModelForCausalLM.from_pretrained(
        base_model_name,
        torch_dtype=torch.float16,
        device_map="auto",
        token="token",
    )

    # Load tokenizer
    tokenizer = AutoTokenizer.from_pretrained(
        base_model_name,
        token="token",
    )

    # Set padding token if it doesn't exist
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    print("Loading LoRA adapter...")

    # Load LoRA adapter from final_model directory
    model_with_adapter = PeftModel.from_pretrained(base_model, "./final_model")

    print("Merging LoRA adapter with base model...")

    # Merge and unload the adapter
    merged_model = model_with_adapter.merge_and_unload()

    print("Saving merged model...")

    # Create output directory
    output_dir = "./merged_model"
    os.makedirs(output_dir, exist_ok=True)

    # Save the merged model and tokenizer
    merged_model.save_pretrained(output_dir)
    tokenizer.save_pretrained(output_dir)

    print(f"✅ Model successfully merged and saved to {output_dir}")
    print("You can now serve it with vLLM using: ./merged_model")


if __name__ == "__main__":
    merge_lora_model()
