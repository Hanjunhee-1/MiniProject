import BaseButton from "./BaseButton";
import { FcGoogle } from "react-icons/fc";

type GoogleButtonProps = {
    onClick: () => void;
}

export default function GoogleButton({ onClick }: GoogleButtonProps) {
    return (
        <BaseButton onClick={onClick}>
            <FcGoogle size={30} />
        </BaseButton>
    )
}