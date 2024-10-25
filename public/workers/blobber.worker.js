import { expose } from "threads/worker";

expose({async blob(response) {
    const blob = await response.blob();
    return URL.createObjectURL(blob);
}});
