import { useParams as useParams___React } from "react-router-dom";

export { useParams___React }

export default function useParams() {
    const params = useParams___React();
    return { ...params, username: params.username.replaceAll("@", "") }
}