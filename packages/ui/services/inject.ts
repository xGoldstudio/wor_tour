import ImageManagerService from "./ImageManagerService/imageManagerService";
import LoadingService from "./LoadingService/loadingService";

export const imageManagerService = ImageManagerService();

export const loadingService = LoadingService();
loadingService.init();