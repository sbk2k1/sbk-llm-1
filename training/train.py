import os

from datasets import load_dataset
from colorama import Fore

from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
from trl import SFTTrainer, SFTConfig
from peft import LoraConfig, prepare_model_for_kbit_training
import torch

from dotenv import load_dotenv

load_dotenv()

dataset = load_dataset("data", split="train")
print("dataset length: ", len(dataset))
print(Fore.YELLOW + str(dataset[0]) + Fore.RESET)


def format_chat_template(batch, tokenizer):
    system_prompt = """You are a helpful, honest and harmless assitant designed to help engineers. Think through each question logically and provide an answer. Don't make things up, if you're unable to answer a question advise the user that you're unable to answer as it is outside of your scope."""

    samples = []

    # Access the inputs from the batch
    questions = batch["question"]
    answers = batch["answer"]

    for i in range(len(questions)):
        row_json = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": questions[i]},
            {"role": "assistant", "content": answers[i]},
        ]

        # Apply chat template and append the result to the list
        tokenizer.chat_template = "{% set loop_messages = messages %}{% for message in loop_messages %}{% set content = '<|start_header_id|>' + message['role'] + '<|end_header_id|>\n\n'+ message['content'] | trim + '<|eot_id|>' %}{% if loop.index0 == 0 %}{% set content = bos_token + content %}{% endif %}{{ content }}{% endfor %}{% if add_generation_prompt %}{{ '<|start_header_id|>assistant<|end_header_id|>\n\n' }}{% endif %}"
        text = tokenizer.apply_chat_template(row_json, tokenize=False)
        samples.append(text)

    # Return a dictionary with lists as expected for batched processing
    return {
        "instruction": questions,
        "response": answers,
        "text": samples,  # The processed chat template text for each row
    }


base_model = "meta-llama/Llama-3.2-1B"

# Fix for dtype mismatch: Ensure tokenizer padding token is set to avoid attention mask issues
tokenizer = AutoTokenizer.from_pretrained(
    base_model,
    trust_remote_code=True,
    token=os.getenv("HF_TOKEN"),
)
# Add padding token if it doesn't exist (common issue with Llama models)
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token

train_dataset = dataset.map(
    lambda x: format_chat_template(x, tokenizer),
    num_proc=8,
    batched=True,
    batch_size=10,
)
print(Fore.LIGHTMAGENTA_EX + str(train_dataset[0]) + Fore.RESET)


# Fix for dtype mismatch: Use float16 consistently throughout the pipeline
# This resolves both "Expected attn_mask dtype" and "expected mat1 and mat2 to have the same dtype" errors
quant_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.float16,  # Use float16 for better compatibility with quantization
)

model = AutoModelForCausalLM.from_pretrained(
    base_model,
    torch_dtype=torch.float16,  # Use float16 to match quantization compute dtype
    device_map="cuda:0",
    quantization_config=quant_config,
    token=os.getenv("HF_TOKEN"),
    cache_dir="./workspace",
    # Fix for dtype mismatch: Use eager attention since flash_attn is not installed
    # If you want to use flash attention, install it with: pip install flash-attn --no-build-isolation
    attn_implementation="eager",  # Use eager attention (default) instead of flash attention
)

print(str(model))

model.gradient_checkpointing_enable()
model = prepare_model_for_kbit_training(model)

# Fix for dtype mismatch: The model dtype is already set correctly during loading
# Cannot cast bitsandbytes models after loading - dtype must be consistent from start

peft_config = LoraConfig(
    r=256,
    lora_alpha=512,
    lora_dropout=0.05,
    target_modules="all-linear",
    task_type="CAUSAL_LM",
)

# Fix for dtype mismatch: Configure SFTConfig with proper settings for quantized models
sft_config = SFTConfig(
    output_dir="meta-llama/Llama-3.2-1B-SFT",
    num_train_epochs=50,
    # Essential settings for quantized model training
    dataloader_drop_last=True,
    remove_unused_columns=False,
    per_device_train_batch_size=1,
    gradient_accumulation_steps=8,
    # Fix for dtype mismatch: Use fp16 training to match model dtype
    fp16=True,  # Enable fp16 training to match the model's float16 dtype
    dataloader_pin_memory=False,  # Disable pin memory to avoid potential dtype issues
)

trainer = SFTTrainer(
    model,
    train_dataset=train_dataset,
    args=sft_config,
    peft_config=peft_config,
)

trainer.train()

trainer.save_model("complete_checkpoint")
trainer.model.save_pretrained("final_model")
