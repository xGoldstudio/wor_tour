export default function ImageManager() {
  async function addImage(imageFile: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", imageFile);

    const response = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });
    const json = await response.json();
    if (json.error) {
      return null;
    }
    // wait 100ms to let vite the time to make the image available
    await new Promise((resolve) => setTimeout(resolve, 200));
    return json.fileName as string;
  }

  return {
    addImage,
  };
}
