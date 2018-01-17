import { CrossStorageHub } from "cross-storage";

CrossStorageHub.init([
    {
        origin: /.*/,
        allow: [ "get", "set" ]
    }
]);