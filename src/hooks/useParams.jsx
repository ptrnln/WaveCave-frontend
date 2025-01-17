import { useParams as useParamsReact } from "react-router-dom";

export { useParamsReact }

export default function useParams() {
    const params = useParamsReact();
    return { ...params, username: params.username.replaceAll("@", "") }
}