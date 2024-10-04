import { expose } from "threads/worker";

export default expose(async function blob(response) {
    const blob = await response.blob();
    return URL.createObjectURL(blob);
}) 