const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "chat-app-file");

    const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/auto/upload`, {
        method: "POST",
        body: formData,
    });

    const responseData = await response.json();

    // ✅ Return only the secure URL to avoid mixed content issues
    return responseData.secure_url || responseData.url;
};

export default uploadFile;
