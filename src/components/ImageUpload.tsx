import React, { useContext, useState, useEffect } from 'react';
import { useApiMutation } from '../hooks/useApiQuery';
import { UserContext } from '../contexts/UserContext';
const baseUrl = import.meta.env.VITE_API_URL

const ImageUpload: React.FC = () => {
  const { token } = useContext(UserContext);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);



  useEffect(() => {
    const fetchUserImages = async () => {
      try {

       const userRes = await fetch(`${baseUrl}/users/current`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});



        if (!userRes.ok) throw new Error('Failed to fetch user data');
        const userData = await userRes.json();



        if (userData.profileImage) {
          const profileRes = await fetch(`${baseUrl}/images/${userData.profileImage}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const profileData = await profileRes.json();
          setProfileImage(profileData.fileUrl);
          console.log('Profile Image:', profileData.fileUrl);
        }


        if (userData.coverImage) {
          const coverRes = await fetch(`${baseUrl}/${userData.coverImage}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const coverData = await coverRes.json();
          setCoverImage(coverData.fileUrl);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    if (token) {
      fetchUserImages();
    }
  }, [token]);


  const uploadMutation = useApiMutation('/images', 'POST');
  const setProfileMutation = useApiMutation('/images/:id/profile', 'PUT');
  const setCoverMutation = useApiMutation('/images/:id/cover', 'PUT');

  const handleUpload = async (file: File, type: 'profile' | 'cover') => {
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const uploadResult = await uploadMutation.mutateAsync(formData);
      const imageId = uploadResult.image._id;
      const imageUrl = uploadResult.image.fileUrl;


      if (type === 'profile') {
        await setProfileMutation.mutateAsync({ __params: { id: imageId } });
        setProfileImage(imageUrl);
          console.log('Profile Image:', profileImage);
      } else {
        await setCoverMutation.mutateAsync({ __params: { id: imageId } });
        setCoverImage(imageUrl);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Image upload failed');
    }
  };



 return (
    <div className="linkedin-profile-container">
      {/* Cover Image Section with Upload */}
      <div
        className="cover-image-section"
        style={{
          backgroundImage: `url(${coverImage || 'https://eiti.org/sites/default/files/styles/open_graph_image/public/2024-03/EITI_Standard_background.png?itok=Z0AUKTak'})`
        }}
      >
        <div className="cover-upload-overlay">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleUpload(e.target.files[0], 'cover');
              }
            }}
            disabled={uploadMutation.isPending || setCoverMutation.isPending}
            id="cover-upload"
            className="hidden-input"
          />
          <label htmlFor="cover-upload" className="upload-button cover-btn">
            {uploadMutation.isPending || setCoverMutation.isPending ? (
              <span>📤 Uploading...</span>
            ) : (
              <span>📷 {coverImage ? 'Change cover' : 'Add cover photo'}</span>
            )}
          </label>
        </div>
      </div>

      {/* Profile Picture Section with Upload */}
      <div className="profile-section">
        <div
          className="profile-picture"
          style={{
            backgroundImage: `url(${profileImage || 'https://st3.depositphotos.com/9998432/13335/v/450/depositphotos_133352156-stock-illustration-default-placeholder-profile-icon.jpg'})`
          }}
        >
          <div className="profile-upload-overlay">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleUpload(e.target.files[0], 'profile');
                }
              }}
              disabled={uploadMutation.isPending || setProfileMutation.isPending}
              id="profile-upload"
              className="hidden-input"
            />
            <label htmlFor="profile-upload" className="upload-button profile-btn">
              {uploadMutation.isPending || setProfileMutation.isPending ? (
                <span>⏳</span>
              ) : (
                <span>📷</span>
              )}
            </label>
          </div>
        </div>

        {/* User Info Section */}
        <div className="user-info">
          <h1>Your Name</h1>
          <p className="headline">Add your professional headline</p>
          <p className="location">📍 Your Location</p>
        </div>
      </div>

     
      {(uploadMutation.isPending || setProfileMutation.isPending || setCoverMutation.isPending) && (
        <div className="upload-status">
          <p>Uploading your image...</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
