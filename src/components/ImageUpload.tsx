// import {useState, useEffect} from 'react';
// import { useApiMutation } from '../hooks/useApiQuery';
// import { UserContext } from '../contexts/UserContext';

// export default function ImageUpload: React.FC = () {
//   const [uploading, setUploading] = useState(false);
//   const [profileImage, setProfileImage] = useState<string | null>(null);
//   const [coverImage, setCoverImage] = useState<string | null>(null);
//   const { user: contextUser, token } = useContext(UserContext);


// const [error, setError] = useState<string | null>(null);



//   return (
//     <div>
//       <h1> User Images </h1>
//     </div>
//   );
// }


import React, { useContext, useState, useEffect } from 'react';
import { useApiMutation } from '../hooks/useApiQuery';
import { UserContext } from '../contexts/UserContext';

const ImageUpload: React.FC = () => {
  const { user, token } = useContext(UserContext);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  // Fetch user images on component mount
  useEffect(() => {
    const fetchUserImages = async () => {
      try {
        // Fetch user data with image IDs
        const userRes = await fetch('/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!userRes.ok) throw new Error('Failed to fetch user data');
        const userData = await userRes.json();

        // Fetch profile image URL
        if (userData.profileImage) {
          const profileRes = await fetch(`/images/${userData.profileImage}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const profileData = await profileRes.json();
          setProfileImage(profileData.fileUrl);
        }

        // Fetch cover image URL
        if (userData.coverImage) {
          const coverRes = await fetch(`/images/${userData.coverImage}`, {
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

  // Existing upload mutations
  const uploadMutation = useApiMutation('/images', 'POST');
  const setProfileMutation = useApiMutation('/images/:id/profile', 'PUT');
  const setCoverMutation = useApiMutation('/images/:id/cover', 'PUT');

  const handleUpload = async (file: File, type: 'profile' | 'cover') => {
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      // Upload image
      const uploadResult = await uploadMutation.mutateAsync(formData);
      const imageId = uploadResult.image._id;
      const imageUrl = uploadResult.image.fileUrl;

      // Update profile/cover image
      if (type === 'profile') {
        await setProfileMutation.mutateAsync({ __params: { id: imageId } });
        setProfileImage(imageUrl);
      } else {
        await setCoverMutation.mutateAsync({ __params: { id: imageId } });
        setCoverImage(imageUrl);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Image upload failed');
    }
  };

  // console.log()('Profile Image:', profileImage);
  // console.log()('Cover Image:', coverImage);

  return (
    <div className="image-upload-container">
      {/* Profile Image Upload */}
      <div className="upload-section">
        <h3>Profile Image</h3>
        {profileImage && (
          <img
            src={profileImage}
            alt="Profile"
            className="preview-image"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleUpload(e.target.files[0], 'profile');
            }
          }}
          disabled={uploadMutation.isPending || setProfileMutation.isPending}
        />
      </div>

      {/* Cover Image Upload */}
      <div className="upload-section">
        <h3>Cover Image</h3>
        {coverImage && (
          <img
            src={coverImage}
            alt="Cover"
            className="preview-image"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleUpload(e.target.files[0], 'cover');
            }
          }}
          disabled={uploadMutation.isPending || setCoverMutation.isPending}
        />
      </div>
    </div>
  );
};

export default ImageUpload;
