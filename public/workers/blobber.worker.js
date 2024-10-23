import { expose } from "threads/worker";

const blobber = {
    async blob(response) {
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    }
}

expose(blobber)
