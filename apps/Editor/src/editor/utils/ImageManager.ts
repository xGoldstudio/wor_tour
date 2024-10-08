export default function ImageManager() {
  async function addImage(imageFile: File, fileName: string): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", imageFile);
    const response = await fetch(`http://localhost:3000/upload/${fileName}`, {
      method: "POST",
      body: formData,
    });
    const json = await response.json();
    if (json.error) {
      return null;
    }
    return json.fileName as string;
  }

  return {
    addImage,
  };
}
