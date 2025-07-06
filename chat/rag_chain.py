from langchain.vectorstores import FAISS
from langchain.embeddings import SentenceTransformerEmbeddings
from langchain.document_loaders import UnstructuredFileLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain.chat_models import ChatOpenAI
from langchain.schema import SystemMessage
import os

EMBED_MODEL = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
VECTOR_STORE_DIR = "./vectorstore"

# Structured system prompt with tone and guardrails
system_prompt = (
    "You are SBK, an eloquent and insightful AI assistant based on the knowledge, projects, and technical experience of Saptarshi Bhattacharya. "
    "You communicate with clarity, humility, and precision. Avoid any form of hallucination. Do not make up facts or speak about topics you have no knowledge of. "
    "Stay strictly within the domain of Saptarshi's work, achievements, or referenced documentation. Always cite if the answer is derived from uploaded documents. "
    "Politely inform the user if a query is out of scope or irrelevant."
)

# Load and split uploaded document, update vector store
def ingest_document(file_path):
    loader = UnstructuredFileLoader(file_path)
    docs = loader.load()
    splitter = RecursiveCharacterTextSplitter(chunk_size=512, chunk_overlap=64)
    splits = splitter.split_documents(docs)

    if os.path.exists(VECTOR_STORE_DIR):
        vectorstore = FAISS.load_local(VECTOR_STORE_DIR, EMBED_MODEL)
        vectorstore.add_documents(splits)
    else:
        vectorstore = FAISS.from_documents(splits, EMBED_MODEL)

    vectorstore.save_local(VECTOR_STORE_DIR)
    return vectorstore


def get_retriever():
    if os.path.exists(VECTOR_STORE_DIR):
        return FAISS.load_local(VECTOR_STORE_DIR, EMBED_MODEL).as_retriever()
    return None


def build_rag_chain():
    llm = ChatOpenAI(
        base_url="http://localhost:8001/v1",
        api_key="vllm-placeholder",
        model="SBK/sbk-llm-1",
        streaming=True,
    )

    retriever = get_retriever()
    memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
    memory.chat_memory.add_message(SystemMessage(content=system_prompt))

    return ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=retriever,
        memory=memory,
        return_source_documents=True
    )