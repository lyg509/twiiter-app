import { useState } from "react";
import styled from "styled-components";
import { auth } from "../firebase";
import { updateProfile } from "firebase/auth";

interface EditInfo {
  name: string | undefined | null;
  toggle: any;
}

const Form = styled.form`
  display: flex;
  flex-direction: row;
  gap: 5px;
`;
const NameInput = styled.input`
  border: 1px solid white;
  padding: 5px 5px 5px 10px;
  border-radius: 10px;
  font-size: 16px;
  color: white;
  background-color: transparent;
`;
const Button = styled.input<{ color?: string }>`
  background-color: ${(props) => props.color || "gray"};
  border: none;
  padding: 0 10px;
  color: white;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    scale: 1.07;
  }
`;

export default function EditProfileNameForm({ name, toggle }: EditInfo) {
  const [editName, setEditName] = useState(name);
  const onToggle = () => {
    toggle(false);
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditName(e.target.value);
  };
  const onSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user || editName === "") return;
    await updateProfile(user, {
      displayName: editName,
    });
    toggle(false);
    try {
    } catch (e) {
      console.log(e);
    }
  };
  if (editName)
    return (
      <Form onSubmit={onSubmit}>
        <NameInput onChange={onChange} value={editName} maxLength={10} />
        <Button type="submit" value={"수정"} />
        <Button type="button" color={"tomato"} value={"취소"} onClick={onToggle} />
      </Form>
    );
}
