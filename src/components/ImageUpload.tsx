import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApiMutation, useUserImages } from '../hooks/useApiQuery';
import { UserContext } from '../contexts/UserContext';
import defaultCover from '../assets/hirebleCoverDefault.png';
import { Pencil } from 'lucide-react';
import { UserInfoDash } from './UserInfoDash';

const ImageUpload: React.FC = () => {
  const { token } = useContext(UserContext);
  const { userId } = useParams<{ userId: string }>();
  const isLoggedIn = Boolean(token);
  const isUsersComponent = !userId && isLoggedIn;

  const {
    fetchImages,
    refetchImages,
    profileImageUrl,
    coverImageUrl,
    isLoading: imagesLoading
  } = useUserImages(userId);

  const coverImage = coverImageUrl;
  const profileImage = profileImageUrl;

  console.log('Cover Image:', coverImage, 'Profile Image:', profileImage);

  useEffect(() => {
    fetchImages(); 
  }, [userId, fetchImages]);

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

      if (type === 'profile') {
        await setProfileMutation.mutateAsync({ __params: { id: imageId } });
      } else {
        await setCoverMutation.mutateAsync({ __params: { id: imageId } });
      }

      refetchImages();
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

        {isUsersComponent && (
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
        )}


        {isUsersComponent && (
          <label htmlFor="cover-upload" className="upload-button cover-button">
            <Pencil size={16} />
          </label>
        )}
      </div>

      <div className="profile-section">
        <div
          className="profile-image-wrapper"
          style={{ backgroundImage: `url(${profileImage || '/default-avatar.png'})` }}
        >

          {isUsersComponent && (
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
          )}


          {isUsersComponent && (
            <label htmlFor="profile-upload" className="upload-button profile-button">
              <Pencil size={14} />
            </label>
          )}
        </div>

        <UserInfoDash />
      </div>
    </div>
  );
};

export default ImageUpload;
