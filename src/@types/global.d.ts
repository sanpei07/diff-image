declare global {
    interface Window {
        myAPI: IMyAPI;
    }
}
export interface IMyAPI {
    myPing:() => void;  
    openDir:(msg:string) => void;
    deleteImage:(path1:string, path2:string) => void;
    onReceiveImages: (listener: (files: string[], message:string) => void) => () => void;
}