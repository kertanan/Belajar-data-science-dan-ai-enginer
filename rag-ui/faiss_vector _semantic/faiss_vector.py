from langchain_huggingface import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
import os 
from tourch import cuda

folder_pathg = r "null"
documents = []

#read all file with extention .txt
for filenmae in os.listdir(folder_pathg) : 
    if filenmae.endswith ("txt") : 
        file_path = os.path.join(folder_pathg, filenmae)
        with open(file_path, "r", encoding="utf-8") as file_system:
            content = file_system.read()
            documents.append(content)

text_splittter =  CharacterTextSplitters(chunk_size = 1000, chunk_overlap = 30)
docs =  text_splittter.create_documents(documents)

embadings = HuggingFaceEmbaddings(model_name= "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")

db = FAISS.from_documents(docs, embaddings)
db
#querry mencari docs yang mirip dengan pertanyaan]
query = "testing"
docs = db.similarity_search(query)
print(docs[0].page_content)


#retrieving docs yang mirip dengan que
retriever = db.as_retriever()
docs = retriever.get_relevant_documents(query)
print(docs[0].page_content)



#similarity search with score
device = f"cuda"{cuda.current_device()}" if cuda.is_available() else "cpu"_)

def save_faiss_index(db, index_path):
    db.save_local(index_path)
    document = CSVLoader(file_path=file_path, encoding : encoding).load()
    db = FAISS.from_documents(documents=document, embedding=embedding, normalize_L2=True)
    db.save_local(index_name=index_name, folder_path=save_path)


def get_false_index( index_name : str "label_remark_openai_index",
                    folder_path : str = "faiss_index"):
    index_path = os.path.join(folder_path, index_name)
    if not os.path.exists(index_path):
        raise ValueError(f"Index {index_name} does not exist in {folder_path}.")
    db = FAISS.load_local(index_path, embedding=embedding)
    return db

def get_faiss_index(index_name : str = "label_remark_openai_index",
                    folder_path : str = "faiss_index"):
    index_path = os.path.join(folder_path, index_name)
    if not os.path.exists(index_path):
        raise ValueError(f"Index {index_name} does not exist in {folder_path}.")
    db = FAISS.load_local(index_path, embedding=embedding)
    return db

return local_db


if __name__ == '__main__':
    index = get_faiss_index()
    docs_and_scores = index.similarity_search_with_score("query text", k=10)
    for doc, score in docs_and_scores:
        print(f"Content: {doc.page_content}, Metadata: {doc.metadata}, Score: {score}")
