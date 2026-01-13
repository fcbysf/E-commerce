import { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";

const ImageUploadInput = ({ imageSelected, dejaImg, setimg }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
    imageSelected(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeImage = () => {
    if(dejaImg){
      setimg(null)
    }
    setSelectedImage(null);
    setPreview(null);
  };

  return (
    <div className="w-2/3 max-w-md">
      <div className="">
        <label className="font-semibold text-[#151717]">
          Upload Image (optional)
        </label>

        {(!preview && !dejaImg) ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative border-2 border-dashed mt-2.5 rounded-2xl p-4 text-center transition-all duration-300 cursor-pointer group ${
              isDragging
                ? "border-indigo-500 bg-indigo-50 scale-[1.02]"
                : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50"
            }`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />

            <div className="pointer-events-none">
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isDragging
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 scale-110"
                    : "bg-slate-100 group-hover:bg-indigo-100"
                }`}
              >
                <Upload
                  className={`w-8 h-8 transition-colors ${
                    isDragging
                      ? "text-white"
                      : "text-slate-400 group-hover:text-indigo-500"
                  }`}
                />
              </div>

              <p className="text-slate-700 font-semibold mb-2">
                {isDragging
                  ? "Drop it here!"
                  : "Click to upload or drag and drop"}
              </p>
              <p className="text-sm text-slate-500">PNG, JPG, GIF up to 2MB</p>
            </div>
          </div>
        ) : (
          <div className="relative rounded-2xl mt-2.5 overflow-hidden border-2 border-slate-200">
            <img
              src={preview || dejaImg}
              alt="Preview"
              className="w-full max-h-40 rounded-xl object-contain "
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            ({
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div>
                    <p className="font-semibold text-sm">
                      {!selectedImage?.name&&null || selectedImage?.name}
                    </p>
                    <p className="text-xs text-white/80">
                      {(selectedImage?.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div
                  onClick={removeImage}
                  className="w-10 h-10 rounded-xl bg-red-500/90 hover:bg-red-600 backdrop-blur-sm flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 border-0" />
                </div>
              </div>
            </div>
})
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadInput;
