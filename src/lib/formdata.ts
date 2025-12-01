interface PostRequest {
    content: string;
  }
  
  export function buildFormData(post: PostRequest, files: File[]): FormData {
    const formData = new FormData();
    const jsonBlob = new Blob([JSON.stringify(post)], { type: "application/json" });

    formData.append("data", jsonBlob);
  
    files.forEach(file => {
      formData.append("images", file);
    });  
    return formData;
  }
  