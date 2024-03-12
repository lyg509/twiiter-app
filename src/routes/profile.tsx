import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import React, { useState, useEffect } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const AvatarUpload = styled.label`
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  background-color: #1d9bf0;
  border-radius: 50%;
  cursor: pointer;
  svg {
    width: 50px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;

const AvatarInput = styled.input`
  display: none;
`;

const Name = styled.span`
  font-size: 22px;
`;

const Tweets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const EditButton = styled.button`
  padding: 5px 10px;
  background-color: #1d9bf0;
  border: 0;
  border-radius: 5px;
  font-weight: 600;
  font-size: 12px;
  color: white;
  text-transform: uppercase;
  cursor: pointer;
`;

const Form = styled.form`
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  height: 100%;
`;

const SaveButton = styled.button`
  padding: 5px 10px;
  background-color: #1d9bf0;
  border: 0;
  font-weight: 600;
  font-size: 12px;
  color: white;
  text-transform: uppercase;
  cursor: pointer;
`;

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [editName, setEditName] = useState(user?.displayName ?? "Anonymous");
  const [isEditing, setIsEditing] = useState(false);
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files && files.length === 1) {
      const file = files[0];

      if (!user) return;

      if (file) {
        const locationRef = ref(storage, `avatars/${user?.uid}`);
        const result = await uploadBytes(locationRef, file);
        const avatarUrl = await getDownloadURL(result.ref);

        setAvatar(avatarUrl);
        await updateProfile(user, {
          photoURL: avatarUrl,
        });
      }
    }
  };

  const fetchTweets = async () => {
    const tweetQeury = query(collection(db, "tweets"), where("userId", "==", user?.uid), orderBy("createdAt", "desc"), limit(25));
    const snapshot = await getDocs(tweetQeury);
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, userId, username, photo } = doc.data();

      return { tweet, createdAt, userId, username, photo, id: doc.id };
    });

    setTweets(tweets);
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setEditName(e.target.value);
  const onClick = () => {
    setIsEditing((prev) => !prev);

    if (isEditing) {
      setEditName(user?.displayName ?? "Anonymous");
    }
  };

  const onNameSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);

    try {
      await updateProfile(user, {
        displayName: editName,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput onChange={onAvatarChange} id="avatar" type="file" accept="image/*" />

      {isEditing ? (
        <Form onSubmit={onNameSave}>
          <Input type="text" onChange={onNameChange} value={editName} />
          <SaveButton type="submit">{isSaving ? "Saving.." : "Save"}</SaveButton>
        </Form>
      ) : (
        <Name>{user?.displayName ?? "Anonymous"}</Name>
      )}
      <EditButton onClick={onClick}>{isEditing ? "Cancel" : "Edit name"}</EditButton>

      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
    </Wrapper>
  );
}
