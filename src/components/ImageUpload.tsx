import React, { useContext, useState, useEffect } from 'react';
import { useApiMutation } from '../hooks/useApiQuery';
import { UserContext } from '../contexts/UserContext';
import defaultCover from '../assets/hirebleCoverDefault.png';
import { Pencil } from 'lucide-react';
import { UserInfoDash } from './UserInfoDash';


const baseUrl = import.meta.env.VITE_API_URL;

const ImageUpload: React.FC = () => {
  const { token } = useContext(UserContext);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);


  useEffect(() => {
    const fetchUserImages = async () => {
      try {
        const userRes = await fetch(`${baseUrl}/users/current`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!userRes.ok) throw new Error('Failed to fetch user data');
        const userData = await userRes.json();

        if (userData.profileImage) {
          const profileRes = await fetch(`${baseUrl}/images/${userData.profileImage}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const profileData = await profileRes.json();
          setProfileImage(profileData.fileUrl);
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
      } else {
        await setCoverMutation.mutateAsync({ __params: { id: imageId } });
        setCoverImage(imageUrl);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Image upload failed');
    }
  };

  const isUploading = uploadMutation.isPending || setProfileMutation.isPending || setCoverMutation.isPending;

    return (
    <div className="image-upload-container">

      <div
        className="cover-section"
        style={{ backgroundImage: `url(${coverImage || defaultCover})` }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleUpload(e.target.files[0], 'cover');
            }
          }}
          disabled={isUploading}
          className="file-input cover-input"
          id="cover-upload"
        />
       <label htmlFor="cover-upload" className="upload-button cover-button">
          <Pencil size={16} />
        </label>
      </div>


      <div className="profile-section">
        <div className="profile-image-wrapper" style={{ backgroundImage: `url(${profileImage || `url(')`})` }}>


            <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleUpload(e.target.files[0], 'profile');
            }
          }}
          disabled={isUploading}
          className="file-input profile-input"
          id="profile-upload"
        />
       <label htmlFor="profile-upload" className="upload-button profile-button">
          <Pencil size={14} />
        </label>
        </div>

          <UserInfoDash />
      </div>
    </div>
  );
};

export default ImageUpload;
