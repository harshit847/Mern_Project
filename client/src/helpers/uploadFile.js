const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_preset_name"); // Cloudinary ka preset

    const response = await fetch(
        "https://api.cloudinary.com/v1_1/drxlmu23f/image/upload",
        {
            method: "POST",
            body: formData,
        }
    );

    const data = await response.json();
    return data.secure_url; // ✅ HTTPS wala URL
};
